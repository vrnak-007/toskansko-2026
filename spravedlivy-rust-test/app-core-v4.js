let current = 0;
const selected = Array(questions.length).fill(null);
let currentProfileId = "median";

const el = id => document.getElementById(id);
const introPanel = el("introPanel");
const quizPanel = el("quizPanel");
const resultPanel = el("resultPanel");

const QUESTION_TRADEOFFS = Object.freeze([
  "Přesun daně z práce není automaticky snížení daní: výpadek se vybere z majetku a kapitálu, ušetří na výdajích, nebo se půjčí.",
  "Pracovní bonus zvyšuje čistou mzdu, ale musí mít trvalé krytí. Bez něj se dnešní podpora mění v budoucí úrokový účet.",
  "Plynulejší dávky a srážky mohou zvýšit legální práci; plošná dávka je jednodušší, ale účet platí i lidé, kteří ji nepotřebují.",
  "Péče o děti může zvýšit druhý příjem domácnosti. Její rozpočet však musí nést daň, spoluúčast, zaměstnavatel nebo dluh.",
  "Bydlení lze zlevňovat nabídkou, veřejnou výstavbou nebo dotací poptávky. Každý nástroj má jiného plátce a jiný dopad na cenu.",
  "Investice do znevýhodněných škol může zvýšit budoucí produktivitu, ale sama výše výdajů nezaručuje výsledek.",
  "Lepší řízení může šetřit administrativu. Centralizace a projektové dotace naopak přesouvají další rozhodování a náklady na stát.",
  "Prevence má zpožděný výnos. Dnešní výdaj se vyplatí jen tehdy, pokud skutečně sníží nemocnost a budoucí náklady.",
  "Penzijní slib vždy platí dnešní odvod, soukromá úspora, pozdější důchod, nebo budoucí poplatník přes dluh.",
  "Úleva pro práci ve vyšším věku může zvýšit zaměstnanost, ale krátkodobě snižuje příjmy systému. Předčasná penze dělá opak.",
  "Integrace kvalifikovaných migrantů má rozpočtový náklad. Její návratnost závisí na zaměstnanosti, produktivitě a úspěchu dětí ve škole.",
  "Stabilní podíl obcí na daních může nahradit grantové soutěže. Centrální dotace jsou viditelnější, ale stojí administrativu a lobbying.",
  "Zdanění vysokých příjmů a kapitálu může financovat nižší daň práce; část břemene se však může přenést do mezd, cen a investic.",
  "Daňová úleva vázaná na investici má jiný účinek než plošné snížení daně nebo politicky vybíraná dotace.",
  "Tady se rozhoduje, zda účet zaplatíte dnes, nebo jej přenesete do dluhu. Půjčka státu není bezplatný zdroj, ale odložená daň."
]);


function analyticsOptionId(value) {
  let hash = 2166136261;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `o${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function profile() {
  return TaxModelV4.PROFILES[currentProfileId] || TaxModelV4.PROFILES.median;
}

function baselineScenario() {
  return TaxModelV4.compute(Array(questions.length).fill(null), currentProfileId);
}

function syncProfileSelectors(value) {
  currentProfileId = TaxModelV4.PROFILES[value] ? value : "median";
  ["profileSelectIntro", "profileSelectQuiz"].forEach(id => {
    const select = el(id);
    if (select) select.value = currentProfileId;
  });
  const description = el("profileDescription");
  if (description) description.textContent = profile().description;
}

["profileSelectIntro", "profileSelectQuiz"].forEach(id => {
  const select = el(id);
  if (!select) return;
  select.addEventListener("change", event => {
    syncProfileSelectors(event.target.value);
    if (quizPanel.style.display === "block") renderQuestion();
  });
});
syncProfileSelectors("median");

el("startBtn").addEventListener("click", () => {
  syncProfileSelectors(el("profileSelectIntro")?.value || currentProfileId);
  introPanel.style.display = "none";
  quizPanel.style.display = "block";
  renderQuestion();
  quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

function renderQuestion() {
  const question = questions[current];
  el("questionNumber").textContent = `Rozhodnutí ${current + 1}`;
  el("questionTitle").textContent = question.title;
  el("questionContext").textContent = question.context;
  el("questionTradeoff").textContent = QUESTION_TRADEOFFS[current];
  el("bookSummary").textContent = question.book.summary;
  el("bookSource").textContent = question.book.sourceLabel;
  el("bookSource").href = question.book.sourceUrl;
  el("progressText").textContent = `Otázka ${current + 1} z ${questions.length}`;
  el("answeredText").textContent = `${selected.filter(value => value !== null).length} / ${questions.length} zodpovězeno`;
  el("progressFill").style.width = `${((current + 1) / questions.length) * 100}%`;
  el("backBtn").disabled = current === 0;
  el("nextBtn").textContent = current === questions.length - 1 ? "Spočítat výsledek" : "Další otázka";
  el("errorBox").style.display = "none";

  renderRunningPreview();

  const answers = el("answers");
  answers.innerHTML = "";
  question.options.forEach((option, optionIndex) => {
    const tentative = [...selected];
    tentative[current] = optionIndex;
    const scenario = TaxModelV4.compute(tentative, currentProfileId);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer" + (selected[current] === optionIndex ? " selected" : "");
    button.setAttribute("aria-pressed", selected[current] === optionIndex ? "true" : "false");
    button.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + optionIndex)}</span>
      <span class="answer-body">
        ${option.bookAligned ? '<span class="book-aligned-badge">Varianta odpovídající tezi knihy</span>' : ""}
        <strong>${option.text}</strong>
        <small>${option.note}</small>
        ${renderOptionImpact(scenario)}
      </span>`;
    button.addEventListener("click", () => {
      selected[current] = optionIndex;
      renderQuestion();
    });
    answers.appendChild(button);
  });
}

function renderRunningPreview() {
  const scenario = TaxModelV4.compute(selected, currentProfileId);
  const answered = selected.filter(value => value !== null).length;
  el("runningPreviewTitle").textContent = answered
    ? `Průběžný účet po ${answered} volbách · ${profile().shortLabel}`
    : `Výchozí účet · ${profile().shortLabel}`;
  el("runningStateTake").textContent = TaxModelV4.fmtCZK(scenario.mandatoryLevies);
  el("runningOwnCash").textContent = TaxModelV4.fmtCZK(scenario.ownChoiceCash);
  el("runningSuccess").textContent = TaxModelV4.fmtCZK(scenario.successKeep);
  el("runningDeficit").textContent = formatBalance(scenario.annualDeficitBn);
  el("runningCapital").textContent = formatSignedCZK(scenario.capital20);
}

function renderOptionImpact(scenario) {
  const baseline = baselineScenario();
  const takeDelta = scenario.mandatoryLevies - baseline.mandatoryLevies;
  const ownDelta = scenario.ownChoiceCash - baseline.ownChoiceCash;
  const deficitDelta = scenario.annualDeficitBn - baseline.annualDeficitBn;
  return `
    <span class="answer-impact">
      <span class="answer-impact-head">Průběžný účet po této volbě</span>
      <span class="answer-impact-grid">
        <span><em>Stát vezme</em><b>${TaxModelV4.fmtCZK(scenario.mandatoryLevies)}</b><small>${signedMoney(takeDelta)} proti výchozímu stavu</small></span>
        <span><em>Vám zůstane</em><b>${TaxModelV4.fmtCZK(scenario.ownChoiceCash)}</b><small>${signedMoney(ownDelta)} měsíčně</small></span>
        <span><em>Roční saldo</em><b>${formatBalance(scenario.annualDeficitBn)}</b><small>${formatSignedBn(deficitDelta)} proti rozpočtu 2026</small></span>
        <span><em>Majetek za 20 let</em><b>${formatSignedCZK(scenario.capital20)}</b><small>rozdíl při 6 % ročně</small></span>
      </span>
    </span>`;
}

function formatBalance(valueBn) {
  if (valueBn > 0.05) return `schodek ${TaxModelV4.fmtNumber(valueBn)} mld. Kč`;
  if (valueBn < -0.05) return `přebytek ${TaxModelV4.fmtNumber(Math.abs(valueBn))} mld. Kč`;
  return "vyrovnaný rozpočet";
}

function formatSignedBn(value) {
  if (Math.abs(value) < 0.05) return "beze změny";
  return `${value > 0 ? "+" : "−"}${TaxModelV4.fmtNumber(Math.abs(value))} mld. Kč`;
}

function signedMoney(value) {
  if (Math.abs(value) < 50) return "beze změny";
  return `${value > 0 ? "+" : "−"}${TaxModelV4.fmtCZK(Math.abs(value))}`;
}

function formatSignedCZK(value) {
  if (Math.abs(value) < 50) return "přibližně 0 Kč";
  return `${value > 0 ? "+" : "−"}${TaxModelV4.fmtCZK(Math.abs(value))}`;
}

el("backBtn").addEventListener("click", () => {
  if (current <= 0) return;
  current -= 1;
  renderQuestion();
  quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

el("nextBtn").addEventListener("click", () => {
  if (selected[current] === null) {
    el("errorBox").style.display = "block";
    return;
  }
  if (current < questions.length - 1) {
    current += 1;
    renderQuestion();
    quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  showResults();
});

function selectedOption(index) {
  return questions[index].options[selected[index]];
}
