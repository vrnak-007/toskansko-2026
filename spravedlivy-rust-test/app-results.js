function analyticsOptionId(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `o${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function lrLabel(value) {
  if (value < 20) return "výrazná ekonomická levice";
  if (value < 40) return "středolevice";
  if (value <= 60) return "ekonomický střed";
  if (value <= 80) return "středopravice";
  return "výrazná ekonomická pravice";
}

function archetypeFor(result) {
  if (result.stateScope >= 70 && result.richTax >= 65) {
    return [
      "Vysokodaňový přerozdělovací stát",
      "Velkou část příjmu a investičního rozhodování přesouváte pod stát. Domácnost dostává širší služby a transfery, ale platí nižší soukromou spotřebou a slabší návratností dalšího výkonu."
    ];
  }
  if (result.stateScope >= 60) {
    return [
      "Rozsáhlý sociální stát",
      "Preferujete vysoké veřejné garance. Výsledek proto stojí na tom, zda služby skutečně vrátí domácnostem hodnotu odpovídající povinným odvodům."
    ];
  }
  if (result.stateScope <= 32 && result.capacity >= 58) {
    return [
      "Tržně-institucionální stát",
      "Ponecháváte větší část příjmu lidem a firmám, současně zachováváte pravidla, soutěž a kontrolu. Domácnost získává vyšší prostor pro vlastní spotřebu a investice."
    ];
  }
  if (result.stateScope <= 35) {
    return [
      "Nízkodaňový individuální stát",
      "Stát vybírá méně a domácnost rozhoduje o větší části příjmu. Cena spočívá ve vyšší potřebě soukromě hradit služby a pojištění."
    ];
  }
  return [
    "Smíšený daňový model",
    "Kombinujete veřejné garance se soukromou volbou. Rozhodující je, zda veřejná protihodnota vyváží peníze, které domácnost nemůže použít podle vlastních priorit."
  ];
}

function showResults() {
  const result = TaxModel.compute(selected);
  const [archetype, archetypeDescription] = archetypeFor(result);
  const baseline = BASELINE_SCENARIO;
  const taxDelta = result.mandatoryLevies - baseline.mandatoryLevies;
  const ownDelta = result.ownChoiceCash - baseline.ownChoiceCash;
  const successDelta = result.successKeep - baseline.successKeep;

  quizPanel.style.display = "none";
  resultPanel.style.display = "block";

  el("archetype").textContent = archetype;
  el("archetypeDesc").textContent = archetypeDescription;
  el("verdictTitle").textContent = verdictTitle(result, ownDelta);
  el("verdictText").textContent = verdictText(result, taxDelta, ownDelta);

  setMetric("stateTakeValue", TaxModel.fmtCZK(result.mandatoryLevies));
  setMetric("stateTakeSub", `${signedMoney(taxDelta)} proti výchozímu účtu; ${String(result.levyRate).replace(".", ",")} % nákladů práce.`);
  setMetric("stateReturnValue", TaxModel.fmtCZK(result.stateReturn));
  setMetric("stateReturnSub", `${TaxModel.fmtCZK(result.cashSupport)} v hotovosti a modelová hodnota služeb ${TaxModel.fmtCZK(result.publicServiceValue)}.`);
  setMetric("ownControlValue", TaxModel.fmtCZK(result.ownChoiceCash));
  setMetric("ownControlSub", `${signedMoney(ownDelta)} proti výchozímu účtu po daních, dávkách a nezbytných výdajích.`);
  setMetric("successKeepValue", TaxModel.fmtCZK(result.successKeep));
  setMetric("successKeepSub", `Z dalších 10 000 Kč nákladů práce; mezní klín ${String(result.marginalWedge).replace(".", ",")} %, ${signedMoney(successDelta)} proti výchozímu stavu.`);

  renderFlow(result);
  renderComparison(result, baseline);
  renderRichTax(result);
  renderSociety(result);
  renderStory(result, ownDelta);
  renderDetails(result);

  resultPanel.dataset.summary = makeSummary(result, archetype);

  const completion = {
    completedAt: new Date().toISOString(),
    archetype,
    leftRight: result.n.lr,
    redistribution: result.n.redist,
    stateCapacity: result.capacity,
    efficiency: result.efficiency,
    integrity: result.integrity,
    economicFreedom: result.n.econFreedom,
    civicFreedom: result.n.civicFreedom,
    targetPrecision: result.n.target,
    coverage: result.n.coverage,
    fiscal: result.n.fiscal,
    growthPotential: result.n.growth,
    timeAutonomy: result.n.time,
    adminSimplicity: result.n.admin,
    familyImpact: result.n.family,
    taxQuota: result.taxQuota,
    gdp10: result.gdp10,
    familyMoney: result.ownChoiceCash,
    freeTimeHours: result.timeHours,
    targetPct: result.targetPct,
    coveragePct: result.coveragePct,
    leakMin: result.leak.min,
    leakMax: result.leak.max,
    answers: questions.map((question, index) => {
      const option = selectedOption(index);
      return {
        questionId: `q${String(index + 1).padStart(2, "0")}`,
        optionId: analyticsOptionId(option.text),
        questionTitle: question.title,
        optionLabel: option.text
      };
    })
  };

  window.__spravedlivyRustCompletion = completion;
  window.dispatchEvent(new CustomEvent("spravedlivy-rust:completed", { detail: completion }));
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function verdictTitle(result, ownDelta) {
  if (ownDelta <= -5000) return `Stát vám ponechá o ${TaxModel.fmtCZK(Math.abs(ownDelta))} méně měsíčně`;
  if (ownDelta >= 5000) return `Domácnosti ponecháváte o ${TaxModel.fmtCZK(ownDelta)} více měsíčně`;
  if (result.richTax >= 65) return "Účet přesouváte na vysoké příjmy a kapitál — část se vrací ke všem";
  return "Výsledný účet je blízko dnešnímu zatížení";
}

function verdictText(result, taxDelta, ownDelta) {
  const direct = taxDelta > 0
    ? `Povinný měsíční odvod je o ${TaxModel.fmtCZK(taxDelta)} vyšší.`
    : taxDelta < 0
      ? `Povinný měsíční odvod je o ${TaxModel.fmtCZK(Math.abs(taxDelta))} nižší.`
      : "Povinný měsíční odvod se téměř nemění.";
  const privateChoice = ownDelta < 0
    ? `Na vlastní spotřebu, úspory a investice zbývá o ${TaxModel.fmtCZK(Math.abs(ownDelta))} méně.`
    : ownDelta > 0
      ? `Na vlastní spotřebu, úspory a investice zbývá o ${TaxModel.fmtCZK(ownDelta)} více.`
      : "Prostor pro vlastní spotřebu se téměř nemění.";
  const rich = result.richTax > 55
    ? `Vyšší zdanění vysokých příjmů, firem a kapitálu se v tomto modelu nezastaví u bohatých: přes investice, mzdy a ceny vytváří nepřímý dopad ${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až ${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} měsíčně na běžnou domácnost.`
    : result.richTax < 45
      ? `Nižší zdanění vysokých příjmů a kapitálu v tomto modelu zvyšuje prostor pro investice a mzdy o ${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až ${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} měsíčně na modelovou domácnost.`
      : "Zdanění vysokých příjmů a kapitálu zůstává přibližně na výchozí úrovni.";
  return `${direct} ${privateChoice} ${rich}`;
}

function renderFlow(result) {
  const rows = [
    ["Hodnota práce Petra a Jany", TaxModel.FAMILY.labourCost, "neutral"],
    ["Povinné daně a odvody", -result.mandatoryLevies, "negative"],
    ["Hotovostní dávky a bonusy", result.cashSupport, "positive"],
    ["Nezbytné soukromé výdaje", -TaxModel.FAMILY.essentialPrivateCosts, "negative"],
    ["Zůstává pod vlastní kontrolou", result.ownChoiceCash, "total"]
  ];
  el("moneyFlow").innerHTML = rows.map(([label, value, tone]) => `
    <div class="flow-row ${tone}"><span>${label}</span><b>${value < 0 ? "−" : value > 0 && tone === "positive" ? "+" : ""}${TaxModel.fmtCZK(Math.abs(value))}</b></div>`).join("");
  el("flowNote").textContent = `Stát z povinných odvodů vrací domácnosti modelově ${result.returnRatio} % ve formě hotovosti a použitelných služeb. Zbytek financuje jiné osoby, jiné služby, správu, rezervy a případnou neefektivitu.`;
}

function renderComparison(result, baseline) {
  const rows = [
    ["Stát vezme měsíčně", baseline.mandatoryLevies, result.mandatoryLevies, false],
    ["Rodině zůstane pro vlastní volbu", baseline.ownChoiceCash, result.ownChoiceCash, true],
    ["Z dalších 10 000 Kč výkonu zůstane", baseline.successKeep, result.successKeep, true],
    ["Modelová kupní síla vlastního rozpočtu", baseline.purchasePower, result.purchasePower, true]
  ];
  el("comparisonBody").innerHTML = rows.map(([label, base, chosen, higherIsBetter]) => {
    const delta = chosen - base;
    const good = higherIsBetter ? delta >= 0 : delta <= 0;
    return `<tr><th>${label}</th><td>${TaxModel.fmtCZK(base)}</td><td>${TaxModel.fmtCZK(chosen)}</td><td class="${Math.abs(delta) < 50 ? "neutral" : good ? "good" : "bad"}">${signedMoney(delta)}</td></tr>`;
  }).join("");
}

function renderRichTax(result) {
  const value = el("richTaxImpactValue");
  const title = el("richTaxImpactTitle");
  const text = el("richTaxImpactText");

  if (result.richTax > 55) {
    value.textContent = `−${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až −${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} / měs.`;
    title.textContent = "Daň na bohaté a firmy nekončí u bohatých";
    text.textContent = `Intenzita zdanění vysokých příjmů a podnikatelského kapitálu je ${result.richTax}/100. Model předpokládá, že 20–50 % dodatečného zatížení mobilního kapitálu a firem se v delším období přenese na ostatní přes nižší investice, pomalejší růst mezd, změnu cen nebo přesun aktivity. Jde o citlivostní interval, nikoli o univerzální český kauzální odhad.`;
    return;
  }
  if (result.richTax < 45) {
    value.textContent = `+${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až +${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} / měs.`;
    title.textContent = "Nižší zdanění kapitálu ponechává více prostoru investicím";
    text.textContent = `Intenzita zdanění vysokých příjmů a podnikatelského kapitálu je ${result.richTax}/100. Model převádí část nižšího zatížení do vyššího investičního prostoru, mezd a soukromé tvorby kapitálu. Přínos není automatický: může se ztratit při slabé soutěži, rentách nebo nefunkčních institucích.`;
    return;
  }
  value.textContent = "přibližně 0 Kč";
  title.textContent = "Zdanění vysokých příjmů a kapitálu je blízko výchozímu stavu";
  text.textContent = "Váš výběr nevytváří výrazný dodatečný přesun daňového účtu mezi kapitálem, firmami a běžnými domácnostmi.";
}

function renderSociety(result) {
  const prosperity = result.gdp10 < 0
    ? `Po deseti letech je modelový HDP na obyvatele o ${String(Math.abs(result.gdp10)).replace(".", ",")} % níže než při pokračování výchozího trendu.`
    : result.gdp10 > 0
      ? `Po deseti letech je modelový HDP na obyvatele o ${String(result.gdp10).replace(".", ",")} % výše než při pokračování výchozího trendu.`
      : "Desetiletý scénář se od výchozího trendu téměř neliší.";
  const mechanism = result.richTax > 55
    ? "Hlavní brzdou jsou vyšší mezní sazby, slabší návratnost podnikání a přenos části daně na investice, mzdy a ceny."
    : result.stateScope < 35
      ? "Hlavním motorem je vyšší soukromá návratnost práce a kapitálu; rizikem je podfinancování základních veřejných statků."
      : "Výsledek závisí na rovnováze mezi soukromými pobídkami a produktivní veřejnou protihodnotou.";
  el("societyVerdict").innerHTML = `<strong>${prosperity}</strong> ${mechanism}`;
}

function renderStory(result, ownDelta) {
  const ownText = ownDelta < 0
    ? `o ${TaxModel.fmtCZK(Math.abs(ownDelta))} méně než ve výchozím scénáři`
    : ownDelta > 0
      ? `o ${TaxModel.fmtCZK(ownDelta)} více než ve výchozím scénáři`
      : "přibližně stejně jako ve výchozím scénáři";
  const richText = result.richTax > 55
    ? `Petr s Janou nejsou cílovou skupinou daně „na bohaté“, přesto model počítá s nepřímým účtem ${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až ${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} měsíčně přes pomalejší mzdy, investice a ceny.`
    : result.richTax < 45
      ? `Nižší zdanění kapitálu jim daň přímo nevrací, ale model předpokládá vyšší investiční a mzdový prostor ${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až ${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} měsíčně.`
      : "Zdanění vysokých příjmů a kapitálu jejich výsledek proti výchozímu stavu výrazně nemění.";

  el("storyText").innerHTML = `
    <p>Petr a Jana vytvářejí v zaměstnání hodnotu odpovídající nákladům práce <strong>${TaxModel.fmtCZK(TaxModel.FAMILY.labourCost)}</strong>. Stát z ní povinně odebere <strong>${TaxModel.fmtCZK(result.mandatoryLevies)}</strong> a v hotovosti vrátí <strong>${TaxModel.fmtCZK(result.cashSupport)}</strong>. Po nezbytných výdajích rodina sama rozhoduje o <strong>${TaxModel.fmtCZK(result.ownChoiceCash)}</strong> měsíčně — ${ownText}.</p>
    <p>${richText}</p>
    <p>Když Petr získá zakázku nebo povýšení, které zvýší náklady práce o 10 000 Kč, rodině zůstane <strong>${TaxModel.fmtCZK(result.successKeep)}</strong>; po cenových daních má tato částka kupní sílu přibližně <strong>${TaxModel.fmtCZK(result.successPurchase)}</strong>. Zbytek přebírají daně, odvody a případné odebrání podpory.</p>
    <p>Veřejné služby mají v modelu hodnotu <strong>${TaxModel.fmtCZK(result.publicServiceValue)}</strong> měsíčně. Pokud je rodina chce nahradit soukromě, model odhaduje náklad <strong>${TaxModel.fmtCZK(result.privateReplacement)}</strong>. Smyslem není tvrdit, že stát nedodává nic, ale ukázat, zda dodaná protihodnota vyvažuje ztrátu vlastní volby a pobídek.</p>`;
}

function renderDetails(result) {
  const details = [
    ["Daňová kvóta", `${String(result.taxQuota).replace(".", ",")} % HDP`],
    ["Rozsah zásahu státu", `${result.stateScope}/100`],
    ["Pobídka k práci a investicím", `${result.incentiveIndex}/100`],
    ["Ekonomická orientace", `${result.n.lr}/100 — ${lrLabel(result.n.lr)}`],
    ["Přerozdělování", `${result.n.redist}/100`],
    ["Modelová kupní síla", TaxModel.fmtCZK(result.purchasePower)],
    ["Soukromá náhrada služeb", TaxModel.fmtCZK(result.privateReplacement)],
    ["Čas pro rodinu", `${String(result.timeHours).replace(".", ",")} h týdně na dospělého`],
    ["Administrativní čas", `${String(result.bureaucracyHours).replace(".", ",")} h měsíčně`],
    ["Efektivita veřejných výdajů", `${result.efficiency}/100`],
    ["Integrita a kontrola", `${result.integrity}/100`],
    ["Riziko u exponovaných zakázek", `${result.leak.min}–${result.leak.max} %`],
    ["Expozice na 1 mil. Kč ekonomické hodnoty", TaxModel.fmtCZK(result.riskPerMillion)],
    ["HDP na obyvatele po 10 letech", `${result.gdp10 > 0 ? "+" : ""}${String(result.gdp10).replace(".", ",")} %`]
  ];
  el("detailGrid").innerHTML = details.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("");
}

function makeSummary(result, archetype) {
  const spillover = result.richTax > 55
    ? `−${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až −${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} měsíčně`
    : result.richTax < 45
      ? `+${TaxModel.fmtCZK(result.richTaxSpilloverLow)} až +${TaxModel.fmtCZK(result.richTaxSpilloverHigh)} měsíčně`
      : "bez významné změny";
  return `SPRAVEDLIVÝ RŮST – KDO ZAPLATÍ ÚČET?\n\nTyp: ${archetype}\nStát vezme: ${TaxModel.fmtCZK(result.mandatoryLevies)} měsíčně (${String(result.levyRate).replace(".", ",")} % nákladů práce)\nStát vrátí v hotovosti a službách: ${TaxModel.fmtCZK(result.stateReturn)}\nRodině zůstane pod vlastní kontrolou: ${TaxModel.fmtCZK(result.ownChoiceCash)}\nZ dalších 10 000 Kč výkonu zůstane: ${TaxModel.fmtCZK(result.successKeep)}\nNepřímý dopad zdanění vysokých příjmů, firem a kapitálu: ${spillover}\nDaňová kvóta: ${String(result.taxQuota).replace(".", ",")} % HDP\nRozsah státu: ${result.stateScope}/100\nPobídka k výkonu: ${result.incentiveIndex}/100\nHDP na obyvatele po 10 letech proti trendu: ${result.gdp10 > 0 ? "+" : ""}${String(result.gdp10).replace(".", ",")} %\nRiziko u exponovaných zakázek: ${result.leak.min}–${result.leak.max} %\n\nJde o transparentní tržně-liberální scénářový model, nikoli osobní daňovou kalkulačku ani univerzální ekonomický zákon.`;
}

function setMetric(id, value) {
  el(id).textContent = value;
}

function signedMoney(value) {
  if (Math.abs(value) < 50) return "beze změny";
  return `${value > 0 ? "+" : "−"}${TaxModel.fmtCZK(Math.abs(value))}`;
}

el("copyBtn").addEventListener("click", async () => {
  const text = resultPanel.dataset.summary || "";
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  const toast = el("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
});

el("printBtn").addEventListener("click", () => window.print());
el("restartBtn").addEventListener("click", () => {
  selected.fill(null);
  current = 0;
  resultPanel.style.display = "none";
  introPanel.style.display = "block";
  window.__spravedlivyRustCompletion = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
});
