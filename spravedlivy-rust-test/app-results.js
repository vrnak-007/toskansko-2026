function analyticsOptionId(text){
  let hash=2166136261;
  for(let i=0;i<text.length;i++){
    hash^=text.charCodeAt(i);
    hash=Math.imul(hash,16777619);
  }
  return `o${(hash>>>0).toString(16).padStart(8,"0")}`;
}

function showResults(){
  const {norm:n}=calculateScores();
  const capacity=Math.round(.45*n.integrity+.20*n.admin+.20*n.fiscal+.15*n.growth);
  const efficiency=Math.round(.25*n.growth+.25*n.integrity+.15*n.target+.10*n.coverage+.10*n.admin+.10*n.fiscal+.05*n.time);
  const freedom=Math.round(.45*n.econFreedom+.55*n.civicFreedom);
  const taxQuota=round1(clamp(34+(n.redist-50)*.13,27.5,40.5));
  const productive=.35*n.growth+.25*n.integrity+.15*n.admin+.15*n.fiscal+.10*n.coverage;
  const gdp10=productive>=55?((productive-55)/45)*4.1:((productive-55)/55)*2.0;
  const familyDelta=.60*gdp10+.08*(n.family-50)+.025*(n.time-50)+.02*(n.coverage-50);
  const familyMoney=round100(34000*(1+familyDelta/100));
  const timeHours=round1(clamp(17+(-4+n.time*.11),11,25));
  const targetPct=Math.round(35+n.target*.50);
  const coveragePct=Math.round(50+n.coverage*.45);
  const integritySystem=Math.round(.50*n.integrity+.20*n.admin+.20*n.fiscal+.10*n.civicFreedom);
  const leak=leakBand(integritySystem);
  const [arch,desc]=archetypeFor(n,capacity);

  quizPanel.style.display="none";resultPanel.style.display="block";
  el("archetype").textContent=arch;el("archetypeDesc").textContent=desc;el("effSeal").textContent=efficiency;
  el("lrValue").textContent=`${n.lr}/100`;
  el("lrSub").textContent=`${lrLabel(n.lr)}; přerozdělování ${level(n.redist)} (${n.redist}/100).`;
  el("taxValue").textContent=`${String(taxQuota).replace(".",",")} % HDP`;
  el("gdpValue").textContent=pctSigned(gdp10);
  el("gdpSub").textContent="Proti pokračování současného trendu; nejistota modelu je nejméně ±2 procentní body.";
  el("timeValue").textContent=`${String(timeHours).replace(".",",")} h / týden`;
  el("targetValue").textContent=`${targetPct} %`;
  el("targetSub").textContent=`Modelový podíl nové nepensionní pomoci směrovaný potřebným; odhadované pokrytí oprávněných ${coveragePct} %.`;
  el("leakValue").textContent=`${leak.min}–${leak.max} %`;
  el("leakSub").textContent=`${leak.label.charAt(0).toUpperCase()+leak.label.slice(1)} riziko u vysoce exponovaných investic a zakázek. Z 100 mld. Kč by bylo rizikem nehospodárnosti a korupčních úniků ohroženo ${leak.min}–${leak.max} mld. Kč; nejde o procento rozpočtu ani důkaz krádeže.`;

  const barData=[
    ["Schopnost státu",capacity],
    ["Efektivita výdajů",efficiency],
    ["Integrita a kontrola",integritySystem],
    ["Ekonomická svoboda",n.econFreedom],
    ["Občanská a datová svoboda",n.civicFreedom],
    ["Přesnost sociální pomoci",n.target],
    ["Pokrytí oprávněných",n.coverage],
    ["Fiskální udržitelnost",n.fiscal]
  ];
  const bars=el("bars");bars.innerHTML="";
  barData.forEach(([label,val])=>{
    const row=document.createElement("div");row.className="bar-row";
    row.innerHTML=`<div class="bar-label">${label}</div><div class="bar-track"><div class="bar-fill" style="width:${val}%"></div></div><div class="bar-value">${val}</div>`;
    bars.appendChild(row);
  });

  el("dot").style.left=`${clamp(n.lr,3,97)}%`;
  el("dot").style.bottom=`${clamp(capacity,3,97)}%`;

  el("familyMoney").textContent=fmtCZK(familyMoney);
  el("familyTime").textContent=`${String(timeHours).replace(".",",")} h`;
  el("familyFreedom").textContent=`${freedom}/100`;

  const taxStory=selectedOption(0).story;
  const careStory=selectedOption(3).story;
  const housingStory=selectedOption(4).story;
  const schoolStory=selectedOption(5).story;
  const healthStory=selectedOption(7).story;
  const procurementStory=selectedOption(11).story;
  const digitalStory=selectedOption(12).story;
  const workStory=selectedOption(13).story;
  const crisisStory=selectedOption(14).story;
  const moneyDirection=familyDelta>=1.5?"má citelně větší finanční polštář":familyDelta<=-1.5?"má menší rezervu a častěji odkládá výdaje":"má finanční rezervu zhruba podobnou výchozímu modelu";
  const freedomText=freedom>=70?"Má vysokou možnost volby a současně silné procesní záruky.":freedom<45?"Častěji naráží na povinná pravidla nebo netransparentní rozhodování; autonomie je nízká.":"Jeho autonomie je střední: část voleb je soukromá, část přebírá veřejný systém.";
  el("storyText").innerHTML=`
    <p><strong>Modelová domácnost:</strong> Petr (41) pracuje v technické údržbě, Jana (37) na tříčtvrteční úvazek; Matějovi je deset a Elišce čtyři roky. Bydlí na hypotéku v Hvozdnici v okrese Praha-západ a oba dojíždějí. V tomto scénáři domácnost po hlavních nutných výdajích ${moneyDirection}: přibližně <strong>${fmtCZK(familyMoney)} měsíčně</strong>, s modelovou nejistotou alespoň ±2 500 Kč.</p>
    <p><strong>Práce, daně a péče:</strong> ${taxStory} ${careStory} ${workStory}</p>
    <p><strong>Bydlení, škola a zdraví:</strong> ${housingStory} ${schoolStory} ${healthStory}</p>
    <p><strong>Stát, data a krize:</strong> ${procurementStory} ${digitalStory} ${crisisStory}</p>
    <p><strong>Každodenní svoboda:</strong> ${freedomText} Ekonomická autonomie dosahuje ${n.econFreedom}/100 a občanská/datová autonomie ${n.civicFreedom}/100. Rodině zbývá modelově ${String(timeHours).replace(".",",")} hodiny volného času na jednoho dospělého týdně.</p>`;

  const all=[
    ["Růstový potenciál",n.growth,"Reformy zvyšují produktivitu práce, vzdělávání a podnikatelského prostředí."],
    ["Integrita institucí",integritySystem,"Zakázky, rozhodování a kontrola jsou relativně průhledné a vymahatelné."],
    ["Cílení pomoci",n.target,"Sociální pomoc má vysokou pravděpodobnost dopadnout k lidem s největší potřebou."],
    ["Pokrytí",n.coverage,"Oprávnění lidé se v systému méně ztrácejí."],
    ["Časová autonomie",n.time,"Práce, péče a služby jsou uspořádány tak, aby domácnostem zůstával čas."],
    ["Ekonomická svoboda",n.econFreedom,"Lidé a firmy mají relativně širokou volbu smluv, služeb a investic."],
    ["Občanská svoboda",n.civicFreedom,"Pravidla chrání soukromí, opravné prostředky a dohledatelnost moci."],
    ["Fiskální stabilita",n.fiscal,"Budoucí náklady nejsou systematicky odsouvány dluhem."],
    ["Jednoduchost",n.admin,"Systémy mají méně výjimek a transakčních nákladů."],
    ["Rodinný dopad",n.family,"Soubor politik dobře podporuje příjem, služby a odolnost modelové rodiny."]
  ];
  const top=[...all].sort((a,b)=>b[1]-a[1]).slice(0,3);
  const bottom=[...all].sort((a,b)=>a[1]-b[1]).slice(0,3);
  el("strengths").innerHTML=top.map(x=>`<li><strong>${x[0]} (${x[1]}/100):</strong> ${x[2]}</li>`).join("");
  el("risks").innerHTML=bottom.map(x=>`<li><strong>${x[0]} (${x[1]}/100):</strong> ${riskText(x[0])}</li>`).join("");

  resultPanel.dataset.summary=makeSummary({n,capacity,efficiency,freedom,taxQuota,gdp10,timeHours,targetPct,coveragePct,leak,arch,familyMoney});

  const completion={
    completedAt:new Date().toISOString(),
    archetype:arch,
    leftRight:n.lr,
    redistribution:n.redist,
    stateCapacity:capacity,
    efficiency,
    integrity:integritySystem,
    economicFreedom:n.econFreedom,
    civicFreedom:n.civicFreedom,
    targetPrecision:n.target,
    coverage:n.coverage,
    fiscal:n.fiscal,
    growthPotential:n.growth,
    timeAutonomy:n.time,
    adminSimplicity:n.admin,
    familyImpact:n.family,
    taxQuota,
    gdp10:round1(gdp10),
    familyMoney,
    freeTimeHours:timeHours,
    targetPct,
    coveragePct,
    leakMin:leak.min,
    leakMax:leak.max,
    answers:questions.map((question,index)=>{
      const option=selectedOption(index);
      return {
        questionId:`q${String(index+1).padStart(2,"0")}`,
        optionId:analyticsOptionId(option.text),
        questionTitle:question.title,
        optionLabel:option.text
      };
    })
  };
  window.__spravedlivyRustCompletion=completion;
  window.dispatchEvent(new CustomEvent("spravedlivy-rust:completed",{detail:completion}));
  resultPanel.scrollIntoView({behavior:"smooth",block:"start"});
}
function riskText(name){
  const map={
    "Růstový potenciál":"Vybrané nástroje mohou brzdit investice, pracovní účast nebo schopnost ukončovat neúčinné programy.",
    "Integrita institucí":"Roste prostor pro klientelismus, jediného uchazeče, formální kontrolu nebo nejasnou odpovědnost.",
    "Cílení pomoci":"Významná část podpory může jít lidem, kteří ji nepotřebují, nebo míjet nejchudší.",
    "Pokrytí":"Část oprávněných lidí může pomoc nezískat kvůli podmínkám, informovanosti nebo administrativě.",
    "Časová autonomie":"Vyšší přesčasy, dojíždění nebo nedostupná péče mohou vytlačit čas rodiny a odpočinku.",
    "Ekonomická svoboda":"Rozhodování domácností a firem je více nahrazováno příkazy, kvótami nebo centrálním výběrem.",
    "Občanská svoboda":"Slabší procesní záruky mohou omezit soukromí, odvolání nebo kontrolu nad rozhodováním úřadů.",
    "Fiskální stabilita":"Náklady se mohou přesouvat do dluhu, budoucích daní nebo náhlých škrtů.",
    "Jednoduchost":"Výjimky, projekty a více kontrolních stupňů zvyšují náklady a zvýhodňují dobře informované.",
    "Rodinný dopad":"Modelová středněpříjmová domácnost nese více nákladů nebo rizik, než kolik získá ve službách a jistotě."
  };return map[name];
}
function makeSummary(r){
  return `SPRAVEDLIVÝ RŮST – MŮJ MODEL ČR\n\nTyp: ${r.arch}\nLevice–pravice: ${r.n.lr}/100 (${lrLabel(r.n.lr)})\nPřerozdělování: ${r.n.redist}/100; modelová daňová kvóta ${String(r.taxQuota).replace(".",",")} % HDP\nSchopnost státu: ${r.capacity}/100\nEfektivita: ${r.efficiency}/100\nHDP na obyvatele po 10 letech proti trendu: ${pctSigned(r.gdp10)}\nEkonomická svoboda: ${r.n.econFreedom}/100\nObčanská/datová svoboda: ${r.n.civicFreedom}/100\nPomoc potřebným: ${r.targetPct} %; pokrytí oprávněných ${r.coveragePct} %\nRiziko ztrát u vysoce exponovaných zakázek: ${r.leak.min}–${r.leak.max} % (nejde o podíl rozpočtu ani důkaz krádeže)\nModelová rodina Hvozdnice: ${fmtCZK(r.familyMoney)} volných zdrojů měsíčně; ${String(r.timeHours).replace(".",",")} h volného času na dospělého týdně.\n\nVýsledek je scénářový model, nikoli prognóza nebo volební doporučení.`;
}

el("copyBtn").addEventListener("click",async()=>{
  const text=resultPanel.dataset.summary||"";
  try{await navigator.clipboard.writeText(text);}catch(e){
    const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
  }
  const t=el("toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800);
});
el("printBtn").addEventListener("click",()=>window.print());
el("restartBtn").addEventListener("click",()=>{
  selected.fill(null);current=0;resultPanel.style.display="none";introPanel.style.display="block";window.__spravedlivyRustCompletion=null;window.scrollTo({top:0,behavior:"smooth"});
});
