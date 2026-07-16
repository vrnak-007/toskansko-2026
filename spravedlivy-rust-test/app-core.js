let current = 0;
const selected = Array(questions.length).fill(null);
const el = id => document.getElementById(id);
const introPanel = el("introPanel");
const quizPanel = el("quizPanel");
const resultPanel = el("resultPanel");
const BASELINE_SCENARIO = TaxModel.compute(Array(questions.length).fill(null));

const QUESTION_TRADEOFFS = Object.freeze([
  "Rozhodujete, kdo zaplatí stát: zaměstnanec, spotřebitel, vlastník majetku, firma, nebo budoucí poplatník přes dluh.",
  "Podpora nízké mzdy se platí z daní nebo vyšších nákladů zaměstnavatele. Prudké odebrání dávky může zároveň znehodnotit další směnu.",
  "Plošnou dávku platí i lidé, kteří ji nepotřebují. Přísné cílení zase stojí administrativu a může minout oprávněné.",
  "Veřejná péče a placené volno vyžadují odvody. Soukromé řešení nechává volbu, ale účet nese přímo rodina.",
  "Dotace na bydlení se mohou promítnout do cen. Veřejná výstavba potřebuje kapitál a daně; deregulace přenáší část nákladů na okolí.",
  "Vyšší výdaje na školy musí někdo financovat. Bez změny řízení mohou zvýšit účet, aniž zvýší výsledky.",
  "Regionální vyrovnávání znamená, že silnější obce část výnosu odevzdají. Projektové dotace přidávají lobbying a administrativu.",
  "Péče zdarma v místě spotřeby není bezplatná: platí se daněmi, odvody, čekáním nebo omezením rozsahu.",
  "Každý důchodový slib zaplatí vyšší odvod, pozdější odchod, soukromá úspora nebo dluh.",
  "Vyšší zdanění firem a kapitálu může část účtu přesunout do nižších investic, mezd a vyšších cen. Dotace zase přesouvají riziko na poplatníka.",
  "Cenový strop snižuje viditelný účet dnes, ale náklad přesune do daní, dluhu nebo nedostatku.",
  "Čím více peněz stát rozděluje, tím větší absolutní částka je vystavena chybám a klientelismu; kontrola riziko snižuje, ale také stojí peníze a čas.",
  "Propojený digitální stát šetří formuláře, ale koncentruje data a moc. Roztříštěnost se platí časem občana a duplicitní správou.",
  "Povinně kratší pracovní doba při stejné mzdě zvyšuje cenu hodiny práce. Čistě smluvní model může naopak oslabit vyjednávací pozici zaměstnance.",
  "Krizovou podporu vždy zaplatí současný poplatník, budoucí poplatník přes dluh, nebo příjemce škrtané služby."
]);

el("startBtn").addEventListener("click", () => {
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
    const scenario = TaxModel.compute(tentative);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer" + (selected[current] === optionIndex ? " selected" : "");
    button.setAttribute("aria-pressed", selected[current] === optionIndex ? "true" : "false");
    button.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + optionIndex)}</span>
      <span class="answer-body">
        <strong>${option.text}</strong>
        <small>${option.note}</small>
        ${renderTaxImpact(scenario)}
      </span>`;
    button.addEventListener("click", () => {
      selected[current] = optionIndex;
      renderQuestion();
    });
    answers.appendChild(button);
  });
}

function renderRunningPreview() {
  const scenario = TaxModel.compute(selected);
  const answered = selected.filter(value => value !== null).length;
  const label = answered ? `Průběžný účet po ${answered} volbách` : "Výchozí účet před první volbou";
  el("runningPreviewTitle").textContent = label;
  el("runningStateTake").textContent = TaxModel.fmtCZK(scenario.mandatoryLevies);
  el("runningOwnCash").textContent = TaxModel.fmtCZK(scenario.ownChoiceCash);
  el("runningSuccess").textContent = TaxModel.fmtCZK(scenario.successKeep);
  el("runningRichTax").textContent = scenario.richTax > 55
    ? `−${TaxModel.fmtCZK(scenario.richTaxSpilloverLow)} až −${TaxModel.fmtCZK(scenario.richTaxSpilloverHigh)}`
    : scenario.richTax < 45
      ? `+${TaxModel.fmtCZK(scenario.richTaxSpilloverLow)} až +${TaxModel.fmtCZK(scenario.richTaxSpilloverHigh)}`
      : "bez významné změny";
}

function renderTaxImpact(scenario) {
  const taxDelta = scenario.mandatoryLevies - BASELINE_SCENARIO.mandatoryLevies;
  const cashDelta = scenario.ownChoiceCash - BASELINE_SCENARIO.ownChoiceCash;
  const successDelta = scenario.successKeep - BASELINE_SCENARIO.successKeep;
  return `
    <span class="answer-tax-impact">
      <span class="answer-tax-head">Co tato volba znamená pro modelovou domácnost</span>
      <span class="answer-tax-grid">
        <span><em>Stát vezme měsíčně</em><b>${TaxModel.fmtCZK(scenario.mandatoryLevies)}</b><small>${signedMoney(taxDelta)} proti výchozímu stavu</small></span>
        <span><em>Rodině zůstane</em><b>${TaxModel.fmtCZK(scenario.ownChoiceCash)}</b><small>${signedMoney(cashDelta)} pro vlastní rozhodnutí</small></span>
        <span><em>Z dalších 10 000 Kč</em><b>${TaxModel.fmtCZK(scenario.successKeep)}</b><small>${signedMoney(successDelta)} proti výchozímu stavu</small></span>
      </span>
    </span>`;
}

function signedMoney(value) {
  if (Math.abs(value) < 50) return "beze změny";
  return `${value > 0 ? "+" : "−"}${TaxModel.fmtCZK(Math.abs(value))}`;
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
