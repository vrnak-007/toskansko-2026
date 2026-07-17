questions.push(
{
  id:"q06",
  title:"Má stát omezit rané třídění dětí a více financovat znevýhodněné školy?",
  context:"Cílené financování a omezení rané selekce mohou rozvíjet potenciál, ale vyžadují peníze a zasahují do volby rodičů a škol.",
  book:{
    summary:"Kniha kritizuje časné rozdělování dětí a regionálně nerovnou nabídku; navrhuje podporovat znevýhodněné školy a rozvíjet potenciál dětí dříve, než se rozdíly zafixují.",
    sourceLabel:"Rozhovor k nové knize, pasáž o neefektivní selekci ve vzdělávání.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q06_book",bookAligned:true,text:"Vážit financování podle znevýhodnění, posílit školní týmy a omezit příliš rané rozdělování dětí.",note:"Cílená investice, menší selekce a vyšší dlouhodobé nároky na rozpočet.",fx:{deficitBn:10,growth10Pp:0.7,stateScope:5,servicesBn:{education:15},efficiency:4},score:S(-1,2,3,3,3,3,1,0,2,1,2,3),story:"Matějova škola dostává podporu podle potřeb dětí."},
    {id:"q06_vouchers",bookAligned:false,text:"Zavést poukázky, více soutěže škol, měření výsledků a širokou volbu rodičů.",note:"Volba a tlak na výkon, ale riziko dalšího třídění informovaností a příjmem.",fx:{deficitBn:0,growth10Pp:0.3,stateScope:-3,efficiency:3},score:S(3,-1,1,2,0,0,0,3,2,1,2,0),story:"Rodina vybírá školu aktivněji; slabší domácnosti se v nabídce hůře orientují."},
    {id:"q06_uniform",bookAligned:false,text:"Sjednotit veřejné školy, omezit výběrové programy a plošně zvýšit personální normy.",note:"Vysoká rovnost a výdaje, menší autonomie.",fx:{labourPp:0.5,deficitBn:20,growth10Pp:0.2,stateScope:9,servicesBn:{education:30}},score:S(-3,3,0,1,1,3,1,-3,1,0,-1,2),story:"Rozdíly se administrativně zmenší, ale prostor pro odlišné přístupy je užší."},
    {id:"q06_money",bookAligned:false,text:"Přidat školám plošně peníze, projekty a platy bez změny řízení a selekce.",note:"Vyšší účet bez jistoty lepšího výsledku.",fx:{deficitBn:20,growth10Pp:-0.2,stateScope:5,servicesBn:{education:20},efficiency:-5,adminHours:1.5},score:S(0,2,-1,-1,-1,1,0,0,1,-1,-2,0),story:"Rozpočet roste, ředitel však dál spravuje projekty místo školy."}
  ]
},
{
  id:"q07",
  title:"Má se školství více řídit, slučovat a měřit?",
  context:"Základní pravidla a profesionální řízení mohou snížit administrativu, ale také omezují místní autonomii.",
  book:{
    summary:"Kniha spojuje transparentní výběr ředitelů, menší roztříštěnost škol a základní pravidla spolupráce s vyšší kvalitou a menší administrativou.",
    sourceLabel:"Rozhovor k nové knize, pasáž o řízení škol a transparentním výběru ředitelů.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q07_book",bookAligned:true,text:"Profesionalizovat zřizování, transparentně vybírat ředitele, sdílet administrativu a slučovat příliš malé správní celky.",note:"Malý přímý rozpočtový náklad, očekávaná provozní úspora.",fx:{deficitBn:2,growth10Pp:0.5,stateScope:2,servicesBn:{education:3},efficiency:7,integrity:5,adminHours:-1.2},score:S(0,1,3,3,2,2,2,2,2,2,2,2),story:"Ředitel tráví méně času účetnictvím a více vedením školy."},
    {id:"q07_autonomy",bookAligned:false,text:"Dát každé škole vysokou autonomii, zveřejňovat výsledky a nechat rodiče rozhodovat odchodem.",note:"Nízký centrální účet, vyšší nároky na informovanost rodičů.",fx:{deficitBn:0,growth10Pp:0.3,stateScope:-3,efficiency:4,integrity:2},score:S(3,-2,1,2,0,-1,0,3,2,2,2,0),story:"Škola má volnost, ale kvalita více závisí na vedení a tlaku rodičů."},
    {id:"q07_central",bookAligned:false,text:"Řídit personální normy, kurikulum i provozní rozhodnutí detailně z centra.",note:"Jednotnost za cenu pomalejší reakce a vyšší administrativy.",fx:{deficitBn:5,growth10Pp:-0.1,stateScope:7,servicesBn:{education:5},efficiency:-1,adminHours:1.0},score:S(-3,2,0,1,1,2,0,-2,1,-2,0,1),story:"Pravidla jsou stejná, místní problém však čeká na centrální rozhodnutí."},
    {id:"q07_grants",bookAligned:false,text:"Ponechat roztříštěnou správu a motivovat školy množstvím soutěžních projektů a dotací.",note:"Viditelné projekty, vysoké transakční náklady a nerovnost grantových kapacit.",fx:{deficitBn:10,growth10Pp:-0.3,stateScope:5,servicesBn:{education:10},efficiency:-5,integrity:-4,adminHours:2.2},score:S(0,2,-2,-3,-1,-1,0,-1,-1,-3,-2,-1),story:"Škola s lepším projektovým poradcem získá více než škola s větší potřebou."}
  ]
},
{
  id:"q08",
  title:"Jak financovat zdravotní prevenci?",
  context:"Prevence může snížit budoucí náklady a prodloužit zdravý pracovní život, ale její výnos přichází pozdě a není zaručen.",
  book:{
    summary:"Kniha požaduje výrazně posílit zdravotní prevenci, motivace pojišťoven a lidí a měření výsledků, protože bez zdravějšího stárnutí bude systém obtížně udržitelný.",
    sourceLabel:"Rozhovor k nové knize, část o stárnutí a zdravotní prevenci.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q08_book",bookAligned:true,text:"Investovat do screeningu a prevence, odměňovat pojišťovny za výsledky a zveřejňovat kvalitu péče.",note:"Vyšší současný náklad, modelově nižší budoucí nemocnost.",fx:{deficitBn:8,growth10Pp:0.6,stateScope:4,servicesBn:{health:12},efficiency:6,timeHours:0.5},score:S(0,1,3,3,2,3,3,0,2,2,3,3),story:"Petr dostává včasnou výzvu a může porovnat kvalitu péče."},
    {id:"q08_private",bookAligned:false,text:"Rozšířit spoluúčast a soukromé připojištění; stát financuje jen základní péči.",note:"Nižší veřejný účet, vyšší přímý náklad domácnosti.",fx:{deficitBn:-15,growth10Pp:0.1,stateScope:-5,servicesBn:{health:-20},privateCostMonthly:800},score:S(3,-2,1,1,-1,-2,-1,2,1,1,3,-1),story:"Rodina platí více přímo a může odložit prevenci při napjatém rozpočtu."},
    {id:"q08_universal",bookAligned:false,text:"Rozšířit bezplatné veřejné služby a prevenci pro všechny, financované vyššími odvody.",note:"Vysoké pokrytí, slabší tlak na cílení nákladů.",fx:{labourPp:1.0,deficitBn:20,growth10Pp:0.1,stateScope:9,servicesBn:{health:40}},score:S(-3,3,1,1,0,3,2,-2,2,1,-1,2),story:"Finanční bariéra klesá, ale roste odvod a čekací kapacita zůstává omezená."},
    {id:"q08_historical",bookAligned:false,text:"Navýšit rozpočty nemocnic podle historických nákladů a počtu lůžek bez měření výsledků.",note:"Více peněz, nízká ověřitelnost přínosu.",fx:{deficitBn:25,growth10Pp:-0.3,stateScope:6,servicesBn:{health:25},efficiency:-6,integrity:-1},score:S(-1,2,-2,-2,-1,1,-1,-1,0,-2,-3,-1),story:"Nemocnice dostane více, pacient neví, zda se zlepšila péče."}
  ]
},
{
  id:"q09",
  title:"Jak má domácnost spořit na stáří?",
  context:"Veřejný průběžný systém rozděluje demografické riziko, soukromé investování zase tržní a příjmové riziko. Daňová podpora spoření má také rozpočtový účet.",
  book:{
    summary:"Kniha prosazuje reformu penzijního spoření, aby domácnosti levněji a produktivněji investovaly a získaly podíl na globálních kapitálových výnosech.",
    sourceLabel:"Rozhovor k nové knize, část o penzijním spoření a kapitálových výnosech.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q09_book",bookAligned:true,text:"Zavést levné přenosné investiční produkty, automatické přihlášení a podporu dlouhodobého diverzifikovaného spoření.",note:"Malý rozpočtový výpadek, vyšší soukromá akumulace kapitálu.",fx:{otherTaxMonthly:-300,deficitBn:5,marginalPp:-0.3,growth10Pp:0.5,stateScope:1,capitalBonusMonthly:500,privateCostMonthly:500,efficiency:2},score:S(0,1,3,3,2,2,0,1,2,1,3,2),story:"Rodina pravidelně investuje v levném produktu a vlastní větší část budoucí penze."},
    {id:"q09_private",bookAligned:false,text:"Zmenšit veřejný pilíř a přesunout větší část povinných úspor na individuální investiční účty.",note:"Vyšší vlastnictví úspor, větší tržní a kariérní riziko.",fx:{labourPp:-2.0,deficitBn:0,marginalPp:-1.5,growth10Pp:0.4,stateScope:-7,capitalBonusMonthly:1200,privateCostMonthly:1200},score:S(3,-3,1,1,-2,-2,0,3,1,1,2,0),story:"Rodina více vlastní, ale nízký příjem a propad trhu nesou přímo její účet."},
    {id:"q09_tax",bookAligned:false,text:"Zmrazit důchodový věk a vyšší budoucí výdaje financovat růstem odvodů a progresivních daní.",note:"Jistější délka penze, nižší čistá mzda a vyšší schodek.",fx:{labourPp:2.0,richTaxRevenueBn:30,deficitBn:30,marginalPp:2.5,growth10Pp:-0.6,stateScope:8},score:S(-3,3,-1,1,1,3,1,-2,1,1,-2,0),story:"Petr odchází dříve, ale vyšší odvody platí celou kariéru."},
    {id:"q09_debt",bookAligned:false,text:"Zachovat všechny dnešní sliby a chybějící peníze každoročně půjčovat.",note:"Dnes bez viditelné daně, později vyšší úroky a menší prostor pro jiné výdaje.",fx:{deficitBn:70,marginalPp:0,growth10Pp:-0.8,stateScope:5},score:S(0,2,-3,-1,-1,2,1,0,0,0,-3,-2),story:"Dávka není zaplacena dnešním odvodem, ale budoucí úrok nese každá domácnost."}
  ]
},
{
  id:"q10",
  title:"Jak prodloužit zdravý pracovní život?",
  context:"Nižší odvody ve vyšším věku mohou zvýšit zaměstnanost, ale snižují příjmy systémů. Dřívější penze dělá opak.",
  book:{
    summary:"Kniha spojuje prevenci s delším pracovním životem a navrhuje práci ve vyšším věku podporovat nižšími daněmi a odvody.",
    sourceLabel:"Rozhovor k nové knize, část o stárnutí populace.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q10_book",bookAligned:true,text:"Snížit odvody pracujícím ve vyšším věku, umožnit pružné úvazky a chránit fyzicky náročné profese.",note:"Krátkodobý výpadek příjmů, vyšší pracovní účast.",fx:{labourPp:-0.2,deficitBn:10,marginalPp:-1.5,growth10Pp:0.6,stateScope:1,timeHours:0.5},score:S(0,0,3,2,2,2,2,2,2,2,2,2),story:"Petr může později pracovat kratší úvazek a část odvodové úlevy mu zůstane."},
    {id:"q10_neutral",bookAligned:false,text:"Věk ani odvody zvlášť neměnit; nechat firmy a zaměstnance dohodnout se podle situace.",note:"Bez nového rozpočtového programu, ale bez řešení demografie.",fx:{deficitBn:0,growth10Pp:0,stateScope:-1},score:S(2,-1,0,1,0,0,0,2,1,2,1,0),story:"Pravidla zůstávají stejná a výsledek závisí na trhu práce."},
    {id:"q10_early",bookAligned:false,text:"Rozšířit předčasné důchody a náročné profese definovat široce.",note:"Více času dnes, vyšší každoroční deficit a méně pracovníků.",fx:{cashMonthly:1000,deficitBn:40,marginalPp:1.0,growth10Pp:-0.7,stateScope:7,timeHours:1.5},score:S(-3,3,-2,0,1,2,2,-2,1,0,-3,0),story:"Petr může odejít dříve, budoucí poplatník však financuje delší penzi."},
    {id:"q10_subsidy",bookAligned:false,text:"Dotovat zaměstnavatele za každého staršího pracovníka bez změny odvodů.",note:"Viditelná podpora, prostor pro čerpání i bez nové zaměstnanosti.",fx:{deficitBn:20,growth10Pp:-0.1,stateScope:5,efficiency:-3,integrity:-2,adminHours:0.8},score:S(-1,2,-1,-1,0,1,0,-1,0,-2,-2,0),story:"Firma získá dotaci, i když by Petra zaměstnala bez ní."}
  ]
},

);
