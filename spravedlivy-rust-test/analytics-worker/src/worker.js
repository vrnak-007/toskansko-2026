const API_VERSION = "1";
const DEFAULT_CONSENT_VERSION = "2026-07-16-v1";
const MAX_BODY_BYTES = 48_000;
const MAX_ADMIN_ROWS = 5_000;
const QUIZ_URL = "https://vrnak-007.github.io/toskansko-2026/spravedlivy-rust-test/";

const METRIC_RANGES = {
  leftRight:[0,100], redistribution:[0,100], stateCapacity:[0,100], efficiency:[0,100], integrity:[0,100],
  economicFreedom:[0,100], civicFreedom:[0,100], targetPrecision:[0,100], coverage:[0,100], fiscal:[0,100],
  growthPotential:[0,100], timeAutonomy:[0,100], adminSimplicity:[0,100], familyImpact:[0,100],
  taxQuota:[20,50], gdp10:[-10,15], familyMoney:[0,500000], freeTimeHours:[0,80], targetPct:[0,100],
  coveragePct:[0,100], leakMin:[0,100], leakMax:[0,100]
};

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  participant_hash TEXT NOT NULL,
  received_at TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  consented_at TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  quiz_version TEXT NOT NULL,
  archetype TEXT NOT NULL,
  left_right INTEGER NOT NULL,
  redistribution INTEGER NOT NULL,
  state_capacity INTEGER NOT NULL,
  efficiency INTEGER NOT NULL,
  integrity INTEGER NOT NULL,
  economic_freedom INTEGER NOT NULL,
  civic_freedom INTEGER NOT NULL,
  target_precision INTEGER NOT NULL,
  coverage INTEGER NOT NULL,
  fiscal INTEGER NOT NULL,
  growth_potential INTEGER NOT NULL,
  time_autonomy INTEGER NOT NULL,
  admin_simplicity INTEGER NOT NULL,
  family_impact INTEGER NOT NULL,
  tax_quota REAL NOT NULL,
  gdp10 REAL NOT NULL,
  family_money INTEGER NOT NULL,
  free_time_hours REAL NOT NULL,
  target_pct INTEGER NOT NULL,
  coverage_pct INTEGER NOT NULL,
  leak_min INTEGER NOT NULL,
  leak_max INTEGER NOT NULL,
  source_origin TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS answers (
  submission_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  question_title TEXT NOT NULL,
  option_label TEXT NOT NULL,
  PRIMARY KEY (submission_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_submissions_received_at ON submissions(received_at);
CREATE INDEX IF NOT EXISTS idx_submissions_participant_hash ON submissions(participant_hash);
CREATE INDEX IF NOT EXISTS idx_submissions_archetype ON submissions(archetype);
CREATE INDEX IF NOT EXISTS idx_answers_question_option ON answers(question_id, option_id);
CREATE INDEX IF NOT EXISTS idx_answers_submission ON answers(submission_id);
`;

let schemaPromise;
let hmacKeyPromise;

class HttpError extends Error {
  constructor(status, code, message = code) { super(message); this.status = status; this.code = code; }
}

export default {
  async fetch(request, env) {
    try {
      return await route(request, env);
    } catch (error) {
      if (error instanceof HttpError) return jsonResponse({ ok:false, error:error.code, message:error.message }, error.status, request, env);
      console.error("Unhandled analytics error", error);
      return jsonResponse({ ok:false, error:"internal_error", message:"Interní chyba statistické služby." }, 500, request, env);
    }
  },
  async scheduled(_controller, env, ctx) { ctx.waitUntil(purgeExpired(env)); }
};

async function route(request, env) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/") return setupPage(request, env);
  if (request.method === "OPTIONS") return preflightResponse(request, env);
  validateEnvironment(env);

  if (request.method === "GET" && url.pathname === "/health") {
    await ensureSchema(env);
    return jsonResponse({ ok:true, service:"spravedlivy-rust-analytics", apiVersion:API_VERSION, consentVersion:consentVersion(env), storesRawIp:false }, 200, request, env);
  }

  if (!isAllowedOrigin(request, env)) throw new HttpError(403, "origin_not_allowed", "Požadavek přišel z nepovolené domény.");
  await ensureSchema(env);

  if (request.method === "POST" && url.pathname === "/v1/submissions") return createSubmission(request, env);
  if (request.method === "POST" && url.pathname === "/v1/withdraw") return withdrawParticipant(request, env);

  if (url.pathname === "/v1/admin/dashboard" && request.method === "GET") {
    if (!(await isAdmin(request, env))) throw new HttpError(401, "unauthorized", "Neplatný správní token.");
    return adminDashboard(request, env);
  }

  if (url.pathname.startsWith("/v1/admin/submissions/") && request.method === "DELETE") {
    if (!(await isAdmin(request, env))) throw new HttpError(401, "unauthorized", "Neplatný správní token.");
    return deleteSubmission(decodeURIComponent(url.pathname.slice("/v1/admin/submissions/".length)), request, env);
  }

  throw new HttpError(404, "not_found", "Požadovaná cesta neexistuje.");
}

async function createSubmission(request, env) {
  const payload = await readJson(request);
  const expectedConsent = consentVersion(env);
  if (payload.consent !== true || payload.consentVersion !== expectedConsent) {
    throw new HttpError(422, "explicit_consent_required", "Je vyžadován výslovný souhlas v aktuální verzi.");
  }
  if (!isUuid(payload.submissionId) || !isUuid(payload.participantId)) throw new HttpError(422, "invalid_identifier", "Neplatný identifikátor.");
  if (!isIsoDate(payload.completedAt) || !isIsoDate(payload.consentedAt)) throw new HttpError(422, "invalid_timestamp", "Neplatný časový údaj.");

  const now = Date.now();
  const completedMs = Date.parse(payload.completedAt);
  const consentedMs = Date.parse(payload.consentedAt);
  if (completedMs > now + 10*60*1000 || completedMs < now - 7*24*60*60*1000 || consentedMs > completedMs + 60*1000) {
    throw new HttpError(422, "timestamp_out_of_range", "Čas dokončení nebo souhlasu je mimo povolený rozsah.");
  }

  const result = payload.result;
  const validationError = validateResult(result);
  if (validationError) throw new HttpError(422, "invalid_result", `Neplatné pole výsledku: ${validationError}.`);

  const participantHash = await participantHmac(payload.participantId, env);
  const recent = await env.DB.prepare("SELECT COUNT(*) AS count FROM submissions WHERE participant_hash=? AND received_at>=?")
    .bind(participantHash, new Date(now - 60*60*1000).toISOString()).first();
  if (Number(recent?.count || 0) >= 24) throw new HttpError(429, "rate_limited", "Limit dokončení pro jeden pseudonym byl dočasně překročen.");

  const receivedAt = new Date(now).toISOString();
  const sourceOrigin = request.headers.get("Origin") || "unknown";
  const insertSubmission = env.DB.prepare(`
    INSERT OR IGNORE INTO submissions (
      id,participant_hash,received_at,completed_at,consented_at,consent_version,quiz_version,archetype,
      left_right,redistribution,state_capacity,efficiency,integrity,economic_freedom,civic_freedom,
      target_precision,coverage,fiscal,growth_potential,time_autonomy,admin_simplicity,family_impact,
      tax_quota,gdp10,family_money,free_time_hours,target_pct,coverage_pct,leak_min,leak_max,source_origin
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    payload.submissionId, participantHash, receivedAt, payload.completedAt, payload.consentedAt, expectedConsent,
    cleanText(result.quizVersion,32), cleanText(result.archetype,120), result.leftRight, result.redistribution,
    result.stateCapacity, result.efficiency, result.integrity, result.economicFreedom, result.civicFreedom,
    result.targetPrecision, result.coverage, result.fiscal, result.growthPotential, result.timeAutonomy,
    result.adminSimplicity, result.familyImpact, result.taxQuota, result.gdp10, result.familyMoney,
    result.freeTimeHours, result.targetPct, result.coveragePct, result.leakMin, result.leakMax, sourceOrigin
  );

  const statements = [insertSubmission, ...result.answers.map(answer => env.DB.prepare(`
    INSERT OR IGNORE INTO answers (submission_id,question_id,option_id,question_title,option_label) VALUES (?,?,?,?,?)
  `).bind(payload.submissionId, answer.questionId, answer.optionId, cleanText(answer.questionTitle,300), cleanText(answer.optionLabel,900)))];

  const batch = await env.DB.batch(statements);
  const inserted = Number(batch[0]?.meta?.changes || 0) > 0;
  return jsonResponse({ ok:true, inserted, submissionId:payload.submissionId, participantAlias:participantHash.slice(0,12), receivedAt }, inserted ? 201 : 200, request, env);
}

async function withdrawParticipant(request, env) {
  const payload = await readJson(request);
  if (!isUuid(payload.participantId)) throw new HttpError(422, "invalid_identifier", "Neplatný místní identifikátor.");
  const participantHash = await participantHmac(payload.participantId, env);
  const existing = await env.DB.prepare("SELECT COUNT(*) AS count FROM submissions WHERE participant_hash=?").bind(participantHash).first();
  const deletedSubmissions = Number(existing?.count || 0);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM answers WHERE submission_id IN (SELECT id FROM submissions WHERE participant_hash=?)").bind(participantHash),
    env.DB.prepare("DELETE FROM submissions WHERE participant_hash=?").bind(participantHash)
  ]);
  return jsonResponse({ ok:true, deletedSubmissions }, 200, request, env);
}

async function adminDashboard(request, env) {
  const url = new URL(request.url);
  const from = parseDateBoundary(url.searchParams.get("from"), false) || "1970-01-01T00:00:00.000Z";
  const to = parseDateBoundary(url.searchParams.get("to"), true) || "9999-12-31T23:59:59.999Z";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 1000, 1), MAX_ADMIN_ROWS);
  const where = "received_at>=? AND received_at<=?";

  const [summary, archetypes, daily, questionDistributions, rowsResult, answersResult] = await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) total_submissions,COUNT(DISTINCT participant_hash) unique_participants,
      AVG(left_right) avg_left_right,AVG(redistribution) avg_redistribution,AVG(state_capacity) avg_state_capacity,
      AVG(efficiency) avg_efficiency,AVG(integrity) avg_integrity,AVG(economic_freedom) avg_economic_freedom,
      AVG(civic_freedom) avg_civic_freedom,AVG(target_precision) avg_target_precision,AVG(coverage) avg_coverage,
      AVG(fiscal) avg_fiscal,AVG(growth_potential) avg_growth_potential,AVG(time_autonomy) avg_time_autonomy,
      AVG(admin_simplicity) avg_admin_simplicity,AVG(family_impact) avg_family_impact,AVG(tax_quota) avg_tax_quota,
      AVG(gdp10) avg_gdp10,AVG(family_money) avg_family_money,AVG(free_time_hours) avg_free_time_hours,
      AVG(target_pct) avg_target_pct,AVG(coverage_pct) avg_coverage_pct,AVG(leak_min) avg_leak_min,
      AVG(leak_max) avg_leak_max,MIN(received_at) first_submission,MAX(received_at) last_submission
      FROM submissions WHERE ${where}`).bind(from,to).first(),
    env.DB.prepare(`SELECT archetype,COUNT(*) count FROM submissions WHERE ${where} GROUP BY archetype ORDER BY count DESC,archetype`).bind(from,to).all(),
    env.DB.prepare(`SELECT substr(received_at,1,10) day,COUNT(*) count,COUNT(DISTINCT participant_hash) participants,
      AVG(left_right) avg_left_right,AVG(efficiency) avg_efficiency FROM submissions WHERE ${where} GROUP BY day ORDER BY day`).bind(from,to).all(),
    env.DB.prepare(`SELECT a.question_id,MAX(a.question_title) question_title,a.option_id,MAX(a.option_label) option_label,COUNT(*) count
      FROM answers a JOIN submissions s ON s.id=a.submission_id WHERE s.${where}
      GROUP BY a.question_id,a.option_id ORDER BY a.question_id,count DESC`).bind(from,to).all(),
    env.DB.prepare(`SELECT id,participant_hash,received_at,completed_at,consented_at,consent_version,quiz_version,archetype,
      left_right,redistribution,state_capacity,efficiency,integrity,economic_freedom,civic_freedom,target_precision,
      coverage,fiscal,growth_potential,time_autonomy,admin_simplicity,family_impact,tax_quota,gdp10,family_money,
      free_time_hours,target_pct,coverage_pct,leak_min,leak_max FROM submissions WHERE ${where} ORDER BY received_at DESC LIMIT ?`).bind(from,to,limit).all(),
    env.DB.prepare(`SELECT a.submission_id,a.question_id,a.option_id,a.question_title,a.option_label FROM answers a
      JOIN (SELECT id FROM submissions WHERE ${where} ORDER BY received_at DESC LIMIT ?) selected ON selected.id=a.submission_id
      ORDER BY a.submission_id,a.question_id`).bind(from,to,limit).all()
  ]);

  const answersBySubmission = new Map();
  for (const answer of answersResult.results || []) {
    if (!answersBySubmission.has(answer.submission_id)) answersBySubmission.set(answer.submission_id, []);
    answersBySubmission.get(answer.submission_id).push({
      question_id:answer.question_id, option_id:answer.option_id, question_title:answer.question_title, option_label:answer.option_label
    });
  }

  const normalizedSummary = normalizeSummary(summary || {});
  const rows = (rowsResult.results || []).map(row => ({
    ...row,
    participant_alias:String(row.participant_hash).slice(0,12),
    participant_hash:undefined,
    answers:answersBySubmission.get(row.id) || []
  }));

  return jsonResponse({
    ok:true, generatedAt:new Date().toISOString(), filters:{from,to,limit}, summary:normalizedSummary,
    archetypes:archetypes.results || [], daily:daily.results || [], questionDistributions:questionDistributions.results || [],
    rows, truncated:Number(normalizedSummary.total_submissions || 0) > rows.length
  }, 200, request, env);
}

async function deleteSubmission(id, request, env) {
  if (!isUuid(id)) throw new HttpError(422, "invalid_identifier", "Neplatné ID záznamu.");
  const existing = await env.DB.prepare("SELECT COUNT(*) count FROM submissions WHERE id=?").bind(id).first();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM answers WHERE submission_id=?").bind(id),
    env.DB.prepare("DELETE FROM submissions WHERE id=?").bind(id)
  ]);
  return jsonResponse({ ok:true, deleted:Number(existing?.count || 0) }, 200, request, env);
}

async function purgeExpired(env) {
  validateEnvironment(env);
  await ensureSchema(env);
  const days = Math.min(Math.max(Number(env.RETENTION_DAYS) || 365,30),3650);
  const cutoff = new Date(Date.now() - days*24*60*60*1000).toISOString();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM answers WHERE submission_id IN (SELECT id FROM submissions WHERE received_at<?)").bind(cutoff),
    env.DB.prepare("DELETE FROM submissions WHERE received_at<?").bind(cutoff)
  ]);
}

function validateResult(result) {
  if (!result || typeof result!=="object" || Array.isArray(result)) return "result";
  if (typeof result.quizVersion!=="string" || result.quizVersion.length<1 || result.quizVersion.length>32) return "quizVersion";
  if (typeof result.archetype!=="string" || result.archetype.length<1 || result.archetype.length>120) return "archetype";
  for (const [field,[min,max]] of Object.entries(METRIC_RANGES)) {
    const value=result[field]; if(typeof value!=="number" || !Number.isFinite(value) || value<min || value>max) return field;
  }
  if (result.leakMin>result.leakMax) return "leakRange";
  if (!Array.isArray(result.answers) || result.answers.length!==15) return "answers";
  const ids=[];
  for(const answer of result.answers){
    if(!answer || typeof answer!=="object")return "answers";
    if(!/^q(0[1-9]|1[0-5])$/.test(answer.questionId))return "answers.questionId";
    if(!/^o[0-9a-f]{8}$/i.test(answer.optionId))return "answers.optionId";
    if(typeof answer.questionTitle!=="string" || answer.questionTitle.length<1 || answer.questionTitle.length>300)return "answers.questionTitle";
    if(typeof answer.optionLabel!=="string" || answer.optionLabel.length<1 || answer.optionLabel.length>900)return "answers.optionLabel";
    ids.push(answer.questionId);
  }
  const expected=Array.from({length:15},(_,i)=>`q${String(i+1).padStart(2,"0")}`);
  if(ids.slice().sort().some((id,index)=>id!==expected[index]))return "answers.completeness";
  return null;
}

function normalizeSummary(summary) {
  const result={};
  for(const [key,value] of Object.entries(summary)){
    result[key]=(key==="first_submission"||key==="last_submission")?(value||null):(value==null?0:Number(value));
  }
  result.repeat_submissions=Math.max(0,Number(result.total_submissions||0)-Number(result.unique_participants||0));
  result.repeat_share=result.total_submissions?result.repeat_submissions/result.total_submissions:0;
  return result;
}

function validateEnvironment(env) {
  if (!env.DB) throw new HttpError(503,"database_not_configured","Databáze D1 není připojena.");
  if (!env.ADMIN_TOKEN || String(env.ADMIN_TOKEN).length<24) throw new HttpError(503,"admin_secret_not_configured","Správní tajný token není nakonfigurován.");
  if (!env.PSEUDONYM_KEY || String(env.PSEUDONYM_KEY).length<32) throw new HttpError(503,"pseudonym_secret_not_configured","Klíč pseudonymizace není nakonfigurován.");
}

function consentVersion(env){return env.CONSENT_VERSION||DEFAULT_CONSENT_VERSION;}
async function ensureSchema(env){if(!schemaPromise){schemaPromise=env.DB.exec(SCHEMA_SQL).catch(error=>{schemaPromise=undefined;throw error;});}return schemaPromise;}

async function readJson(request){
  const length=Number(request.headers.get("Content-Length")||0);if(length>MAX_BODY_BYTES)throw new HttpError(413,"body_too_large","Tělo požadavku je příliš velké.");
  const text=await request.text();if(new TextEncoder().encode(text).byteLength>MAX_BODY_BYTES)throw new HttpError(413,"body_too_large","Tělo požadavku je příliš velké.");
  try{return JSON.parse(text);}catch{throw new HttpError(400,"invalid_json","Požadavek neobsahuje platný JSON.");}
}

function parseDateBoundary(value,endOfDay){if(!value)return null;if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new HttpError(422,"invalid_date","Datum musí mít formát YYYY-MM-DD.");const d=new Date(`${value}${endOfDay?"T23:59:59.999Z":"T00:00:00.000Z"}`);if(Number.isNaN(d.getTime()))throw new HttpError(422,"invalid_date","Neplatné datum.");return d.toISOString();}
function isIsoDate(value){if(typeof value!=="string"||value.length>40)return false;const d=new Date(value);return !Number.isNaN(d.getTime())&&d.toISOString()===value;}
function isUuid(value){return typeof value==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);}
function cleanText(value,max){return String(value).replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,max);}

async function participantHmac(value,env){
  if(!hmacKeyPromise){hmacKeyPromise=crypto.subtle.importKey("raw",new TextEncoder().encode(env.PSEUDONYM_KEY),{name:"HMAC",hash:"SHA-256"},false,["sign"]);}
  const key=await hmacKeyPromise,digest=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}
async function sha256(value){const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return bytesToHex(new Uint8Array(digest));}
function bytesToHex(bytes){return [...bytes].map(byte=>byte.toString(16).padStart(2,"0")).join("");}
async function isAdmin(request,env){const auth=request.headers.get("Authorization")||"";if(!auth.startsWith("Bearer "))return false;const [left,right]=await Promise.all([sha256(auth.slice(7)),sha256(env.ADMIN_TOKEN)]);let diff=left.length^right.length;for(let i=0;i<Math.min(left.length,right.length);i++)diff|=left.charCodeAt(i)^right.charCodeAt(i);return diff===0;}

function allowedOrigins(env){return String(env.ALLOWED_ORIGINS||"https://vrnak-007.github.io").split(",").map(v=>v.trim()).filter(Boolean);}
function isAllowedOrigin(request,env){const origin=request.headers.get("Origin");return Boolean(origin&&allowedOrigins(env).includes(origin));}
function corsOrigin(request,env){const origin=request.headers.get("Origin");return origin&&allowedOrigins(env).includes(origin)?origin:"";}
function preflightResponse(request,env){if(!isAllowedOrigin(request,env))return new Response(null,{status:403});return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":corsOrigin(request,env),"Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization","Access-Control-Max-Age":"86400",Vary:"Origin"}});}

function jsonResponse(data,status,request,env){const headers=new Headers({"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer",Vary:"Origin"});const origin=corsOrigin(request,env);if(origin)headers.set("Access-Control-Allow-Origin",origin);return new Response(JSON.stringify(data),{status,headers});}

function setupPage(request,env){
  const workerOrigin=new URL(request.url).origin;
  const quiz=`${QUIZ_URL}?analyticsApi=${encodeURIComponent(workerOrigin)}`;
  const stats=`${QUIZ_URL}stats/?analyticsApi=${encodeURIComponent(workerOrigin)}`;
  const health=`${workerOrigin}/health`;
  const html=`<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Spravedlivý růst – analytické API</title><style>body{margin:0;background:#f5f3ee;color:#18212a;font:16px/1.5 system-ui,sans-serif}.box{width:min(820px,calc(100% - 28px));margin:30px auto;background:#fff;border:1px solid #d9d5cc;border-radius:18px;padding:28px;box-shadow:0 12px 32px #18212a16}h1{font-size:clamp(2rem,6vw,3.8rem);line-height:1;margin:.1em 0 .35em}p{color:#5d6975}.item{margin:14px 0;padding:14px;border-radius:12px;background:#f4f7f6}.item b{display:block;margin-bottom:6px}.item a{word-break:break-all;color:#136f63}code{background:#eee;padding:2px 5px;border-radius:4px}.warn{border-left:4px solid #b9781c;background:#fff7e7;padding:12px 14px}</style></head><body><main class="box"><small>Cloudflare Worker + D1</small><h1>Analytické API je nasazeno</h1><p>Tato stránka neobsahuje správní token. Použijte odkazy níže; účastníkům posílejte první odkaz.</p><div class="item"><b>Odkaz na test se zapnutým sběrem</b><a href="${escapeHtml(quiz)}">${escapeHtml(quiz)}</a></div><div class="item"><b>Neveřejný manažerský přehled</b><a href="${escapeHtml(stats)}">${escapeHtml(stats)}</a></div><div class="item"><b>Kontrola služby</b><a href="${escapeHtml(health)}">${escapeHtml(health)}</a></div><p class="warn"><strong>Důležité:</strong> do přehledu se přihlašuje hodnotou tajného <code>ADMIN_TOKEN</code>, kterou jste zadali při nasazení. Surové IP adresy Worker do aplikační databáze neukládá.</p></main></body></html>`;
  return new Response(html,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow"}});
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[char]);}
