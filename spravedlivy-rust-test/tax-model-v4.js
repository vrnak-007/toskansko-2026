(() => {
  "use strict";

  const HOUSEHOLDS = 4_813_103;
  const CURRENT_DEBT_SERVICE_ANNUAL = 109_966_880_286;
  const CURRENT_BUDGET_DEFICIT_ANNUAL = 310_000_000_000;
  const DEBT_INTEREST_ASSUMPTION = 0.035;
  const DEBT_HORIZON_YEARS = 10;
  const CAPITAL_RETURN_ASSUMPTION = 0.06;
  const CAPITAL_HORIZON_YEARS = 20;

  const PROFILES = Object.freeze({
    median: Object.freeze({
      id: "median",
      label: "Mediánová domácnost",
      shortLabel: "60 000 Kč nákladů práce",
      labourCost: 60_000,
      essentialPrivateCosts: 30_000,
      description: "Jeden hlavní příjem přibližně na úrovni českého mzdového mediánu po započtení povinných nákladů zaměstnavatele; zaokrouhlený analytický profil."
    }),
    family: Object.freeze({
      id: "family",
      label: "Rodina se dvěma příjmy",
      shortLabel: "120 000 Kč nákladů práce",
      labourCost: 120_000,
      essentialPrivateCosts: 45_500,
      description: "Model Petra a Jany z Hvozdnice se dvěma pracovními příjmy; nejde o horní decil ani osobní daňové přiznání."
    })
  });

  const BASELINE = Object.freeze({
    labourLevyRate: 41.2,
    marginalWedge: 45.1,
    consumptionTaxRate: 15.0,
    taxQuota: 34.0
  });

  const SERVICE_BASES = Object.freeze({
    health: Object.freeze({
      label: "Zdravotnictví z veřejných zdrojů",
      annual: 596_100_000_000,
      year: 2024,
      note: "ČSÚ: zdravotní pojišťovny a ostatní veřejné zdroje."
    }),
    education: Object.freeze({
      label: "Školství, mládež a tělovýchova",
      annual: 268_659_913_381,
      year: 2026,
      note: "Schválený státní rozpočet, kapitola 333."
    }),
    security: Object.freeze({
      label: "Vnitro a justice",
      annual: 114_908_410_873 + 40_407_258_963,
      year: 2026,
      note: "Schválený státní rozpočet, kapitoly 314 a 336."
    }),
    transport: Object.freeze({
      label: "Doprava",
      annual: 129_432_433_222,
      year: 2026,
      note: "Schválený státní rozpočet, kapitola 327."
    })
  });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const round1 = value => Math.round(value * 10) / 10;
  const round100 = value => Math.round(value / 100) * 100;
  const fmtCZK = value => new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(value);
  const fmtNumber = value => new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 1 }).format(value);
  const annualToHouseholdMonth = annual => annual / HOUSEHOLDS / 12;

  function futureValueMonthly(monthlyAmount, annualRate = CAPITAL_RETURN_ASSUMPTION, years = CAPITAL_HORIZON_YEARS) {
    if (!Number.isFinite(monthlyAmount) || monthlyAmount === 0) return 0;
    const months = Math.round(years * 12);
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return monthlyAmount * months;
    return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }

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

  function aggregateEffects(selections) {
    const totals = {
      labourPp: 0,
      otherTaxMonthly: 0,
      cashMonthly: 0,
      deficitBn: 0,
      marginalPp: 0,
      growth10Pp: 0,
      stateScope: 0,
      efficiency: 0,
      integrity: 0,
      adminHours: 0,
      timeHours: 0,
      privateCostMonthly: 0,
      capitalBonusMonthly: 0,
      richTaxRevenueBn: 0,
      consumptionPp: 0,
      servicesBn: { health: 0, education: 0, security: 0, transport: 0 }
    };

    questions.forEach((question, index) => {
      const selectedIndex = selections[index];
      if (!Number.isInteger(selectedIndex) || !question.options[selectedIndex]) return;
      const fx = question.options[selectedIndex].fx || {};
      Object.keys(totals).forEach(key => {
        if (key === "servicesBn") return;
        totals[key] += Number(fx[key] || 0);
      });
      Object.keys(totals.servicesBn).forEach(key => {
        totals.servicesBn[key] += Number(fx.servicesBn?.[key] || 0);
      });
    });
    return totals;
  }

  function normalizeSelections(selections) {
    return Array.from({ length: questions.length }, (_, index) => {
      const value = selections?.[index];
      return Number.isInteger(value) && questions[index]?.options[value] ? value : null;
    });
  }

  function leakBand(integrity) {
    if (integrity >= 80) return { label: "nízké", min: 3, max: 7 };
    if (integrity >= 65) return { label: "mírné", min: 6, max: 10 };
    if (integrity >= 50) return { label: "zvýšené", min: 9, max: 14 };
    if (integrity >= 35) return { label: "vysoké", min: 13, max: 19 };
    return { label: "velmi vysoké", min: 18, max: 25 };
  }

  function computeBaseline(profile) {
    const labourLevies = round100(profile.labourCost * BASELINE.labourLevyRate / 100);
    const ownChoiceCashDirect = round100(profile.labourCost - labourLevies - profile.essentialPrivateCosts);
    const consumptionRate = BASELINE.consumptionTaxRate;
    return {
      labourLevies,
      mandatoryLevies: labourLevies,
      ownChoiceCashDirect,
      ownChoiceCash: ownChoiceCashDirect,
      marginalWedge: BASELINE.marginalWedge,
      successKeep: round100(10_000 * (1 - BASELINE.marginalWedge / 100)),
      purchasePower: round100(ownChoiceCashDirect / (1 + consumptionRate / 100)),
      consumptionRate,
      annualDeficitBn: CURRENT_BUDGET_DEFICIT_ANNUAL / 1e9,
      deficitDeltaBn: 0,
      currentDebtServiceMonthly: annualToHouseholdMonth(CURRENT_DEBT_SERVICE_ANNUAL),
      futureDebtServiceMonthly: annualToHouseholdMonth(
        CURRENT_DEBT_SERVICE_ANNUAL + CURRENT_BUDGET_DEFICIT_ANNUAL * DEBT_HORIZON_YEARS * DEBT_INTEREST_ASSUMPTION
      )
    };
  }

  function compute(selections, profileId = "family") {
    const profile = PROFILES[profileId] || PROFILES.family;
    const cleanSelections = normalizeSelections(selections);
    const { raw, norm: n } = scoreSelections(cleanSelections);
    const fx = aggregateEffects(cleanSelections);
    const baseline = computeBaseline(profile);

    const labourLevyRate = round1(clamp(BASELINE.labourLevyRate + fx.labourPp, 24, 58));
    const labourLevies = round100(profile.labourCost * labourLevyRate / 100);
    const otherTaxes = round100(fx.otherTaxMonthly);
    const mandatoryLevies = round100(Math.max(0, labourLevies + otherTaxes));
    const cashSupport = round100(fx.cashMonthly);
    const privatePolicyCosts = round100(Math.max(0, fx.privateCostMonthly));
    const cashAfterState = round100(profile.labourCost - mandatoryLevies + cashSupport);
    const ownChoiceCashDirect = round100(cashAfterState - profile.essentialPrivateCosts - privatePolicyCosts);

    const richTaxRevenueBn = round1(fx.richTaxRevenueBn);
    const richTaxHouseholdBase = annualToHouseholdMonth(Math.abs(richTaxRevenueBn) * 1e9);
    const richTaxSpilloverLow = round100(richTaxHouseholdBase * 0.20);
    const richTaxSpilloverHigh = round100(richTaxHouseholdBase * 0.50);
    const richTaxSpilloverMid = round100(richTaxHouseholdBase * 0.35);
    const richTaxDirection = richTaxRevenueBn > 0.5 ? -1 : richTaxRevenueBn < -0.5 ? 1 : 0;
    const richTaxAdjustment = richTaxDirection * richTaxSpilloverMid;
    const ownChoiceCash = round100(ownChoiceCashDirect + richTaxAdjustment);
    const ownCashDelta = round100(ownChoiceCash - baseline.ownChoiceCash);

    const taxQuota = round1(clamp(
      BASELINE.taxQuota + 0.11 * (n.redist - 50) + 0.025 * (50 - n.econFreedom) + richTaxRevenueBn / 45,
      25,
      47
    ));
    const consumptionRate = round1(clamp(
      BASELINE.consumptionTaxRate + 0.35 * (taxQuota - BASELINE.taxQuota) + fx.consumptionPp,
      9,
      23
    ));
    const purchasePower = round100(ownChoiceCash / (1 + consumptionRate / 100));
    const consumptionTax = round100(ownChoiceCash - purchasePower);

    const marginalWedge = round1(clamp(
      BASELINE.marginalWedge + fx.marginalPp + 0.55 * fx.labourPp + 0.025 * (50 - n.admin),
      20,
      75
    ));
    const successKeep = round100(10_000 * (1 - marginalWedge / 100));
    const successPurchase = round100(successKeep / (1 + consumptionRate / 100));

    const serviceLines = Object.entries(SERVICE_BASES).map(([key, base]) => {
      const deltaAnnual = fx.servicesBn[key] * 1e9;
      const annual = Math.max(0, base.annual + deltaAnnual);
      return {
        key,
        label: base.label,
        year: base.year,
        note: base.note,
        baseAnnual: base.annual,
        deltaAnnual,
        annual,
        baseMonthlyHousehold: annualToHouseholdMonth(base.annual),
        monthlyHousehold: annualToHouseholdMonth(annual)
      };
    });
    const publicServiceCostMonthly = round100(serviceLines.reduce((sum, line) => sum + line.monthlyHousehold, 0));
    const basePublicServiceCostMonthly = round100(serviceLines.reduce((sum, line) => sum + line.baseMonthlyHousehold, 0));
    const publicServiceDeltaMonthly = round100(publicServiceCostMonthly - basePublicServiceCostMonthly);
    const stateAccountingAllocation = round100(cashSupport + publicServiceCostMonthly);
    const deliveryIndex = Math.round(clamp(
      55 + fx.efficiency + 0.20 * (n.integrity - 50) + 0.15 * (n.admin - 50),
      20,
      95
    ));
    const privateReplacement = round100(Math.max(0, fx.privateCostMonthly));

    const annualDeficitBn = round1(CURRENT_BUDGET_DEFICIT_ANNUAL / 1e9 + fx.deficitBn);
    const deficitDeltaBn = round1(fx.deficitBn);
    const currentBorrowingMonthly = annualToHouseholdMonth(CURRENT_BUDGET_DEFICIT_ANNUAL);
    const modelBorrowingMonthly = annualToHouseholdMonth(annualDeficitBn * 1e9);
    const deficitDeltaMonthly = annualToHouseholdMonth(deficitDeltaBn * 1e9);
    const currentDebtServiceMonthly = annualToHouseholdMonth(CURRENT_DEBT_SERVICE_ANNUAL);
    const baselineFutureDebtServiceMonthly = annualToHouseholdMonth(
      CURRENT_DEBT_SERVICE_ANNUAL + CURRENT_BUDGET_DEFICIT_ANNUAL * DEBT_HORIZON_YEARS * DEBT_INTEREST_ASSUMPTION
    );
    const futureDebtServiceAnnual = Math.max(0,
      CURRENT_DEBT_SERVICE_ANNUAL + annualDeficitBn * 1e9 * DEBT_HORIZON_YEARS * DEBT_INTEREST_ASSUMPTION
    );
    const futureDebtServiceMonthly = annualToHouseholdMonth(futureDebtServiceAnnual);
    const futureDebtServiceDeltaMonthly = futureDebtServiceMonthly - baselineFutureDebtServiceMonthly;
    const debtStockChange10Bn = round1(annualDeficitBn * DEBT_HORIZON_YEARS);
    const debtStockDeltaVsBaseline10Bn = round1(deficitDeltaBn * DEBT_HORIZON_YEARS);

    const capitalMonthlyCashDifference = ownCashDelta;
    const capitalMonthlyOwnedAccount = fx.capitalBonusMonthly;
    const capital20CashOnly = round100(futureValueMonthly(capitalMonthlyCashDifference));
    const capitalPolicy20 = round100(futureValueMonthly(capitalMonthlyOwnedAccount));
    const capital20 = round100(capital20CashOnly + capitalPolicy20);
    const capital20At4 = round100(
      futureValueMonthly(capitalMonthlyCashDifference, 0.04) + futureValueMonthly(capitalMonthlyOwnedAccount, 0.04)
    );
    const capital20At8 = round100(
      futureValueMonthly(capitalMonthlyCashDifference, 0.08) + futureValueMonthly(capitalMonthlyOwnedAccount, 0.08)
    );

    const stateScope = Math.round(clamp(
      50 + fx.stateScope + 0.22 * (n.redist - 50) + 0.12 * (50 - n.econFreedom),
      0,
      100
    ));
    const efficiency = Math.round(clamp(50 + fx.efficiency + 0.25 * (n.admin - 50) + 0.15 * (n.growth - 50), 0, 100));
    const integrity = Math.round(clamp(55 + fx.integrity + 0.30 * (n.integrity - 50) + 0.10 * (n.civicFreedom - 50), 0, 100));
    const incentiveIndex = Math.round(clamp(
      50 + 0.45 * (BASELINE.marginalWedge - marginalWedge) + 0.25 * (n.econFreedom - 50) + 0.15 * (n.growth - 50),
      0,
      100
    ));
    const leak = leakBand(integrity);
    const exposedPublicFlowMonthly = annualToHouseholdMonth(Math.max(0, taxQuota / BASELINE.taxQuota) * 0.20 * CURRENT_BUDGET_DEFICIT_ANNUAL);
    const riskPerHouseholdMonthly = round100(exposedPublicFlowMonthly * ((leak.min + leak.max) / 2) / 100);

    const deficitPenalty = Math.max(0, annualDeficitBn - CURRENT_BUDGET_DEFICIT_ANNUAL / 1e9) * 0.004;
    const gdp10 = round1(clamp(
      0.55 * fx.growth10Pp + 0.018 * (n.growth - 50) + 0.010 * (n.econFreedom - 50) +
      0.007 * (deliveryIndex - 55) - deficitPenalty,
      -7,
      6
    ));
    const timeHours = round1(clamp(15 + fx.timeHours + 0.03 * (n.time - 50), 8, 28));
    const bureaucracyHours = round1(clamp(3.5 + fx.adminHours + 0.035 * (50 - n.admin), 0.5, 14));
    const targetPct = Math.round(clamp(35 + n.target * 0.50, 0, 100));
    const coveragePct = Math.round(clamp(50 + n.coverage * 0.45, 0, 100));
    const bookAlignedCount = cleanSelections.reduce((count, selectedIndex, index) =>
      count + (Number.isInteger(selectedIndex) && questions[index].options[selectedIndex]?.bookAligned ? 1 : 0), 0);

    return {
      profile,
      selections: cleanSelections,
      raw,
      n,
      fx,
      baseline,
      labourLevyRate,
      labourLevies,
      otherTaxes,
      mandatoryLevies,
      cashSupport,
      privatePolicyCosts,
      cashAfterState,
      ownChoiceCashDirect,
      ownChoiceCash,
      ownCashDelta,
      taxQuota,
      consumptionRate,
      purchasePower,
      consumptionTax,
      marginalWedge,
      successKeep,
      successPurchase,
      richTaxRevenueBn,
      richTaxSpilloverLow,
      richTaxSpilloverHigh,
      richTaxSpilloverMid,
      richTaxDirection,
      richTaxAdjustment,
      serviceLines,
      publicServiceCostMonthly,
      basePublicServiceCostMonthly,
      publicServiceDeltaMonthly,
      stateAccountingAllocation,
      deliveryIndex,
      privateReplacement,
      annualDeficitBn,
      deficitDeltaBn,
      currentBorrowingMonthly,
      modelBorrowingMonthly,
      deficitDeltaMonthly,
      currentDebtServiceMonthly,
      baselineFutureDebtServiceMonthly,
      futureDebtServiceMonthly,
      futureDebtServiceDeltaMonthly,
      debtStockChange10Bn,
      debtStockDeltaVsBaseline10Bn,
      capitalMonthlyCashDifference,
      capitalMonthlyOwnedAccount,
      capital20CashOnly,
      capital20,
      capital20At4,
      capital20At8,
      capitalPolicy20,
      stateScope,
      efficiency,
      integrity,
      incentiveIndex,
      leak,
      riskPerHouseholdMonthly,
      gdp10,
      timeHours,
      bureaucracyHours,
      targetPct,
      coveragePct,
      bookAlignedCount
    };
  }

  window.TaxModelV4 = Object.freeze({
    HOUSEHOLDS,
    CURRENT_DEBT_SERVICE_ANNUAL,
    CURRENT_BUDGET_DEFICIT_ANNUAL,
    DEBT_INTEREST_ASSUMPTION,
    DEBT_HORIZON_YEARS,
    CAPITAL_RETURN_ASSUMPTION,
    CAPITAL_HORIZON_YEARS,
    PROFILES,
    BASELINE,
    SERVICE_BASES,
    clamp,
    round1,
    round100,
    fmtCZK,
    fmtNumber,
    annualToHouseholdMonth,
    futureValueMonthly,
    scoreSelections,
    compute
  });
})();
