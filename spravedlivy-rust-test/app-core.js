let current = 0;
const selected = Array(questions.length).fill(null);

const el = id => document.getElementById(id);
const introPanel = el("introPanel"), quizPanel = el("quizPanel"), resultPanel = el("resultPanel");

el("startBtn").addEventListener("click",()=>{
  introPanel.style.display="none";
  quizPanel.style.display="block";
  renderQuestion();
  quizPanel.scrollIntoView({behavior:"smooth",block:"start"});
});

function renderQuestion(){
  const q=questions[current];
  el("questionNumber").textContent=`Rozhodnutí ${current+1}`;
  el("questionTitle").textContent=q.title;
  el("questionContext").textContent=q.context;
  el("progressText").textContent=`Otázka ${current+1} z ${questions.length}`;
  el("answeredText").textContent=`${selected.filter(v=>v!==null).length} / ${questions.length} zodpovězeno`;
  el("progressFill").style.width=`${((current+1)/questions.length)*100}%`;
  el("backBtn").disabled=current===0;
  el("nextBtn").textContent=current===questions.length-1?"Vyhodnotit":"Další otázka";
  el("errorBox").style.display="none";
  const wrap=el("answers");wrap.innerHTML="";
  q.options.forEach((opt,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="answer"+(selected[current]===i?" selected":"");
    b.setAttribute("aria-pressed",selected[current]===i?"true":"false");
    b.innerHTML=`<span class="answer-letter">${String.fromCharCode(65+i)}</span><span><strong>${opt.text}</strong><small>${opt.note}</small></span>`;
    b.addEventListener("click",()=>{selected[current]=i;renderQuestion();});
    wrap.appendChild(b);
  });
}

el("backBtn").addEventListener("click",()=>{if(current>0){current--;renderQuestion();quizPanel.scrollIntoView({behavior:"smooth",block:"start"});}});
el("nextBtn").addEventListener("click",()=>{
  if(selected[current]===null){el("errorBox").style.display="block";return;}
  if(current<questions.length-1){current++;renderQuestion();quizPanel.scrollIntoView({behavior:"smooth",block:"start"});}
  else showResults();
});

function dimBounds(dim){
  let min=0,max=0;
  questions.forEach(q=>{
    const vals=q.options.map(o=>o.score[dim]??0);
    min+=Math.min(...vals);max+=Math.max(...vals);
  });
  return {min,max};
}
function calculateScores(){
  const raw=Object.fromEntries(DIMS.map(d=>[d,0]));
  questions.forEach((q,i)=>{
    const sc=q.options[selected[i]].score;
    DIMS.forEach(d=>raw[d]+=sc[d]??0);
  });
  const norm={};
  DIMS.forEach(d=>{
    const {min,max}=dimBounds(d);
    norm[d]=Math.round(((raw[d]-min)/(max-min))*100);
  });
  return {raw,norm};
}
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const round1=v=>Math.round(v*10)/10;
const round100=v=>Math.round(v/100)*100;
const pctSigned=v=>`${v>0?"+":""}${String(round1(v)).replace(".",",")} %`;
const fmtCZK=v=>new Intl.NumberFormat("cs-CZ",{style:"currency",currency:"CZK",maximumFractionDigits:0}).format(v);

function lrLabel(v){
  if(v<20)return "výrazná ekonomická levice";
  if(v<40)return "středolevice";
  if(v<=60)return "ekonomický střed";
  if(v<=80)return "středopravice";
  return "výrazná ekonomická pravice";
}
function level(v){return v>=80?"velmi vysoká":v>=65?"vysoká":v>=45?"střední":v>=30?"nízká":"velmi nízká";}
function archetypeFor(n,capacity){
  if(capacity<40 && n.redist>58) return ["Přerozdělující patronážní stát","Chcete široké zásahy a transfery, ale zvolené kontrolní a správní mechanismy nedokážou spolehlivě převést peníze do výsledků. Velikost státu zde převyšuje jeho schopnost." ];
  if(capacity<40 && n.redist<=58) return ["Levný, ale slabý stát","Stát vybírá a dělá méně, současně však postrádá část pojistek soutěže, dat a odpovědnosti. Nízké náklady samy nezaručují nízkou korupci ani dobrou ochranu práv." ];
  if(n.lr<35 && capacity>=65) return ["Sociálně-investiční stát","Vyšší solidaritu spojujete s investicemi do schopností lidí, prevencí a relativně silnými institucemi. Úspěch stojí na udržení fiskální disciplíny a na tom, aby univerzální programy nebyly příliš drahé." ];
  if(n.lr<35) return ["Solidární stát s těžkým provozem","Preferujete široké veřejné garance, ale část zvolených nástrojů je plošná, administrativně náročná nebo málo vyhodnocovaná. Společnost je chráněnější, ale růst a dlouhodobé financování jsou křehčí." ];
  if(n.lr>65 && capacity>=65) return ["Tržně-institucionální stát","Preferujete soutěž, osobní volbu a menší přerozdělování, současně však trváte na otevřených pravidlech, kvalitním dohledu a dlouhodobé stabilitě. Rizikem je nedostatečné pokrytí lidí se slabou vyjednávací pozicí." ];
  if(n.lr>65) return ["Nízkodaňový stát se slabými pojistkami","Dáváte přednost trhu a nízkým povinným výdajům, ale některé zvolené mechanismy oslabují dohled, dostupnost služeb nebo odolnost v krizi. Soukromá svoboda roste hlavně lidem s kapitálem a rezervou." ];
  if(capacity>=65) return ["Reformní střed: spravedlivý růst","Kombinujete trh, cílenou solidaritu a institucionální reformy. Neusilujete automaticky o velký ani malý stát, ale o změnu daňového mixu, investice do schopností lidí a měřitelné veřejné služby." ];
  return ["Smíšený kompromisní stát","Vaše volby kombinují levé i pravé nástroje. Část problémů řešíte systémově, část plošně nebo ad hoc; výsledkem je politicky průchodný kompromis, ale také vyšší složitost a méně jasná odpovědnost." ];
}
function leakBand(integritySystem){
  if(integritySystem>=80)return {label:"nízké",min:3,max:7};
  if(integritySystem>=65)return {label:"mírné",min:6,max:10};
  if(integritySystem>=50)return {label:"zvýšené",min:9,max:14};
  if(integritySystem>=35)return {label:"vysoké",min:13,max:19};
  return {label:"velmi vysoké",min:18,max:25};
}
function selectedOption(i){return questions[i].options[selected[i]];}
