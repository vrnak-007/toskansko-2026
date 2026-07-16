(() => {
  "use strict";

  const CONFIG_PATH = "../analytics-config.json";
  const TOKEN_KEY = "spravedlivy_rust_admin_token";
  const queryApi = new URL(location.href).searchParams.get("analyticsApi") || "";
  const state = { apiBase: "", token: sessionStorage.getItem(TOKEN_KEY) || "", data: null, rows: [] };
  const $ = id => document.getElementById(id);
  const nf0 = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat("cs-CZ", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const czk = new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });
  const dateFmt = new Intl.DateTimeFormat("cs-CZ", { dateStyle: "short", timeStyle: "short" });

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const rounded = value => nf1.format(num(value));
  const signed = value => `${num(value) > 0 ? "+" : ""}${rounded(value)} %`;
  const classifyLR = value => value < 20 ? "výrazně levicový" : value < 40 ? "středolevicový" : value <= 60 ? "středový" : value <= 80 ? "středopravicový" : "výrazně pravicový";
  const level = value => value >= 75 ? "vysoký" : value >= 60 ? "spíše vysoký" : value >= 40 ? "střední" : value >= 25 ? "spíše nízký" : "nízký";
  const normalizeApi = value => { try { const u = new URL(value); return u.protocol === "https:" ? u.origin + u.pathname.replace(/\/$/, "") : ""; } catch { return ""; } };

  init().catch(error => showConfigurationError(error.message));

  async function init() {
    const response = await fetch(CONFIG_PATH, { cache: "no-store", credentials: "omit" });
    const config = response.ok ? await response.json() : {};
    state.apiBase = normalizeApi(queryApi || config.apiBase || "");
    if (!state.apiBase) {
      showConfigurationError("Statistické API není nakonfigurováno.");
      return;
    }
    $("backLink").href = `../?analyticsApi=${encodeURIComponent(state.apiBase)}`;
    if (state.token) await loadData({ initial: true });
  }

  function showConfigurationError(message) {
    $("configPanel").hidden = false;
    $("loginPanel").hidden = true;
    $("dashboard").hidden = true;
    $("configPanel").querySelector("p").textContent = message;
  }

  function setLoginError(message) { $("loginError").textContent = message; }
  function setStatus(message) { $("loadStatus").textContent = message; }

  async function api(path, options = {}) {
    if (!state.apiBase) throw new Error("Statistické API není nakonfigurováno.");
    const response = await fetch(`${state.apiBase}${path}`, {
      ...options,
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      headers: { ...(options.headers || {}), Authorization: `Bearer ${state.token}` }
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error("Neplatný správní token.");
    if (!response.ok) throw new Error(body.message || body.error || `HTTP ${response.status}`);
    return body;
  }

  function queryString() {
    const params = new URLSearchParams();
    if ($("dateFrom").value) params.set("from", $("dateFrom").value);
    if ($("dateTo").value) params.set("to", $("dateTo").value);
    params.set("limit", $("rowLimit").value || "5000");
    return params.toString();
  }

  async function loadData({ initial = false } = {}) {
    setStatus("Načítám statistiky…");
    $("refreshBtn").disabled = true;
    try {
      const data = await api(`/v1/admin/dashboard?${queryString()}`);
      state.data = data;
      state.rows = data.rows || [];
      $("loginPanel").hidden = true;
      $("dashboard").hidden = false;
      render(data);
      setStatus(`Načteno ${nf0.format(num(data.summary.total_submissions))} dokončení; aktualizováno ${dateFmt.format(new Date(data.generatedAt))}.`);
      setLoginError("");
    } catch (error) {
      if (initial || /token/i.test(error.message)) {
        sessionStorage.removeItem(TOKEN_KEY);
        state.token = "";
        $("loginPanel").hidden = false;
        $("dashboard").hidden = true;
        setLoginError(error.message);
      } else {
        setStatus(`Načtení selhalo: ${error.message}`);
      }
    } finally {
      $("refreshBtn").disabled = false;
    }
  }

  function render(data) {
    renderKpis(data.summary);
    renderArchetypes(data.archetypes || [], num(data.summary.total_submissions));
    renderMetrics(data.summary);
    renderDaily(data.daily || []);
    renderQuestions(data.questionDistributions || []);
    renderAnalysis(data);
    filterRows();
    $("truncatedNote").textContent = data.truncated
      ? `Tabulka je omezena na ${nf0.format(num(data.filters.limit))} nejnovějších záznamů. Souhrny a rozložení odpovědí jsou vypočteny ze všech záznamů ve zvoleném období.`
      : "Tabulka obsahuje všechny záznamy ve zvoleném období.";
  }

  function renderKpis(s) {
    const total = num(s.total_submissions), unique = num(s.unique_participants), repeat = num(s.repeat_submissions);
    const cards = [
      ["Dokončení", nf0.format(total), "Každý průchod samostatně", "emphasis"],
      ["Pseudonymů", nf0.format(unique), "Přibližný počet prohlížečů se souhlasem", ""],
      ["Opakované průchody", nf0.format(repeat), `${rounded(num(s.repeat_share) * 100)} % všech dokončení`, total && repeat / total > .25 ? "warning" : ""],
      ["Průměr levice–pravice", `${rounded(s.avg_left_right)}/100`, classifyLR(num(s.avg_left_right)), "emphasis"],
      ["Průměrná efektivita", `${rounded(s.avg_efficiency)}/100`, `${level(num(s.avg_efficiency))} výsledek`, ""],
      ["Průměrná kapacita", `${rounded(s.avg_state_capacity)}/100`, `${level(num(s.avg_state_capacity))} výsledek`, ""],
      ["Modelová daňová kvóta", `${rounded(s.avg_tax_quota)} %`, "Průměr všech průchodů", ""],
      ["HDP po 10 letech", signed(s.avg_gdp10), "Průměr proti modelovému trendu", ""],
      ["Čas pro rodinu", `${rounded(s.avg_free_time_hours)} h`, "Na dospělého týdně", ""],
      ["Rodinné volné zdroje", czk.format(num(s.avg_family_money)), "Modelová měsíční hodnota", ""],
      ["Ekonomická svoboda", `${rounded(s.avg_economic_freedom)}/100`, `${level(num(s.avg_economic_freedom))} průměr`, ""],
      ["Občanská svoboda", `${rounded(s.avg_civic_freedom)}/100`, `${level(num(s.avg_civic_freedom))} průměr`, ""]
    ];
    $("kpis").innerHTML = cards.map(([label,value,note,kind]) => `<article class="kpi-card ${kind}"><div class="kpi-label">${esc(label)}</div><div class="kpi-value">${esc(value)}</div><div class="kpi-note">${esc(note)}</div></article>`).join("");
  }

  function renderArchetypes(items, total) {
    if (!items.length) { $("archetypeChart").innerHTML = '<div class="empty">Zatím nejsou k dispozici žádná data.</div>'; return; }
    const max = Math.max(...items.map(item => num(item.count)), 1);
    $("archetypeChart").innerHTML = items.map(item => {
      const count = num(item.count), share = total ? count / total * 100 : 0;
      return `<div class="rank-row"><div class="rank-label" title="${esc(item.archetype)}">${esc(item.archetype)}</div><div class="bar-track"><div class="bar-fill" style="width:${count/max*100}%"></div></div><div class="rank-value">${nf0.format(count)} · ${rounded(share)} %</div></div>`;
    }).join("");
  }

  function renderMetrics(s) {
    const metrics = [
      ["Levice–pravice", s.avg_left_right], ["Přerozdělování", s.avg_redistribution], ["Kapacita státu", s.avg_state_capacity],
      ["Efektivita", s.avg_efficiency], ["Integrita", s.avg_integrity], ["Ekonomická svoboda", s.avg_economic_freedom],
      ["Občanská svoboda", s.avg_civic_freedom], ["Přesnost pomoci", s.avg_target_precision], ["Pokrytí", s.avg_coverage],
      ["Fiskální stabilita", s.avg_fiscal], ["Růstový potenciál", s.avg_growth_potential], ["Časová autonomie", s.avg_time_autonomy],
      ["Jednoduchost správy", s.avg_admin_simplicity], ["Rodinný dopad", s.avg_family_impact]
    ];
    $("metricChart").innerHTML = metrics.map(([label,value]) => `<div class="rank-row"><div class="rank-label">${esc(label)}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,num(value)))}%"></div></div><div class="rank-value">${rounded(value)}</div></div>`).join("");
  }

  function renderDaily(days) {
    if (!days.length) { $("dailyChart").innerHTML = '<div class="empty">Ve zvoleném období nejsou žádná dokončení.</div>'; return; }
    const max = Math.max(...days.map(day => num(day.count)), 1);
    $("dailyChart").innerHTML = days.map(day => {
      const height = Math.max(2, num(day.count) / max * 190);
      const label = new Intl.DateTimeFormat("cs-CZ", { day:"2-digit", month:"2-digit" }).format(new Date(`${day.day}T12:00:00Z`));
      return `<div class="day-column" title="${esc(day.day)}: ${nf0.format(num(day.count))} dokončení, ${nf0.format(num(day.participants))} pseudonymů"><div class="day-value">${nf0.format(num(day.count))}</div><div class="day-bar" style="height:${height}px"></div><div class="day-label">${esc(label)}</div></div>`;
    }).join("");
  }

  function renderQuestions(distributions) {
    if (!distributions.length) { $("questionCharts").innerHTML = '<div class="empty">Zatím nejsou k dispozici žádné odpovědi.</div>'; return; }
    const grouped = new Map();
    distributions.forEach(item => {
      if (!grouped.has(item.question_id)) grouped.set(item.question_id, { title:item.question_title, options:[] });
      grouped.get(item.question_id).options.push(item);
    });
    $("questionCharts").innerHTML = [...grouped.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([id, group]) => {
      const total = group.options.reduce((sum,item)=>sum+num(item.count),0);
      const options = [...group.options].sort((a,b)=>num(b.count)-num(a.count)).map(item => {
        const share = total ? num(item.count)/total*100 : 0;
        return `<div class="option-row"><div class="option-label"><b>${esc(item.option_id)}</b> ${esc(item.option_label)}</div><div class="option-value">${nf0.format(num(item.count))} · ${rounded(share)} %</div><div class="option-bar"><span style="width:${share}%"></span></div></div>`;
      }).join("");
      return `<article class="question-card"><h3>${esc(id.toUpperCase())} · ${esc(group.title)}</h3>${options}</article>`;
    }).join("");
  }

  function mean(values) { return values.length ? values.reduce((a,b)=>a+b,0)/values.length : 0; }
  function stdev(values) { if (values.length < 2) return 0; const m=mean(values); return Math.sqrt(values.reduce((sum,v)=>sum+(v-m)**2,0)/(values.length-1)); }
  function correlation(xs, ys) {
    if (xs.length < 3 || xs.length !== ys.length) return 0;
    const mx=mean(xs), my=mean(ys); let numerator=0, dx=0, dy=0;
    for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;numerator+=a*b;dx+=a*a;dy+=b*b;}
    return dx && dy ? numerator/Math.sqrt(dx*dy) : 0;
  }

  function renderAnalysis(data) {
    const s=data.summary, rows=data.rows||[], total=num(s.total_submissions), unique=num(s.unique_participants);
    $("analysisBasis").textContent=`${nf0.format(total)} průchodů / ${nf0.format(unique)} pseudonymů`;
    if(!total){$("analysisText").innerHTML='<div class="empty">Pro analýzu zatím nejsou data.</div>';return;}
    const dominant=(data.archetypes||[])[0], dominantShare=dominant?num(dominant.count)/total*100:0;
    const lrValues=rows.map(r=>num(r.left_right)), effValues=rows.map(r=>num(r.efficiency));
    const lrSd=stdev(lrValues), corr=correlation(lrValues,effValues), gap=num(s.avg_state_capacity)-num(s.avg_efficiency), freedomGap=num(s.avg_economic_freedom)-num(s.avg_civic_freedom);
    const aliases=new Map();rows.forEach(r=>aliases.set(r.participant_alias,(aliases.get(r.participant_alias)||0)+1));
    const mostActive=Math.max(0,...aliases.values()), repeatShare=num(s.repeat_share)*100;
    const insights=[];
    insights.push(["Střed skupiny",`Průměrná pozice ${rounded(s.avg_left_right)}/100 je ${classifyLR(num(s.avg_left_right))}; přerozdělování dosahuje ${rounded(s.avg_redistribution)}/100. Směrodatná odchylka osy levice–pravice v načtených řádcích je ${rounded(lrSd)} bodu, takže skupina je ${lrSd>=22?"názorově velmi různorodá":lrSd>=13?"názorově smíšená":"poměrně soustředěná"}.`,""]);
    if(dominant)insights.push(["Nejčastější model",`${dominant.archetype} představuje ${rounded(dominantShare)} % dokončení (${nf0.format(num(dominant.count))}). ${dominantShare>=45?"Jde o zřetelně dominantní archetyp.":"Žádný jediný model skupinu plně neovládá."}`,""]);
    insights.push(["Výkon navrženého státu",`Průměrná kapacita je ${rounded(s.avg_state_capacity)}/100 a efektivita ${rounded(s.avg_efficiency)}/100. ${Math.abs(gap)<5?"Schopnost institucí a výsledková efektivita jsou přibližně v rovnováze.":gap>0?`Kapacita převyšuje efektivitu o ${rounded(gap)} bodu; rezervou je převod pravidel a zdrojů do výsledků.`:`Efektivita převyšuje kapacitu o ${rounded(Math.abs(gap))} bodu; modely mohou být citlivé na slabší kontrolu a provedení.`}`,Math.abs(gap)>=12?"warning":""]);
    insights.push(["Svoboda a kontrola",`Ekonomická svoboda je v průměru ${rounded(s.avg_economic_freedom)}/100, občanská a datová ${rounded(s.avg_civic_freedom)}/100. ${Math.abs(freedomGap)<6?"Obě dimenze jsou vyvážené.":freedomGap>0?"Relativně větší důraz leží na smluvní a tržní volnosti než na procesních a datových zárukách.":"Relativně větší důraz leží na procesních a datových zárukách než na tržní volnosti."}`,""]);
    const corrText=Math.abs(corr)<.15?"prakticky žádná":Math.abs(corr)<.35?"slabá":Math.abs(corr)<.6?"střední":"silná";
    insights.push(["Orientace versus efektivita",`Korelace mezi osou levice–pravice a efektivitou v načtených řádcích je ${corrText} (r = ${rounded(corr)}). ${Math.abs(corr)<.15?"Samotná ideologická poloha zde efektivitu téměř nevysvětluje.":corr>0?"Pravicovější průchody zde bývají spojeny s vyšší efektivitou; jde jen o vztah uvnitř modelu a vzorku.":"Levicovější průchody zde bývají spojeny s vyšší efektivitou; jde jen o vztah uvnitř modelu a vzorku."}`,""]);
    insights.push(["Opakovaná vyplnění",`${nf0.format(num(s.repeat_submissions))} průchodů je nad rámec prvního záznamu jednotlivých pseudonymů, tedy ${rounded(repeatShare)} %. Nejaktivnější pseudonym má v načtené tabulce ${nf0.format(mostActive)} průchodů. ${repeatShare>25?"Agregáty jsou citelně ovlivněny opakováním; vždy sledujte také počet pseudonymů.":"Opakování zatím agregáty výrazně nedeformuje."}`,repeatShare>25?"warning":""]);
    insights.push(["Ekonomický scénář",`Průměrný model ukazuje ${signed(s.avg_gdp10)} HDP na obyvatele po deseti letech proti trendu, daňovou kvótu ${rounded(s.avg_tax_quota)} % HDP a ${rounded(s.avg_free_time_hours)} hodiny volného času týdně na dospělého. Jde o výstup interního scénářového modelu, nikoli prognózu.`,""]);
    $("analysisText").innerHTML=insights.map(([title,text,tone])=>`<div class="insight ${tone}"><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`).join("");
  }

  function answerSignature(row) { return (row.answers || []).slice().sort((a,b)=>a.question_id.localeCompare(b.question_id)).map(answer=>answer.option_id).join("·"); }

  function filterRows() {
    const q=$("tableSearch").value.trim().toLocaleLowerCase("cs");
    const rows=state.rows.filter(row=>!q||[row.id,row.participant_alias,row.archetype,answerSignature(row),...(row.answers||[]).map(a=>a.option_label)].some(value=>String(value||"").toLocaleLowerCase("cs").includes(q)));
    renderTable(rows);
  }

  function renderTable(rows) {
    $("rowCounter").textContent=`${nf0.format(rows.length)} řádků`;
    if(!rows.length){$("resultsBody").innerHTML='<tr><td colspan="17"><div class="empty">Žádný odpovídající záznam.</div></td></tr>';return;}
    $("resultsBody").innerHTML=rows.map(row=>`<tr data-id="${esc(row.id)}">
      <td title="${esc(row.received_at)}">${esc(dateFmt.format(new Date(row.received_at)))}</td><td class="alias">${esc(row.participant_alias)}</td><td class="archetype-cell">${esc(row.archetype)}</td>
      <td class="number">${nf0.format(num(row.left_right))}</td><td class="number">${nf0.format(num(row.redistribution))}</td><td class="number">${nf0.format(num(row.state_capacity))}</td><td class="number">${nf0.format(num(row.efficiency))}</td><td class="number">${nf0.format(num(row.integrity))}</td>
      <td class="number">${nf0.format(num(row.economic_freedom))}</td><td class="number">${nf0.format(num(row.civic_freedom))}</td><td class="number">${rounded(row.tax_quota)} %</td><td class="number">${signed(row.gdp10)}</td><td class="number">${esc(czk.format(num(row.family_money)))}</td><td class="number">${rounded(row.free_time_hours)} h</td><td class="number">${nf0.format(num(row.leak_min))}–${nf0.format(num(row.leak_max))} %</td>
      <td><button type="button" class="small-btn answers-btn" data-id="${esc(row.id)}" title="${esc(answerSignature(row))}">${esc(answerSignature(row))}</button></td><td><button type="button" class="danger delete-btn" data-id="${esc(row.id)}">Smazat</button></td></tr>`).join("");
  }

  function showAnswers(id) {
    const row=state.rows.find(item=>item.id===id);if(!row)return;
    const entries=(row.answers||[]).slice().sort((a,b)=>a.question_id.localeCompare(b.question_id));
    $("answersContent").innerHTML=`<p><strong>Záznam:</strong> ${esc(row.id)}<br><strong>Pseudonym:</strong> ${esc(row.participant_alias)}<br><strong>Typ:</strong> ${esc(row.archetype)}</p>`+entries.map(answer=>`<div class="answer-detail"><b>${esc(answer.question_id.toUpperCase())} · ${esc(answer.question_title)} · ${esc(answer.option_id)}</b><span>${esc(answer.option_label)}</span></div>`).join("");
    $("answersDialog").showModal();
  }

  async function deleteRow(id) {
    const row=state.rows.find(item=>item.id===id);if(!row)return;
    if(!confirm(`Opravdu trvale smazat záznam ${id.slice(0,8)} pseudonymu ${row.participant_alias}?`))return;
    setStatus(`Mažu záznam ${id.slice(0,8)}…`);
    try{await api(`/v1/admin/submissions/${encodeURIComponent(id)}`,{method:"DELETE"});await loadData();}catch(error){setStatus(`Výmaz selhal: ${error.message}`);}
  }

  function csvCell(value){const text=String(value??"");return /[";\n\r]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
  function exportCsv(){
    const headers=["id","received_at","completed_at","participant_alias","archetype","left_right","redistribution","state_capacity","efficiency","integrity","economic_freedom","civic_freedom","target_precision","coverage","fiscal","growth_potential","time_autonomy","admin_simplicity","family_impact","tax_quota","gdp10","family_money","free_time_hours","target_pct","coverage_pct","leak_min","leak_max","answer_signature","answers_json"];
    const lines=[headers.join(";")];
    state.rows.forEach(row=>{const record={...row,answer_signature:answerSignature(row),answers_json:JSON.stringify(row.answers||[])};lines.push(headers.map(key=>csvCell(record[key])).join(";"));});
    const blob=new Blob(["\ufeff"+lines.join("\r\n")],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`spravedlivy-rust-statistiky-${new Date().toISOString().slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  $("loginForm").addEventListener("submit",event=>{event.preventDefault();state.token=$("adminToken").value.trim();if(!state.token){setLoginError("Zadejte správní token.");return;}sessionStorage.setItem(TOKEN_KEY,state.token);loadData({initial:true});});
  $("refreshBtn").addEventListener("click",()=>loadData());
  $("exportBtn").addEventListener("click",exportCsv);
  $("logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem(TOKEN_KEY);state.token="";state.data=null;state.rows=[];$("dashboard").hidden=true;$("loginPanel").hidden=false;$("adminToken").value="";setLoginError("");});
  $("tableSearch").addEventListener("input",filterRows);
  $("resultsBody").addEventListener("click",event=>{const answer=event.target.closest(".answers-btn");if(answer)showAnswers(answer.dataset.id);const del=event.target.closest(".delete-btn");if(del)deleteRow(del.dataset.id);});
})();
