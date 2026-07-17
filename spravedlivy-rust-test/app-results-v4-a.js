function archetypeFor(result) {
  if (result.annualDeficitBn >= 430 && result.stateScope >= 60) {
    return ["Sociální stát placený dluhem", "Rozšiřujete transfery a služby rychleji než trvalé příjmy. Dnešní užitek proto doprovází vyšší budoucí úrokový účet všech domácností."];
  }
  if (result.stateScope >= 68 && result.ownCashDelta < 0) {
    return ["Vysokodaňový přerozdělovací stát", "Velká část příjmu přechází pod veřejné rozhodování. Domácnost získává širší účetní protihodnotu služeb, ale menší prostor pro vlastní spotřebu a akumulaci kapitálu."];
  }
  if (result.stateScope <= 36 && result.integrity >= 58) {
    return ["Tržně-institucionální stát", "Ponecháváte více peněz domácnostem a firmám a současně zachováváte soutěž, kontrolu a základní veřejné statky."];
  }
  if (result.stateScope <= 36) {
    return ["Nízkodaňový individuální stát", "Stát vybírá méně a domácnost investuje více sama. Cena spočívá ve vyšší nutnosti soukromě nahrazovat některé služby a pojistky."];
  }
  if (result.bookAlignedCount >= 10) {
    return ["Model blízký Spravedlivému růstu", "Ve většině témat volíte veřejně popsané návrhy knihy. Výsledek nyní ukazuje jejich společný daňový, dluhový a kapitálový účet pro zvolenou domácnost."];
  }
  return ["Smíšený daňový model", "Kombinujete tržní nástroje, veřejné garance a různé způsoby financování. Klíčový je výsledný rozdíl mezi povinným účtem, veřejnou protihodnotou a soukromým majetkem."];
}

function showResults() {
  const result = TaxModelV4.compute(selected, currentProfileId);
  const baseline = baselineScenario();
  const [archetype, archetypeDescription] = archetypeFor(result);
  const taxDelta = result.mandatoryLevies - baseline.mandatoryLevies;
  const ownDelta = result.ownCashDelta;
  const successDelta = result.successKeep - baseline.successKeep;

  quizPanel.style.display = "none";
  resultPanel.style.display = "block";

  el("archetype").textContent = archetype;
  el("archetypeDesc").textContent = `${archetypeDescription} Profil: ${result.profile.label}, ${result.profile.shortLabel}.`;
  el("verdictTitle").textContent = verdictTitle(result);
  el("verdictText").textContent = verdictText(result, taxDelta);

  setMetric("stateTakeValue", TaxModelV4.fmtCZK(result.mandatoryLevies));
  setMetric("stateTakeSub", `${signedMoney(taxDelta)} proti dnešnímu výchozímu účtu; ${String(result.labourLevyRate).replace(".", ",")} % práce plus jiné daně.`);
  setMetric("stateReturnValue", TaxModelV4.fmtCZK(result.stateAccountingAllocation));
  setMetric("stateReturnSub", `Účetní náklad: ${TaxModelV4.fmtCZK(result.cashSupport)} hotovost a ${TaxModelV4.fmtCZK(result.publicServiceCostMonthly)} veřejné služby. Není to tržní hodnota ani hotovost.`);
  setMetric("ownControlValue", TaxModelV4.fmtCZK(result.ownChoiceCash));
  setMetric("ownControlSub", `${signedMoney(ownDelta)} měsíčně proti výchozímu stavu po přímých daních, nezbytných výdajích a středním odhadu nepřímého přenosu.`);
  setMetric("successKeepValue", TaxModelV4.fmtCZK(result.successKeep));
  setMetric("successKeepSub", `Z dalších 10 000 Kč nákladů práce; mezní klín ${String(result.marginalWedge).replace(".", ",")} %, ${signedMoney(successDelta)} proti výchozímu stavu.`);
  setMetric("capitalValue", formatSignedCZK(result.capital20));
  setMetric("capitalSub", result.capital20 < 0
    ? `Nevytvořený majetek za 20 let při 6 % ročně. Hotovostní rozdíl: ${TaxModelV4.fmtCZK(Math.abs(ownDelta))} měsíčně; vlastněné penzijní účty jsou přičteny zvlášť.`
    : `Dodatečný majetek za 20 let při 6 % ročně. Hotovostní rozdíl: ${TaxModelV4.fmtCZK(Math.abs(ownDelta))} měsíčně; vlastněné penzijní účty jsou přičteny zvlášť.`);

  renderDebt(result, baseline);
  renderMoneyFlow(result);
  renderComparison(result, baseline);
  renderRichTax(result);
  renderServices(result);
  renderBookAlignment(result);
  renderSociety(result);
  renderStory(result);
  renderDetails(result);

  resultPanel.dataset.summary = makeSummary(result, archetype);

  const completion = {
    completedAt: new Date().toISOString(),
    archetype,
    leftRight: result.n.lr,
    redistribution: result.n.redist,
    stateCapacity: result.deliveryIndex,
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
    familyMoney: Math.max(0, result.ownChoiceCash),
    freeTimeHours: result.timeHours,
    targetPct: result.targetPct,
    coveragePct: result.coveragePct,
    leakMin: result.leak.min,
    leakMax: result.leak.max,
    answers: questions.map((question, index) => {
      const option = selectedOption(index);
      return {
        questionId: question.id,
        optionId: analyticsOptionId(option.id),
        questionTitle: question.title,
        optionLabel: option.text
      };
    })
  };

  window.__spravedlivyRustCompletion = completion;
  window.dispatchEvent(new CustomEvent("spravedlivy-rust:completed", { detail: completion }));
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function verdictTitle(result) {
  const delta = result.ownCashDelta;
  if (delta <= -100) {
    return `Měsíčně vám zůstane o ${TaxModelV4.fmtCZK(Math.abs(delta))} méně; za 20 let chybí ${TaxModelV4.fmtCZK(Math.abs(result.capital20))}`;
  }
  if (delta >= 100) {
    return `Měsíčně vám zůstane o ${TaxModelV4.fmtCZK(delta)} více; za 20 let vznikne ${TaxModelV4.fmtCZK(result.capital20)}`;
  }
  return "Soukromý měsíční účet se téměř nemění; rozhoduje dluh a kvalita služeb";
}

function verdictText(result, taxDelta) {
  const tax = taxDelta > 50
    ? `Stát vám dnes vezme o ${TaxModelV4.fmtCZK(taxDelta)} více měsíčně.`
    : taxDelta < -50
      ? `Stát vám dnes vezme o ${TaxModelV4.fmtCZK(Math.abs(taxDelta))} méně měsíčně.`
      : "Přímý měsíční odvod se téměř nemění.";
  const debt = result.deficitDeltaBn > 0.5
    ? `Současně zvyšujete roční schodek o ${TaxModelV4.fmtNumber(result.deficitDeltaBn)} mld. Kč; po deseti letech je modelová dluhová služba o ${TaxModelV4.fmtCZK(result.futureDebtServiceDeltaMonthly)} měsíčně na domácnost vyšší než ve výchozím scénáři.`
    : result.deficitDeltaBn < -0.5
      ? `Roční schodek snižujete o ${TaxModelV4.fmtNumber(Math.abs(result.deficitDeltaBn))} mld. Kč; budoucí dluhová služba je modelově nižší.`
      : "Nový roční schodek se proti schválenému rozpočtu téměř nemění.";
  return `${tax} ${debt}`;
}

function renderDebt(result, baseline) {
  setMetric("currentDebtService", TaxModelV4.fmtCZK(result.currentDebtServiceMonthly));
  setMetric("currentBorrowing", TaxModelV4.fmtCZK(result.currentBorrowingMonthly));
  setMetric("modelDeficit", formatBalance(result.annualDeficitBn));
  setMetric("modelBorrowing", TaxModelV4.fmtCZK(result.modelBorrowingMonthly));
  setMetric("futureDebtService", TaxModelV4.fmtCZK(result.futureDebtServiceMonthly));
  setMetric("futureDebtDelta", signedMoney(result.futureDebtServiceDeltaMonthly));
  setMetric("debtStock10", `${result.debtStockChange10Bn >= 0 ? "+" : "−"}${TaxModelV4.fmtNumber(Math.abs(result.debtStockChange10Bn))} mld. Kč`);

  const sentence = result.deficitDeltaBn > 0.5
    ? `Tuhle dávku nebo úlevu jste si nepůjčili vy, ale splácíte ji vy: váš soubor voleb přidává ${TaxModelV4.fmtNumber(result.deficitDeltaBn)} mld. Kč schodku ročně, tedy ${TaxModelV4.fmtCZK(result.deficitDeltaMonthly)} nového financování na domácnost měsíčně.`
    : result.deficitDeltaBn < -0.5
      ? `Vaše volby snižují potřebu půjček o ${TaxModelV4.fmtNumber(Math.abs(result.deficitDeltaBn))} mld. Kč ročně. Cena úspor je uvedena u omezených transferů a služeb.`
      : "Vaše volby nechávají roční potřebu půjček přibližně na úrovni schváleného rozpočtu 2026.";
  el("debtSentence").textContent = sentence;
  el("debtAssumption").textContent = `Výhled předpokládá, že roční saldo přetrvá 10 let a nový dluh nese průměrný úrok 3,5 %. Výchozí budoucí služba při trvalém schodku 310 mld. Kč je ${TaxModelV4.fmtCZK(baseline.futureDebtServiceMonthly)} měsíčně na domácnost.`;
}

function renderMoneyFlow(result) {
  const rows = [
    ["Hodnota práce domácnosti", result.profile.labourCost, "neutral"],
    ["Povinné odvody z práce", -result.labourLevies, "negative"],
    ["Jiné přímé a majetkové daně", -result.otherTaxes, result.otherTaxes >= 0 ? "negative" : "positive"],
    ["Hotovostní dávky a bonusy", result.cashSupport, "positive"],
    ["Nezbytné soukromé výdaje", -result.profile.essentialPrivateCosts, "negative"],
    ["Dodatečné soukromé náklady politik", -result.privatePolicyCosts, "negative"],
    ["Střední nepřímý přenos daní z kapitálu", result.richTaxAdjustment, result.richTaxAdjustment >= 0 ? "positive" : "negative"],
    ["Zůstává pod vlastní kontrolou", result.ownChoiceCash, "total"]
  ];
  el("moneyFlow").innerHTML = rows.map(([label, value, tone]) => {
    const sign = value < 0 ? "−" : value > 0 && tone === "positive" ? "+" : "";
    return `<div class="flow-row ${tone}"><span>${label}</span><b>${sign}${TaxModelV4.fmtCZK(Math.abs(value))}</b></div>`;
  }).join("");
  el("flowNote").textContent = `Veřejné služby nejsou odečteny podruhé: jejich financování je obsaženo v daních a dluhu. Vedle toku hotovosti jsou níže vykázány samostatně jako účetní náklad na průměrnou domácnost.`;
}

function renderComparison(result, baseline) {
  const rows = [
    ["Stát vezme měsíčně", baseline.mandatoryLevies, result.mandatoryLevies, false, "money"],
    ["Rodině zůstane pro vlastní volbu", baseline.ownChoiceCash, result.ownChoiceCash, true, "money"],
    ["Z dalších 10 000 Kč výkonu zůstane", baseline.successKeep, result.successKeep, true, "money"],
    ["Majetek po 20 letech při 6 %", 0, result.capital20, true, "money"],
    ["Dluhová služba po 10 letech / měsíc", baseline.futureDebtServiceMonthly, result.futureDebtServiceMonthly, false, "money"]
  ];
  el("comparisonBody").innerHTML = rows.map(([label, base, chosen, higherIsBetter, format]) => {
    const delta = chosen - base;
    const good = higherIsBetter ? delta >= 0 : delta <= 0;
    const value = format === "money" ? TaxModelV4.fmtCZK(chosen) : String(chosen);
    const baseValue = format === "money" ? TaxModelV4.fmtCZK(base) : String(base);
    return `<tr><th>${label}</th><td>${baseValue}</td><td>${value}</td><td class="${Math.abs(delta) < 50 ? "neutral" : good ? "good" : "bad"}">${signedMoney(delta)}</td></tr>`;
  }).join("");
}
