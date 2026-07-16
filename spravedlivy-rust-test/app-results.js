function analyticsOptionId(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `o${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function taxMixAdjustment() {
  const s = selectedOption(0).score;
  return clamp(
    0.90 * s.redist - 1.10 * s.lr - 0.45 * s.growth + 0.35 * Math.max(0, -s.admin),
    -5.5,
    5.5
  );
}

function transferTrapAdjustment() {
  const text = `${selectedOption(1).text} ${selectedOption(2).text}`.toLocaleLowerCase("cs-CZ");
  let adjustment = 0;
  if (/plynul|vratný daňový bonus/.test(text)) adjustment -= 4;
  if (/zrušit většinu podpor/.test(text)) adjustment -= 2;
  if (/univerzální/.test(text)) adjustment += 1;
  if (/přísně|časově omezené/.test(text)) adjustment += 4;
  if (/mnoho samostatných|dočasné příspěvky|dotace oborům/.test(text)) adjustment += 6;
  return adjustment;
}

function showResults() {
  const { norm: n } = calculateScores();

  const capacity = Math.round(0.45 * n.integrity + 0.20 * n.admin + 0.20 * n.fiscal + 0.15 * n.growth);
  const efficiency = Math.round(
    0.25 * n.growth + 0.25 * n.integrity + 0.15 * n.target + 0.10 * n.coverage +
    0.10 * n.admin + 0.10 * n.fiscal + 0.05 * n.time
  );
  const stateScope = Math.round(clamp(
    0.52 * n.redist + 0.18 * n.coverage + 0.12 * n.family + 0.18 * (100 - n.econFreedom),
    0,
    100
  ));

  const taxQuota = round1(clamp(
    FAMILY_MODEL.currentTaxQuota + (n.redist - 50) * 0.18 + (50 - n.econFreedom) * 0.04,
    26.5,
    44
  ));

  const grossLabourLevyRate = round1(clamp(
    FAMILY_MODEL.currentGrossLabourLevyRate + (n.redist - 50) * 0.13 + (50 - n.admin) * 0.025 + taxMixAdjustment(),
    27,
    55
  ));
  const mandatoryLevies = round100(FAMILY_MODEL.labourCost * grossLabourLevyRate / 100);
  const cashSupport = round100(clamp(
    FAMILY_MODEL.currentCashSupport + (n.redist - 50) * 95 + (n.coverage - 50) * 22 + (n.family - 50) * 16,
    0,
    10000
  ));
  const netLabourWedge = round1((mandatoryLevies - cashSupport) / FAMILY_MODEL.labourCost * 100);
  const cashAfterState = FAMILY_MODEL.labourCost - mandatoryLevies + cashSupport;
  const ownChoiceCash = round100(Math.max(0, cashAfterState - FAMILY_MODEL.essentialPrivateCosts));

  const baselineMandatory = round100(FAMILY_MODEL.labourCost * FAMILY_MODEL.currentGrossLabourLevyRate / 100);
  const baselineOwnChoice = FAMILY_MODEL.labourCost - baselineMandatory + FAMILY_MODEL.currentCashSupport - FAMILY_MODEL.essentialPrivateCosts;
  const ownCashDelta = ownChoiceCash - baselineOwnChoice;

  const consumptionRate = round1(clamp(
    15 + (taxQuota - FAMILY_MODEL.currentTaxQuota) * 0.45 + (n.redist - 50) * 0.015,
    10.5,
    20.5
  ));
  const purchasePower = round100(ownChoiceCash / (1 + consumptionRate / 100));
  const consumptionTax = ownChoiceCash - purchasePower;

  const publicServiceValue = round100(clamp(
    3200 + stateScope * 105 + (efficiency - 50) * 55 + (n.coverage - 50) * 20,
    2000,
    18000
  ));
  const directReturn = cashSupport + publicServiceValue;
  const returnRatio = Math.round(100 * directReturn / Math.max(mandatoryLevies, 1));
  const privateReplacement = round100(clamp(
    14500 - stateScope * 125 - (n.econFreedom - 50) * 12 - (n.coverage - 50) * 15,
    2200,
    14500
  ));
  const afterReplacement = ownChoiceCash - privateReplacement;

  const marginalWedge = round1(clamp(
    FAMILY_MODEL.currentMarginalWedge + (grossLabourLevyRate - FAMILY_MODEL.currentGrossLabourLevyRate) * 0.72 +
    (50 - n.admin) * 0.04 + transferTrapAdjustment(),
    24,
    70
  ));
  const successKeep = round100(10000 * (1 - marginalWedge / 100));
  const successPurchase = round100(successKeep / (1 + consumptionRate / 100));
  const incentiveIndex = Math.round(clamp(
    0.35 * n.econFreedom + 0.23 * n.growth + 0.16 * n.fiscal + 0.12 * n.admin +
    0.14 * (100 - n.redist) - Math.max(0, marginalWedge - 55) * 0.30,
    0,
    100
  ));

  const integritySystem = Math.round(
    0.50 * n.integrity + 0.20 * n.admin + 0.20 * n.fiscal + 0.10 * n.civicFreedom
  );
  const leak = leakBand(integritySystem);
  const deliveryRate = Math.round(clamp(
    42 + 0.34 * efficiency + 0.22 * integritySystem - 0.07 * stateScope,
    35,
    92
  ));
  const highExposureShare = 0.20;
  const riskPerMillion = round100(
    1000000 * (taxQuota / 100) * highExposureShare * (((leak.min + leak.max) / 2) / 100)
  );

  const marketDynamism =
    0.32 * n.econFreedom + 0.24 * n.growth + 0.16 * n.fiscal + 0.14 * n.admin + 0.14 * (100 - n.redist);
  const publicCapital =
    0.30 * n.growth + 0.25 * integritySystem + 0.20 * n.admin + 0.15 * n.coverage + 0.10 * n.target;
  const incentivePenalty = Math.max(0, marginalWedge - FAMILY_MODEL.currentMarginalWedge) * 0.075;
  const scalePenalty = Math.max(0, taxQuota - FAMILY_MODEL.currentTaxQuota) * 0.07;
  const underProvisionPenalty = Math.max(0, 30 - taxQuota) * 0.08 + Math.max(0, 30 - n.coverage) * 0.025;
  const gdp10 = clamp(
    (marketDynamism - 50) * 0.075 + (publicCapital - 50) * 0.035 - incentivePenalty - scalePenalty - underProvisionPenalty,
    -6,
    5
  );

  const timeHours = round1(clamp(14 + n.time * 0.10 - stateScope * 0.015 + n.admin * 0.015, 10, 24));
  const bureaucracyHours = round1(clamp(1.5 + stateScope * 0.035 + (100 - n.admin) * 0.055, 1.5, 10));
  const targetPct = Math.round(35 + n.target * 0.50);
  const coveragePct = Math.round(50 + n.coverage * 0.45);
  const freedom = Math.round(
    0.35 * n.econFreedom + 0.25 * n.civicFreedom + 0.25 * (100 - stateScope) + 0.15 * incentiveIndex
  );

  const [arch, desc] = archetypeFor(n, capacity, stateScope, incentiveIndex);

  quizPanel.style.display = "none";
  resultPanel.style.display = "block";

  setText("archetype", arch);
  setText("archetypeDesc", desc);
  setText("incentiveSeal", incentiveIndex);
  setText("lrValue", `${n.lr}/100`);
  setText("lrSub", `${lrLabel(n.lr)}; rozsah státu ${stateScope}/100, přerozdělování ${n.redist}/100.`);

  setText("taxValue", `${String(taxQuota).replace(".", ",")} % HDP`);
  setText("taxSub", `Modelový podíl ekonomické hodnoty pod povinnou veřejnou kontrolou; proti výchozím ${FAMILY_MODEL.currentTaxQuota} %.`);
  setText("laborLevyValue", `${String(grossLabourLevyRate).replace(".", ",")} %`);
  setText("laborLevySub", `${fmtCZK(mandatoryLevies)} měsíčně z modelových nákladů práce ${fmtCZK(FAMILY_MODEL.labourCost)}. Nejde o osobní daňové přiznání.`);
  setText("ownCashValue", fmtCZK(ownChoiceCash));
  setText("ownCashSub", `${signedMoney(ownCashDelta)} proti výchozímu scénáři; po povinných odvodech, hotovostních podporách a hlavních nezbytných výdajích.`);
  setText("successValue", fmtCZK(successKeep));
  setText("successSub", `Z dodatečných 10 000 Kč nákladů práce; modelový mezní klín ${String(marginalWedge).replace(".", ",")} %. Po cenových daních koupí přibližně za ${fmtCZK(successPurchase)}.`);
  setText("purchaseValue", fmtCZK(purchasePower));
  setText("purchaseSub", `Reálná modelová kupní síla vlastního rozpočtu po cenové daňové složce ${String(consumptionRate).replace(".", ",")} %.`);
  setText("publicReturnValue", `${returnRatio} %`);
  setText("publicReturnSub", `Hotovostní podpora a modelová užitná hodnota služeb představují ${fmtCZK(directReturn)} měsíčně; kvalita dodání ${deliveryRate}/100.`);
  setText("gdpValue", pctSigned(gdp10));
  setText("gdpSub", "Scénář po 10 letech proti pokračování trendu. Započítává motivace, investice i produktivní veřejné statky; nejistota je nejméně ±2 p. b.");
  setText("timeValue", `${String(timeHours).replace(".", ",")} h / týden`);
  setText("timeSub", `Volný čas na dospělého; další modelová administrativa a obíhání systémů ${String(bureaucracyHours).replace(".", ",")} h měsíčně.`);
  setText("leakValue", `${leak.min}–${leak.max} %`);
  setText("leakSub", `${capitalize(leak.label)} riziko u vysoce exponovaných veřejných zakázek. Při modelové ekonomické hodnotě 1 mil. Kč odpovídá kombinovaná expozice rozsahu státu a slabých kontrol přibližně ${fmtCZK(riskPerMillion)}; nejde o prokázanou krádež.`);

  renderLedger({
    mandatoryLevies,
    cashSupport,
    cashAfterState,
    essentialCosts: FAMILY_MODEL.essentialPrivateCosts,
    ownChoiceCash,
    consumptionTax,
    purchasePower,
    publicServiceValue,
    privateReplacement,
    afterReplacement,
    directReturn,
    returnRatio
  });

  renderBars([
    ["Peníze pod vlastní kontrolou", Math.round(clamp(ownChoiceCash / 500, 0, 100))],
    ["Pobídka k výkonu a investicím", incentiveIndex],
    ["Ekonomická svoboda", n.econFreedom],
    ["Občanská a datová svoboda", n.civicFreedom],
    ["Rozsah zásahu státu", stateScope],
    ["Schopnost státu", capacity],
    ["Efektivita výdajů", efficiency],
    ["Integrita a kontrola", integritySystem],
    ["Přesnost sociální pomoci", n.target],
    ["Fiskální udržitelnost", n.fiscal]
  ]);

  el("dot").style.left = `${clamp(n.lr, 3, 97)}%`;
  el("dot").style.bottom = `${clamp(incentiveIndex, 3, 97)}%`;

  setText("familyMoney", fmtCZK(ownChoiceCash));
  setText("familyPurchase", fmtCZK(purchasePower));
  setText("familySuccess", fmtCZK(successKeep));
  setText("familyTime", `${String(timeHours).replace(".", ",")} h`);

  const taxStory = selectedOption(0).story;
  const benefitsStory = selectedOption(2).story;
  const careStory = selectedOption(3).story;
  const housingStory = selectedOption(4).story;
  const schoolStory = selectedOption(5).story;
  const healthStory = selectedOption(7).story;
  const businessStory = selectedOption(9).story;
  const procurementStory = selectedOption(11).story;
  const digitalStory = selectedOption(12).story;
  const workStory = selectedOption(13).story;

  const cashSentence = ownCashDelta <= -2500
    ? `Oproti výchozímu modelu má domácnost každý měsíc o ${fmtCZK(Math.abs(ownCashDelta))} méně pro vlastní rozhodování.`
    : ownCashDelta >= 2500
      ? `Oproti výchozímu modelu má domácnost každý měsíc o ${fmtCZK(ownCashDelta)} více pro vlastní rozhodování.`
      : "Rozpočet pod vlastní kontrolou je blízko výchozímu modelu, mění se však skladba daní, služeb a rizik.";

  const successSentence = marginalWedge >= 58
    ? "Další práce nebo podnikatelský úspěch se domácnosti vrací slabě; významná část dodatečné hodnoty je odvedena nebo ztracena při odebrání podpor."
    : marginalWedge <= 38
      ? "Dodatečná práce a podnikatelský úspěch mají vysokou soukromou návratnost, takže motivace růst a investovat je silná."
      : "Dodatečný výkon se vyplácí středně: stát ponechá část odměny, část převede do společných systémů.";

  const serviceSentence = returnRatio >= 45
    ? `Za odvody domácnost dostává relativně vysoký přímý ekvivalent: modelově ${fmtCZK(directReturn)} měsíčně v hotovosti a službách.`
    : `Přímý ekvivalent odvodů je nízký: modelově ${fmtCZK(directReturn)} měsíčně; zbytek financuje širší veřejné funkce, jiné skupiny, administrativu a systémové ztráty.`;

  const societySentence = gdp10 >= 1.5
    ? "V tomto modelu konkurence, kapitál a dobře cílené veřejné statky převažují nad daňovými distorzemi, takže společnost dlouhodobě bohatne rychleji."
    : gdp10 <= -1.5
      ? "V tomto modelu vyšší mezní zdanění, slabé pobídky nebo neefektivní stát převáží nad přínosem služeb; společnost postupně ztrácí investice, inovace a růst příjmů."
      : "Dlouhodobý výsledek je smíšený: část veřejných služeb zvyšuje produktivitu, ale daně a regulace část soukromé aktivity vytlačují.";

  el("storyText").innerHTML = `
    <p><strong>Účet domácnosti:</strong> Petr a Jana vytvářejí modelové měsíční náklady práce ${fmtCZK(FAMILY_MODEL.labourCost)}. Povinné odvody a daně z práce dosahují ${fmtCZK(mandatoryLevies)}, hotovostní podpory ${fmtCZK(cashSupport)}. Po hlavních nezbytných výdajích jim zbývá <strong>${fmtCZK(ownChoiceCash)}</strong> pod vlastní kontrolou. ${cashSentence}</p>
    <p><strong>Co si skutečně koupí:</strong> po modelové cenové daňové složce má jejich vlastní rozpočet kupní sílu přibližně <strong>${fmtCZK(purchasePower)}</strong>. Pokud musí soukromě nahrazovat slabé veřejné služby, odčerpá to dalších ${fmtCZK(privateReplacement)}. ${serviceSentence}</p>
    <p><strong>Cena úspěchu:</strong> z dalšího zvýšení nákladů práce o 10 000 Kč zůstane rodině ${fmtCZK(successKeep)} před spotřebními daněmi. ${successSentence}</p>
    <p><strong>Konkrétní volby:</strong> ${taxStory} ${benefitsStory} ${careStory} ${workStory}</p>
    <p><strong>Bydlení, vzdělání a zdraví:</strong> ${housingStory} ${schoolStory} ${healthStory}</p>
    <p><strong>Podnikání, stát a kontrola:</strong> ${businessStory} ${procurementStory} ${digitalStory}</p>
    <p><strong>Dopad na společnost:</strong> ${societySentence} Modelový desetiletý rozdíl HDP na obyvatele je ${pctSigned(gdp10)} proti trendu. Osobní autonomie dosahuje ${freedom}/100 a rozsah státu ${stateScope}/100.</p>`;

  const all = [
    ["Vlastní rozpočet", Math.round(clamp(ownChoiceCash / 500, 0, 100)), "Domácnost si ponechává větší část vytvořené hodnoty pro vlastní spotřebu, úspory a investice."],
    ["Pobídka k výkonu", incentiveIndex, "Dodatečná práce, inovace a podnikatelský úspěch mají vyšší soukromou návratnost."],
    ["Růstový potenciál", Math.round(clamp(50 + gdp10 * 8, 0, 100)), "Kombinace konkurence, kapitálu a produktivních institucí podporuje dlouhodobý růst."],
    ["Integrita institucí", integritySystem, "Rozhodování, zakázky a kontrola jsou průhlednější a osobní odpovědnost je vymahatelnější."],
    ["Cílení pomoci", n.target, "Vyšší podíl podpory směřuje k lidem s prokazatelnou potřebou místo plošného přerozdělování."],
    ["Pokrytí", n.coverage, "Oprávnění lidé mají reálnou šanci pomoc získat."],
    ["Ekonomická svoboda", n.econFreedom, "Lidé a firmy mají širší možnost rozhodovat o smlouvách, investicích a službách."],
    ["Občanská svoboda", n.civicFreedom, "Pravidla lépe chrání soukromí, opravné prostředky a kontrolu moci."],
    ["Fiskální stabilita", n.fiscal, "Náklady nejsou systematicky přesouvány na budoucí daňové poplatníky."],
    ["Jednoduchost", n.admin, "Méně výjimek a formulářů snižuje transakční náklady i prostor pro lobbying."]
  ];
  const top = [...all].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const bottom = [...all].sort((a, b) => a[1] - b[1]).slice(0, 3);
  el("strengths").innerHTML = top.map(x => `<li><strong>${x[0]} (${x[1]}/100):</strong> ${x[2]}</li>`).join("");
  el("risks").innerHTML = bottom.map(x => `<li><strong>${x[0]} (${x[1]}/100):</strong> ${riskText(x[0])}</li>`).join("");

  const summaryInput = {
    n,
    arch,
    capacity,
    efficiency,
    stateScope,
    incentiveIndex,
    freedom,
    taxQuota,
    grossLabourLevyRate,
    mandatoryLevies,
    cashSupport,
    netLabourWedge,
    ownChoiceCash,
    ownCashDelta,
    purchasePower,
    consumptionRate,
    publicServiceValue,
    returnRatio,
    privateReplacement,
    marginalWedge,
    successKeep,
    successPurchase,
    gdp10,
    timeHours,
    bureaucracyHours,
    targetPct,
    coveragePct,
    leak,
    riskPerMillion
  };
  resultPanel.dataset.summary = makeSummary(summaryInput);

  const completion = {
    completedAt: new Date().toISOString(),
    archetype: arch,
    leftRight: n.lr,
    redistribution: n.redist,
    stateCapacity: capacity,
    efficiency,
    integrity: integritySystem,
    economicFreedom: n.econFreedom,
    civicFreedom: n.civicFreedom,
    targetPrecision: n.target,
    coverage: n.coverage,
    fiscal: n.fiscal,
    growthPotential: n.growth,
    timeAutonomy: n.time,
    adminSimplicity: n.admin,
    familyImpact: n.family,
    taxQuota,
    gdp10: round1(gdp10),
    familyMoney: ownChoiceCash,
    freeTimeHours: timeHours,
    targetPct,
    coveragePct,
    leakMin: leak.min,
    leakMax: leak.max,
    grossLabourLevyRate,
    mandatoryLevies,
    cashSupport,
    netLabourWedge,
    ownChoiceCash,
    purchasePower,
    consumptionRate,
    publicServiceValue,
    returnRatio,
    privateReplacement,
    marginalWedge,
    successKeep,
    successPurchase,
    stateScope,
    incentiveIndex,
    bureaucracyHours,
    riskPerMillion,
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

function renderLedger(values) {
  const rows = [
    ["Celkové měsíční náklady práce domácnosti", values.mandatoryLevies + (FAMILY_MODEL.labourCost - values.mandatoryLevies), FAMILY_MODEL.labourCost, "base"],
    ["Povinné daně a odvody z práce", -values.mandatoryLevies, values.mandatoryLevies, "negative"],
    ["Hotovostní dávky a daňové bonusy", values.cashSupport, values.cashSupport, "positive"],
    ["Hotovost po přímém zásahu státu", values.cashAfterState, values.cashAfterState, "subtotal"],
    ["Hlavní nezbytné soukromé výdaje", -values.essentialCosts, values.essentialCosts, "negative"],
    ["Peníze pod vlastní kontrolou", values.ownChoiceCash, values.ownChoiceCash, "total"],
    ["Cenové daně obsažené ve vlastní spotřebě", -values.consumptionTax, values.consumptionTax, "negative"],
    ["Kupní síla vlastního rozpočtu", values.purchasePower, values.purchasePower, "total"],
    ["Modelová užitná hodnota veřejných služeb", values.publicServiceValue, values.publicServiceValue, "positive"],
    ["Nutná soukromá náhrada chybějících služeb", -values.privateReplacement, values.privateReplacement, "negative"],
    ["Vlastní hotovost po soukromé náhradě služeb", values.afterReplacement, values.afterReplacement, "subtotal"]
  ];
  el("ledgerBody").innerHTML = rows.map(([label, signed, absolute, type]) => {
    const displayed = type === "base" || type === "subtotal" || type === "total"
      ? fmtCZK(absolute)
      : `${signed >= 0 ? "+" : "−"}${fmtCZK(Math.abs(absolute))}`;
    return `<tr class="ledger-${type}"><th scope="row">${label}</th><td>${displayed}</td></tr>`;
  }).join("");
  setText("ledgerReturn", `Přímý měsíční ekvivalent odvodů: ${fmtCZK(values.directReturn)} (${values.returnRatio} % odvodů).`);
}

function renderBars(data) {
  const bars = el("bars");
  bars.innerHTML = "";
  data.forEach(([label, val]) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `<div class="bar-label">${label}</div><div class="bar-track"><div class="bar-fill" style="width:${clamp(val, 0, 100)}%"></div></div><div class="bar-value">${Math.round(val)}</div>`;
    bars.appendChild(row);
  });
}

function setText(id, value) {
  const node = el(id);
  if (node) node.textContent = value;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function riskText(name) {
  const map = {
    "Vlastní rozpočet": "Větší část hodnoty přebírá stát nebo povinné systémy; domácnost má méně peněz pro vlastní priority, úspory a investice.",
    "Pobídka k výkonu": "Další práce, kariérní růst nebo podnikatelský zisk mají nízkou čistou návratnost, což může oslabit nabídku práce, investice a inovace.",
    "Růstový potenciál": "Daňové distorze, neefektivní regulace nebo nedostatek produktivních investic mohou snižovat dlouhodobý růst příjmů.",
    "Integrita institucí": "Větší prostor pro klientelismus, jediného uchazeče, formální kontrolu nebo nejasnou osobní odpovědnost.",
    "Cílení pomoci": "Významná část podpory může jít lidem, kteří ji nepotřebují, zatímco náklady nesou i domácnosti bez nároku.",
    "Pokrytí": "Příliš úzký nebo složitý systém může minout oprávněné lidi a přesunout riziko na rodiny bez rezervy.",
    "Ekonomická svoboda": "Rozhodování domácností a firem je více nahrazováno příkazy, kvótami, licencemi nebo politickým výběrem.",
    "Občanská svoboda": "Slabší procesní záruky mohou omezit soukromí, odvolání a kontrolu nad rozhodováním úřadů.",
    "Fiskální stabilita": "Současná spotřeba se financuje dluhem, budoucími daněmi nebo náhlými škrty.",
    "Jednoduchost": "Výjimky, dotace a více schvalovacích stupňů zvyšují náklady, lobbying a výhodu dobře napojených subjektů."
  };
  return map[name] || "Zvolený nástroj má slabou návratnost nebo výrazné vedlejší náklady.";
}

function makeSummary(r) {
  return `SPRAVEDLIVÝ RŮST – KDO ZAPLATÍ ÚČET?\n\nTyp: ${r.arch}\nLevice–pravice: ${r.n.lr}/100 (${lrLabel(r.n.lr)})\nRozsah zásahu státu: ${r.stateScope}/100; přerozdělování ${r.n.redist}/100\nModelová daňová kvóta: ${String(r.taxQuota).replace(".", ",")} % HDP\nPodíl nákladů práce odvedený státu: ${String(r.grossLabourLevyRate).replace(".", ",")} % = ${fmtCZK(r.mandatoryLevies)} měsíčně\nHotovostní podpora: ${fmtCZK(r.cashSupport)} měsíčně\nPeníze pod vlastní kontrolou: ${fmtCZK(r.ownChoiceCash)} (${signedMoney(r.ownCashDelta)} proti výchozímu scénáři)\nKupní síla vlastního rozpočtu: ${fmtCZK(r.purchasePower)}\nZ dalších 10 000 Kč nákladů práce zůstane: ${fmtCZK(r.successKeep)}; mezní klín ${String(r.marginalWedge).replace(".", ",")} %\nPřímý ekvivalent odvodů v dávkách a službách: ${r.returnRatio} %\nPobídka k výkonu: ${r.incentiveIndex}/100; schopnost státu ${r.capacity}/100; efektivita ${r.efficiency}/100\nHDP na obyvatele po 10 letech proti trendu: ${pctSigned(r.gdp10)}\nVolný čas: ${String(r.timeHours).replace(".", ",")} h týdně; administrativa ${String(r.bureaucracyHours).replace(".", ",")} h měsíčně\nRiziko ztrát u vysoce exponovaných zakázek: ${r.leak.min}–${r.leak.max} %; kombinovaná expozice na 1 mil. Kč ekonomické hodnoty ${fmtCZK(r.riskPerMillion)}\n\nJde o transparentně tržně-liberální stresový test. Účetní dopady jsou scénářové, nikoli osobní daňový výpočet; kauzální odhady mají širokou nejistotu.`;
}

el("copyBtn").addEventListener("click", async () => {
  const text = resultPanel.dataset.summary || "";
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  const t = el("toast");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
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
