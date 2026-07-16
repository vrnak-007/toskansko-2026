(() => {
  "use strict";

  const FAMILY = Object.freeze({
    labourCost: 120000,
    essentialPrivateCosts: 45500,
    baselineLevyRate: 41.2,
    baselineCashSupport: 2400,
    baselineTaxQuota: 34,
    baselineMarginalWedge: 45.1
  });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const round1 = value => Math.round(value * 10) / 10;
  const round100 = value => Math.round(value / 100) * 100;
  const fmtCZK = value => new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(value);

  const bounds = Object.fromEntries(DIMS.map(dim => {
    let positive = 0;
    let negative = 0;
    questions.forEach(question => {
      const values = question.options.map(option => Number(option.score?.[dim] || 0));
      positive += Math.max(0, ...values);
      negative += Math.max(0, ...values.map(value => -value));
    });
    return [dim, { positive: positive || 1, negative: negative || 1 }];
  }));

  function scoreSelections(selections) {
    const raw = Object.fromEntries(DIMS.map(dim => [dim, 0]));
    questions.forEach((question, index) => {
      const selectedIndex = selections[index];
      if (!Number.isInteger(selectedIndex) || !question.options[selectedIndex]) return;
      const score = question.options[selectedIndex].score || {};
      DIMS.forEach(dim => { raw[dim] += Number(score[dim] || 0); });
    });

    const norm = {};
    DIMS.forEach(dim => {
      const value = raw[dim];
      const denominator = value >= 0 ? bounds[dim].positive : bounds[dim].negative;
      norm[dim] = Math.round(clamp(50 + 50 * value / denominator, 0, 100));
    });
    return { raw, norm };
  }

  function optionAt(selections, questionIndex) {
    const index = selections[questionIndex];
    return Number.isInteger(index) ? questions[questionIndex]?.options[index] || null : null;
  }

  function textAt(selections, questionIndex) {
    return String(optionAt(selections, questionIndex)?.text || "").toLocaleLowerCase("cs-CZ");
  }

  function taxMixAdjustment(selections) {
    const score = optionAt(selections, 0)?.score;
    if (!score) return 0;
    return clamp(
      0.90 * score.redist - 1.10 * score.lr - 0.45 * score.growth + 0.35 * Math.max(0, -score.admin),
      -5.5,
      5.5
    );
  }

  function transferTrapAdjustment(selections) {
    const text = `${textAt(selections, 1)} ${textAt(selections, 2)}`;
    let adjustment = 0;
    if (/plynul|vratný daňový bonus/.test(text)) adjustment -= 4;
    if (/zrušit většinu podpor/.test(text)) adjustment -= 2;
    if (/univerzální/.test(text)) adjustment += 1;
    if (/přísně|časově omezené/.test(text)) adjustment += 4;
    if (/mnoho samostatných|dočasné příspěvky|dotace oborům/.test(text)) adjustment += 6;
    return adjustment;
  }

  function richTaxIntensity(selections, norm) {
    let value = 50 + 0.42 * (norm.redist - 50) - 0.30 * (norm.lr - 50);
    const taxText = textAt(selections, 0);
    const businessText = textAt(selections, 9);

    if (/výrazně zvýšit progresi|zdanění firem/.test(taxText)) value += 30;
    if (/snížit daň z příjmů, odvody, daň firem/.test(taxText)) value -= 32;
    if (/majetkovou daň|hodnoty nemovitostí/.test(taxText)) value += 5;
    if (/plošně snížit daň firem/.test(businessText)) value -= 18;
    if (/národní šampiony|individuální investiční pobídky/.test(businessText)) value += 8;

    return Math.round(clamp(value, 0, 100));
  }

  function compute(selections) {
    const cleanSelections = Array.from({ length: questions.length }, (_, index) =>
      Number.isInteger(selections?.[index]) ? selections[index] : null
    );
    const { raw, norm: n } = scoreSelections(cleanSelections);

    const capacity = Math.round(0.45 * n.integrity + 0.20 * n.admin + 0.20 * n.fiscal + 0.15 * n.growth);
    const efficiency = Math.round(
      0.25 * n.growth + 0.25 * n.integrity + 0.15 * n.target + 0.10 * n.coverage +
      0.10 * n.admin + 0.10 * n.fiscal + 0.05 * n.time
    );
    const stateScope = Math.round(clamp(
      0.55 * n.redist + 0.18 * n.coverage + 0.12 * n.family + 0.15 * (100 - n.econFreedom),
      0,
      100
    ));

    const taxQuota = round1(clamp(
      FAMILY.baselineTaxQuota + (n.redist - 50) * 0.18 + (50 - n.econFreedom) * 0.04,
      26.5,
      44
    ));

    const levyRate = round1(clamp(
      FAMILY.baselineLevyRate + (n.redist - 50) * 0.14 + (50 - n.admin) * 0.025 + taxMixAdjustment(cleanSelections),
      27,
      55
    ));
    const mandatoryLevies = round100(FAMILY.labourCost * levyRate / 100);
    const cashSupport = round100(clamp(
      FAMILY.baselineCashSupport + (n.redist - 50) * 95 + (n.coverage - 50) * 22 + (n.family - 50) * 16,
      0,
      10000
    ));
    const cashAfterState = FAMILY.labourCost - mandatoryLevies + cashSupport;
    const ownChoiceCash = round100(Math.max(0, cashAfterState - FAMILY.essentialPrivateCosts));

    const baselineMandatory = round100(FAMILY.labourCost * FAMILY.baselineLevyRate / 100);
    const baselineOwnChoice = FAMILY.labourCost - baselineMandatory + FAMILY.baselineCashSupport - FAMILY.essentialPrivateCosts;
    const ownCashDelta = ownChoiceCash - baselineOwnChoice;

    const consumptionRate = round1(clamp(
      15 + (taxQuota - FAMILY.baselineTaxQuota) * 0.45 + (n.redist - 50) * 0.015,
      10.5,
      20.5
    ));
    const purchasePower = round100(ownChoiceCash / (1 + consumptionRate / 100));
    const consumptionTax = ownChoiceCash - purchasePower;

    const publicServiceValue = round100(clamp(
      2500 + stateScope * 90 + (efficiency - 50) * 55 + (n.coverage - 50) * 18,
      1500,
      16500
    ));
    const stateReturn = cashSupport + publicServiceValue;
    const returnRatio = Math.round(100 * stateReturn / Math.max(mandatoryLevies, 1));
    const privateReplacement = round100(clamp(
      13000 - stateScope * 100 - (n.econFreedom - 50) * 12 - (n.coverage - 50) * 15,
      2200,
      14000
    ));
    const afterReplacement = ownChoiceCash - privateReplacement;

    const marginalWedge = round1(clamp(
      FAMILY.baselineMarginalWedge + (levyRate - FAMILY.baselineLevyRate) * 0.72 +
      (50 - n.admin) * 0.04 + transferTrapAdjustment(cleanSelections),
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

    const integrity = Math.round(
      0.50 * n.integrity + 0.20 * n.admin + 0.20 * n.fiscal + 0.10 * n.civicFreedom
    );
    const leak = leakBand(integrity);
    const deliveryRate = Math.round(clamp(
      42 + 0.34 * efficiency + 0.22 * integrity - 0.07 * stateScope,
      35,
      92
    ));
    const riskPerMillion = round100(
      1000000 * (taxQuota / 100) * 0.20 * (((leak.min + leak.max) / 2) / 100)
    );

    const richTax = richTaxIntensity(cleanSelections, n);
    const richTaxShift = (richTax - 50) / 50;
    const richTaxBase = round100(FAMILY.labourCost * 0.06 * Math.abs(richTaxShift));
    const richTaxSpilloverLow = round100(richTaxBase * 0.20);
    const richTaxSpilloverHigh = round100(richTaxBase * 0.50);
    const richTaxDirection = richTaxShift > 0.02 ? -1 : richTaxShift < -0.02 ? 1 : 0;

    const marketDynamism =
      0.32 * n.econFreedom + 0.24 * n.growth + 0.16 * n.fiscal + 0.14 * n.admin + 0.14 * (100 - n.redist);
    const publicCapital =
      0.30 * n.growth + 0.25 * integrity + 0.20 * n.admin + 0.15 * n.coverage + 0.10 * n.target;
    const incentivePenalty = Math.max(0, marginalWedge - FAMILY.baselineMarginalWedge) * 0.075;
    const scalePenalty = Math.max(0, taxQuota - FAMILY.baselineTaxQuota) * 0.07;
    const richTaxPenalty = Math.max(0, richTax - 50) * 0.035;
    const underProvisionPenalty = Math.max(0, 30 - taxQuota) * 0.08 + Math.max(0, 30 - n.coverage) * 0.025;
    const gdp10 = round1(clamp(
      (marketDynamism - 50) * 0.075 + (publicCapital - 50) * 0.035 -
      incentivePenalty - scalePenalty - richTaxPenalty - underProvisionPenalty,
      -7,
      5
    ));

    const timeHours = round1(clamp(14 + n.time * 0.10 - stateScope * 0.015 + n.admin * 0.015, 10, 24));
    const bureaucracyHours = round1(clamp(1.5 + stateScope * 0.035 + (100 - n.admin) * 0.055, 1.5, 10));
    const targetPct = Math.round(35 + n.target * 0.50);
    const coveragePct = Math.round(50 + n.coverage * 0.45);
    const freedom = Math.round(
      0.35 * n.econFreedom + 0.25 * n.civicFreedom + 0.25 * (100 - stateScope) + 0.15 * incentiveIndex
    );

    return {
      selections: cleanSelections,
      raw,
      n,
      capacity,
      efficiency,
      stateScope,
      taxQuota,
      levyRate,
      mandatoryLevies,
      cashSupport,
      cashAfterState,
      ownChoiceCash,
      baselineMandatory,
      baselineOwnChoice,
      ownCashDelta,
      consumptionRate,
      purchasePower,
      consumptionTax,
      publicServiceValue,
      stateReturn,
      returnRatio,
      privateReplacement,
      afterReplacement,
      marginalWedge,
      successKeep,
      successPurchase,
      incentiveIndex,
      integrity,
      leak,
      deliveryRate,
      riskPerMillion,
      richTax,
      richTaxBase,
      richTaxSpilloverLow,
      richTaxSpilloverHigh,
      richTaxDirection,
      gdp10,
      timeHours,
      bureaucracyHours,
      targetPct,
      coveragePct,
      freedom
    };
  }

  function leakBand(integrity) {
    if (integrity >= 80) return { label: "nízké", min: 3, max: 7 };
    if (integrity >= 65) return { label: "mírné", min: 6, max: 10 };
    if (integrity >= 50) return { label: "zvýšené", min: 9, max: 14 };
    if (integrity >= 35) return { label: "vysoké", min: 13, max: 19 };
    return { label: "velmi vysoké", min: 18, max: 25 };
  }

  window.TaxModel = Object.freeze({
    FAMILY,
    clamp,
    round1,
    round100,
    fmtCZK,
    scoreSelections,
    compute
  });
})();
