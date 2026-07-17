function renderRichTax(result) {
  const value = el("richTaxImpactValue");
  const title = el("richTaxImpactTitle");
  const text = el("richTaxImpactText");
  if (result.richTaxDirection < 0) {
    value.textContent = `−${TaxModelV4.fmtCZK(result.richTaxSpilloverLow)} až −${TaxModelV4.fmtCZK(result.richTaxSpilloverHigh)} / měs.`;
    title.textContent = "Daň na vysoké příjmy, firmy a kapitál nekončí u cílové skupiny";
    text.textContent = `Vaše volby získávají z těchto zdrojů modelově ${TaxModelV4.fmtNumber(result.richTaxRevenueBn)} mld. Kč ročně. Citlivostní scénář přenáší 20–50 % dodatečného zatížení na ostatní domácnosti přes investice, mzdy a ceny. Do hlavního výsledku je započten střed intervalu 35 %.`;
    return;
  }
  if (result.richTaxDirection > 0) {
    value.textContent = `+${TaxModelV4.fmtCZK(result.richTaxSpilloverLow)} až +${TaxModelV4.fmtCZK(result.richTaxSpilloverHigh)} / měs.`;
    title.textContent = "Nižší zdanění kapitálu vytváří investiční prostor, ale také výpadek příjmů";
    text.textContent = `Model počítá s nižším výběrem o ${TaxModelV4.fmtNumber(Math.abs(result.richTaxRevenueBn))} mld. Kč ročně. Část se může přenést do mezd a investic; současně je třeba výpadek krýt výdaji, jinou daní nebo dluhem.`;
    return;
  }
  value.textContent = "přibližně 0 Kč";
  title.textContent = "Zdanění vysokých příjmů a kapitálu je blízko výchozímu stavu";
  text.textContent = "Výběr nevytváří významný dodatečný dynamický přenos mezi kapitálem, firmami a běžnými domácnostmi.";
}

function renderServices(result) {
  el("serviceBody").innerHTML = result.serviceLines.map(line => `
    <tr>
      <th>${line.label}<small>${line.note}</small></th>
      <td>${TaxModelV4.fmtNumber(line.baseAnnual / 1e9)} mld. Kč</td>
      <td class="${line.deltaAnnual > 0 ? "bad" : line.deltaAnnual < 0 ? "good" : "neutral"}">${formatSignedBn(line.deltaAnnual / 1e9)}</td>
      <td>${TaxModelV4.fmtCZK(line.monthlyHousehold)}</td>
    </tr>`).join("");
  setMetric("serviceTotal", TaxModelV4.fmtCZK(result.publicServiceCostMonthly));
  setMetric("serviceDelta", signedMoney(result.publicServiceDeltaMonthly));
  setMetric("deliveryIndex", `${result.deliveryIndex}/100`);
  el("serviceMethodNote").textContent = `Částky jsou účetní rozpočtový náklad rozdělený mezi ${new Intl.NumberFormat("cs-CZ").format(TaxModelV4.HOUSEHOLDS)} domácností. Nejsou oceněním osobního užitku. Kvalita a dostupnost se proto zobrazují zvlášť indexem dodání ${result.deliveryIndex}/100.`;
}

function renderBookAlignment(result) {
  const aligned = questions.map((question, index) => ({ question, option: selectedOption(index) }))
    .filter(item => item.option.bookAligned);
  setMetric("bookAlignedCount", `${aligned.length} / ${questions.length}`);
  el("bookAlignedList").innerHTML = aligned.length
    ? aligned.map(item => `<li><strong>${item.question.title}</strong><span>${item.option.text}</span></li>`).join("")
    : "<li>V žádné otázce jste nezvolili variantu označenou jako veřejně popsaná teze knihy.</li>";
}

function renderSociety(result) {
  const prosperity = result.gdp10 < 0
    ? `Po deseti letech je modelový HDP na obyvatele o ${TaxModelV4.fmtNumber(Math.abs(result.gdp10))} % níže než při pokračování výchozího trendu.`
    : result.gdp10 > 0
      ? `Po deseti letech je modelový HDP na obyvatele o ${TaxModelV4.fmtNumber(result.gdp10)} % výše než při pokračování výchozího trendu.`
      : "Desetiletý scénář se od výchozího trendu téměř neliší.";
  const capital = result.capital20 < 0
    ? `Soukromá domácnost současně nevytvoří ${TaxModelV4.fmtCZK(Math.abs(result.capital20))} majetku za 20 let.`
    : result.capital20 > 0
      ? `Soukromá domácnost může vytvořit o ${TaxModelV4.fmtCZK(result.capital20)} více majetku za 20 let.`
      : "Soukromá akumulace kapitálu se téměř nemění.";
  el("societyVerdict").innerHTML = `<strong>${prosperity}</strong> ${capital} Výsledek je scénář, nikoli prognóza.`;
}

function renderStory(result) {
  const delta = result.ownCashDelta;
  const deltaText = delta < 0
    ? `o ${TaxModelV4.fmtCZK(Math.abs(delta))} méně`
    : delta > 0
      ? `o ${TaxModelV4.fmtCZK(delta)} více`
      : "přibližně stejně";
  const capitalText = result.capital20 < 0
    ? `Za dvacet let to při 6% výnosu znamená ${TaxModelV4.fmtCZK(Math.abs(result.capital20))} nevytvořeného soukromého majetku.`
    : result.capital20 > 0
      ? `Za dvacet let to při 6% výnosu znamená ${TaxModelV4.fmtCZK(result.capital20)} dodatečného soukromého majetku.`
      : "Dlouhodobý rozdíl v soukromém majetku je malý.";
  const debtText = result.deficitDeltaBn > 0
    ? `Stát však každý rok půjčuje o ${TaxModelV4.fmtNumber(result.deficitDeltaBn)} mld. Kč více než schválený rozpočet 2026. Pokud se tento rozdíl opakuje deset let, měsíční dluhová služba připadající na domácnost je o ${TaxModelV4.fmtCZK(result.futureDebtServiceDeltaMonthly)} vyšší než ve výchozím scénáři.`
    : result.deficitDeltaBn < 0
      ? `Roční potřeba půjček klesá o ${TaxModelV4.fmtNumber(Math.abs(result.deficitDeltaBn))} mld. Kč, takže budoucí úrokový účet domácnosti je nižší.`
      : "Dluhový účet se proti výchozímu rozpočtu téměř nemění.";
  el("storyText").innerHTML = `
    <p><strong>${result.profile.label}:</strong> Petr a Jana vytvářejí hodnotu práce ${TaxModelV4.fmtCZK(result.profile.labourCost)} měsíčně. Stát a povinné systémy odeberou ${TaxModelV4.fmtCZK(result.mandatoryLevies)}. Po hotovostních podporách, nezbytných výdajích a nepřímém přenosu daní rodina sama rozhoduje o ${TaxModelV4.fmtCZK(result.ownChoiceCash)} — ${deltaText} než ve výchozím stavu.</p>
    <p>${capitalText}</p>
    <p>${debtText}</p>
    <p>Na zdravotnictví, školství, vnitro, justici a dopravu připadá účetní veřejný náklad ${TaxModelV4.fmtCZK(result.publicServiceCostMonthly)} měsíčně na průměrnou domácnost. Toto číslo není hotovostní dávka ani tvrzení, že každá rodina čerpá stejnou hodnotu.</p>`;
}

function renderDetails(result) {
  const details = [
    ["Daňová kvóta", `${TaxModelV4.fmtNumber(result.taxQuota)} % HDP`],
    ["Odvod z práce", `${TaxModelV4.fmtNumber(result.labourLevyRate)} %`],
    ["Jiné daně domácnosti", TaxModelV4.fmtCZK(result.otherTaxes)],
    ["Kupní síla vlastního rozpočtu", TaxModelV4.fmtCZK(result.purchasePower)],
    ["Mezní klín", `${TaxModelV4.fmtNumber(result.marginalWedge)} %`],
    ["Majetek z hotovostního rozdílu při 6 %", formatSignedCZK(result.capital20CashOnly)],
    ["Vlastněné penzijní účty při 6 %", formatSignedCZK(result.capitalPolicy20)],
    ["Majetek celkem za 20 let při 4 %", formatSignedCZK(result.capital20At4)],
    ["Majetek celkem za 20 let při 6 %", formatSignedCZK(result.capital20)],
    ["Majetek celkem za 20 let při 8 %", formatSignedCZK(result.capital20At8)],
    ["Roční saldo", formatBalance(result.annualDeficitBn)],
    ["Změna dluhu za 10 let", `${result.debtStockDeltaVsBaseline10Bn >= 0 ? "+" : "−"}${TaxModelV4.fmtNumber(Math.abs(result.debtStockDeltaVsBaseline10Bn))} mld. Kč proti výchozímu scénáři`],
    ["Rozsah zásahu státu", `${result.stateScope}/100`],
    ["Pobídka k práci a investicím", `${result.incentiveIndex}/100`],
    ["Efektivita", `${result.efficiency}/100`],
    ["Integrita a kontrola", `${result.integrity}/100`],
    ["Riziko u exponovaných zakázek", `${result.leak.min}–${result.leak.max} %`],
    ["Riziková expozice na domácnost", `${TaxModelV4.fmtCZK(result.riskPerHouseholdMonthly)} měsíčně`],
    ["Administrativní čas", `${TaxModelV4.fmtNumber(result.bureaucracyHours)} h měsíčně`],
    ["Volný čas", `${TaxModelV4.fmtNumber(result.timeHours)} h týdně na dospělého`],
    ["HDP na obyvatele po 10 letech", `${result.gdp10 > 0 ? "+" : ""}${TaxModelV4.fmtNumber(result.gdp10)} %`]
  ];
  el("detailGrid").innerHTML = details.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("");
}

function makeSummary(result, archetype) {
  const capital = result.capital20 < 0
    ? `nevytvořený majetek ${TaxModelV4.fmtCZK(Math.abs(result.capital20))}`
    : `dodatečný majetek ${TaxModelV4.fmtCZK(result.capital20)}`;
  return `SPRAVEDLIVÝ RŮST – ÚČET DANÍ, DLUHU A KAPITÁLU\n\nProfil: ${result.profile.label} (${result.profile.shortLabel})\nTyp: ${archetype}\nStát vezme: ${TaxModelV4.fmtCZK(result.mandatoryLevies)} měsíčně\nÚčetní veřejná protihodnota: ${TaxModelV4.fmtCZK(result.stateAccountingAllocation)} měsíčně\nRodině zůstane pod vlastní kontrolou: ${TaxModelV4.fmtCZK(result.ownChoiceCash)} (${signedMoney(result.ownCashDelta)} proti výchozímu stavu)\nZ dalších 10 000 Kč výkonu zůstane: ${TaxModelV4.fmtCZK(result.successKeep)}\nZa 20 let při 6 %: ${capital}\nRoční saldo: ${formatBalance(result.annualDeficitBn)}\nDnešní dluhová služba: ${TaxModelV4.fmtCZK(result.currentDebtServiceMonthly)} na domácnost měsíčně\nDluhová služba po 10 letech v modelu: ${TaxModelV4.fmtCZK(result.futureDebtServiceMonthly)} na domácnost měsíčně\nShoda s veřejně popsanými tezemi knihy: ${result.bookAlignedCount}/15\n\nModel je transparentní scénář, nikoli osobní daňové přiznání ani jistá prognóza.`;
}

function setMetric(id, value) {
  const node = el(id);
  if (node) node.textContent = value;
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
