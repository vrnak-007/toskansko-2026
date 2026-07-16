let current = 0;
const selected = Array(questions.length).fill(null);

const FAMILY_MODEL = Object.freeze({
  labourCost: 120000,
  essentialPrivateCosts: 45500,
  currentGrossLabourLevyRate: 41.2,
  currentCashSupport: 2400,
  currentTaxQuota: 34,
  currentMarginalWedge: 45.1
});

const el = id => document.getElementById(id);
const introPanel = el("introPanel"), quizPanel = el("quizPanel"), resultPanel = el("resultPanel");

el("startBtn").addEventListener("click", () => {
  introPanel.style.display = "none";
  quizPanel.style.display = "block";
  renderQuestion();
  quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

function renderQuestion() {
  const q = questions[current];
  el("questionNumber").textContent = `Rozhodnutí ${current + 1}`;
  el("questionTitle").textContent = q.title;
  el("questionContext").textContent = q.context;
  el("progressText").textContent = `Otázka ${current + 1} z ${questions.length}`;
  el("answeredText").textContent = `${selected.filter(v => v !== null).length} / ${questions.length} zodpovězeno`;
  el("progressFill").style.width = `${((current + 1) / questions.length) * 100}%`;
  el("backBtn").disabled = current === 0;
  el("nextBtn").textContent = current === questions.length - 1 ? "Vyhodnotit účet" : "Další otázka";
  el("errorBox").style.display = "none";

  const wrap = el("answers");
  wrap.innerHTML = "";
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "answer" + (selected[current] === i ? " selected" : "");
    b.setAttribute("aria-pressed", selected[current] === i ? "true" : "false");
    b.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
      <span>
        <strong>${opt.text}</strong>
        <small>${opt.note}</small>
        ${renderOptionImpact(opt)}
      </span>`;
    b.addEventListener("click", () => {
      selected[current] = i;
      renderQuestion();
    });
    wrap.appendChild(b);
  });
}

function renderOptionImpact(opt) {
  const s = opt.score;
  const levyPp = clamp(
    0.85 * s.redist - 0.70 * s.lr - 0.25 * s.growth + 0.20 * Math.max(0, -s.admin),
    -4,
    4
  );
  const monthlyCash = round100(-FAMILY_MODEL.labourCost * levyPp / 100);
  const stateDelta = 0.75 * s.redist + 0.30 * s.coverage + 0.20 * s.family - 0.45 * s.econFreedom;
  const incentiveDelta = 0.55 * s.growth + 0.55 * s.econFreedom + 0.35 * s.fiscal + 0.25 * s.admin - 0.50 * s.redist;
  const riskDelta = 0.45 * s.redist - 0.80 * s.integrity - 0.35 * s.admin;

  return `<span class="impact-row" aria-label="Izolovaný modelový dopad této odpovědi">
    ${impactPill("Vlastní rozpočet", signedMoney(monthlyCash), monthlyCash)}
    ${impactPill("Zásah státu", directionLabel(stateDelta), -stateDelta)}
    ${impactPill("Pobídka k výkonu", directionLabel(incentiveDelta), incentiveDelta)}
    ${impactPill("Riziko plýtvání", directionLabel(riskDelta), -riskDelta)}
  </span>`;
}

function impactPill(label, value, favourability) {
  const cls = favourability > 0.35 ? "good" : favourability < -0.35 ? "bad" : "neutral";
  return `<span class="impact-pill ${cls}"><b>${label}:</b> ${value}</span>`;
}

function directionLabel(value) {
  if (value > 0.75) return "výrazně ↑";
  if (value > 0.20) return "mírně ↑";
  if (value < -0.75) return "výrazně ↓";
  if (value < -0.20) return "mírně ↓";
  return "≈ beze změny";
}

function signedMoney(value) {
  if (Math.abs(value) < 50) return "≈ 0 Kč/měs.";
  const formatted = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(Math.abs(value));
  return `${value > 0 ? "+" : "−"}${formatted} Kč/měs.`;
}

el("backBtn").addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
    quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

el("nextBtn").addEventListener("click", () => {
  if (selected[current] === null) {
    el("errorBox").style.display = "block";
    return;
  }
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
    quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    showResults();
  }
});

function dimBounds(dim) {
  let min = 0, max = 0;
  questions.forEach(q => {
    const vals = q.options.map(o => o.score[dim] ?? 0);
    min += Math.min(...vals);
    max += Math.max(...vals);
  });
  return { min, max };
}

function calculateScores() {
  const raw = Object.fromEntries(DIMS.map(d => [d, 0]));
  questions.forEach((q, i) => {
    const sc = q.options[selected[i]].score;
    DIMS.forEach(d => raw[d] += sc[d] ?? 0);
  });
  const norm = {};
  DIMS.forEach(d => {
    const { min, max } = dimBounds(d);
    norm[d] = Math.round(((raw[d] - min) / (max - min)) * 100);
  });
  return { raw, norm };
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const round1 = v => Math.round(v * 10) / 10;
const round100 = v => Math.round(v / 100) * 100;
const pctSigned = v => `${v > 0 ? "+" : ""}${String(round1(v)).replace(".", ",")} %`;
const fmtCZK = v => new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(v);
const fmtNumber = v => new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(v);

function lrLabel(v) {
  if (v < 20) return "výrazná ekonomická levice";
  if (v < 40) return "středolevice";
  if (v <= 60) return "ekonomický střed";
  if (v <= 80) return "středopravice";
  return "výrazná ekonomická pravice";
}

function level(v) {
  return v >= 80 ? "velmi vysoká" : v >= 65 ? "vysoká" : v >= 45 ? "střední" : v >= 30 ? "nízká" : "velmi nízká";
}

function archetypeFor(n, capacity, stateScope, incentiveIndex) {
  if (stateScope >= 68 && capacity < 45) {
    return [
      "Přerozdělující stát s vysokým účtem",
      "Volíte široké veřejné garance a zásahy, ale institucionální kapacita za rozsahem státu zaostává. Rodina odevzdává více peněz a významná část se rozpouští ve správě, špatném cílení nebo slabé kontrole."
    ];
  }
  if (stateScope >= 68 && capacity >= 65) {
    return [
      "Výkonný, ale nákladný sociální stát",
      "Stát umí část vysokých odvodů převést na použitelné služby. Cena je však zřetelná: menší hotovost pod vlastní kontrolou, nižší mezní odměna za další výkon a větší objem prostředků vystavený politickému rozhodování."
    ];
  }
  if (stateScope <= 35 && capacity >= 60 && incentiveIndex >= 60) {
    return [
      "Tržně-institucionální stát",
      "Ponecháváte domácnostem a firmám větší část vytvořené hodnoty, chráníte soutěž a vlastnická práva a stát soustřeďujete na omezené, kontrolovatelné funkce. Rizikem je nedostatečné krytí lidí bez rezervy."
    ];
  }
  if (stateScope <= 35 && capacity < 45) {
    return [
      "Nízkodaňový, ale slabě chráněný stát",
      "Stát bere málo, ale současně nedokáže spolehlivě chránit soutěž, práva a základní pojistky. Soukromá spotřeba je vyšší, část úspor však domácnost vydá za náhradu nefunkčních služeb a pojištění rizik."
    ];
  }
  if (incentiveIndex >= 65 && capacity >= 60) {
    return [
      "Konkurenční reformní stát",
      "Kombinujete relativně nízké distorzní daně, cílenou pomoc a měřitelný výkon institucí. Veřejné programy musí prokazovat návratnost a nesmějí automaticky vytlačovat soukromou volbu."
    ];
  }
  if (n.redist >= 58) {
    return [
      "Solidární stát s omezenou soukromou volbou",
      "Upřednostňujete sdílení rizik a široké veřejné služby. Test současně ukazuje cenu: vyšší povinné odvody, menší rozpočet pro vlastní spotřebu a slabší odměnu za dodatečný výkon."
    ];
  }
  return [
    "Smíšený stát s dvojím účtem",
    "Kombinujete tržní a přerozdělovací nástroje. Některé volby ponechávají peníze lidem, jiné je vracejí přes programy a služby. Výsledkem je kompromis, ale také složitější systém a méně průhledná odpovědnost."
  ];
}

function leakBand(integritySystem) {
  if (integritySystem >= 80) return { label: "nízké", min: 3, max: 7 };
  if (integritySystem >= 65) return { label: "mírné", min: 6, max: 10 };
  if (integritySystem >= 50) return { label: "zvýšené", min: 9, max: 14 };
  if (integritySystem >= 35) return { label: "vysoké", min: 13, max: 19 };
  return { label: "velmi vysoké", min: 18, max: 25 };
}

function selectedOption(i) {
  return questions[i].options[selected[i]];
}
