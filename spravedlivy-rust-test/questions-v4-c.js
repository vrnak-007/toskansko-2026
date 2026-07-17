questions.push(
{
  id:"q11",
  title:"Jak využít kvalifikaci migrantů a jejich dětí?",
  context:"Rychlejší uznávání kvalifikací a jazyková podpora stojí peníze, ale mohou zvýšit zaměstnanost a daňové příjmy.",
  book:{
    summary:"Kniha považuje migraci za součást reakce na stárnutí a žádá lepší začlenění cizinců na trh práce, aby nepracovali hluboko pod svou kvalifikací, a podporu jejich dětí ve školách.",
    sourceLabel:"Rozhovor k nové knize, část o demografii a migraci.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q11_book",bookAligned:true,text:"Zrychlit uznávání kvalifikací, investovat do jazyka, pracovního poradenství a podpory dětí ve školách.",note:"Náklad na integraci, modelově vyšší zaměstnanost a produktivita.",fx:{deficitBn:5,growth10Pp:0.6,stateScope:3,servicesBn:{education:5},efficiency:3},score:S(-1,1,3,2,2,2,1,1,2,2,2,2),story:"Kvalifikovaný člověk nastoupí do odpovídající práce a odvádí více daní."},
    {id:"q11_market",bookAligned:false,text:"Umožnit rychlá pracovní víza a výběr zaměstnavateli, veřejné integrační programy držet minimální.",note:"Nízký veřejný účet, vyšší závislost na firmě a soukromé adaptaci.",fx:{deficitBn:0,growth10Pp:0.4,stateScope:-4,servicesBn:{education:-2}},score:S(3,-2,2,1,-1,-1,0,3,1,2,2,1),story:"Firma obsadí místo rychle, integraci rodiny řeší převážně soukromě."},
    {id:"q11_central",bookAligned:false,text:"Stanovit centrální kvóty, rozsáhlé veřejné programy a regionální přidělování pracovníků.",note:"Vyšší řízení a náklady, menší volba pracovníka i firmy.",fx:{deficitBn:20,growth10Pp:0.1,stateScope:8,servicesBn:{education:10},efficiency:-1},score:S(-3,3,0,1,1,2,0,-3,1,-1,-1,1),story:"Stát určuje místo a program, ale ne vždy trefí potřebu firmy či rodiny."},
    {id:"q11_restrict",bookAligned:false,text:"Migraci výrazně omezit i za cenu nedostatku pracovníků a pomalejšího růstu.",note:"Nižší integrační výdaje, menší pracovní základna.",fx:{deficitBn:-5,growth10Pp:-0.8,stateScope:2,servicesBn:{education:-5}},score:S(2,-1,-3,0,-1,-2,0,1,0,1,0,-1),story:"Stát ušetří na integraci, firmy však omezují výrobu kvůli lidem."}
  ]
},
{
  id:"q12",
  title:"Jak motivovat obce a regiony k bydlení, službám a podnikání?",
  context:"Stabilní podíl na daních dává obci pobídku, projektové dotace zase umožňují centrální priority, ale stojí administrativu a lobbying.",
  book:{
    summary:"Kniha kritizuje, že obce mají malý prospěch z nové výstavby a podnikání, a prosazuje změnu stabilních fiskálních pobídek i spolupráci v regionech.",
    sourceLabel:"Rozhovor k nové knize, pasáže o obcích, výstavbě a regionálním rozvoji.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q12_book",bookAligned:true,text:"Změnit rozpočtové určení daní tak, aby obce získaly z nové výstavby a pracovních míst, a financovat společné služby podle dat.",note:"Přesun peněz k obcím, infrastruktura a menší závislost na grantových soutěžích.",fx:{deficitBn:5,growth10Pp:0.6,stateScope:2,servicesBn:{transport:15},efficiency:5,integrity:4,adminHours:-0.7},score:S(0,1,3,3,2,2,2,2,2,2,2,2),story:"Hvozdnice má předvídatelný příjem na vodu, školku a dopravu."},
    {id:"q12_local",bookAligned:false,text:"Dát obcím širokou daňovou autonomii a výrazně omezit vyrovnávání mezi regiony.",note:"Vysoká místní odpovědnost, větší rozdíly ve službách.",fx:{otherTaxMonthly:300,deficitBn:-5,growth10Pp:0.2,stateScope:-4,servicesBn:{transport:-5}},score:S(3,-3,1,1,-2,-2,0,3,2,1,3,0),story:"Obec rozhoduje svobodněji, ale chudší region má slabší daňovou základnu."},
    {id:"q12_central",bookAligned:false,text:"Centrálně garantovat stejný standard a investiční priority v celé zemi.",note:"Menší regionální rozdíly, vyšší národní účet a slabší místní volba.",fx:{deficitBn:25,growth10Pp:0,stateScope:8,servicesBn:{transport:20},efficiency:0},score:S(-3,3,0,1,2,2,1,-2,1,-1,0,1),story:"Hvozdnice dostane standard, ale čeká na centrální pořadník."},
    {id:"q12_grants",bookAligned:false,text:"Rozdělovat více jednotlivých dotací podle projektů a aktuálních politických priorit.",note:"Viditelné projekty, vysoká administrativní a klientelistická expozice.",fx:{deficitBn:20,growth10Pp:-0.4,stateScope:6,servicesBn:{transport:15},efficiency:-5,integrity:-6,adminHours:2.0},score:S(0,2,-2,-3,-1,-1,0,-1,-1,-3,-2,-1),story:"Starosta investuje do žádostí a kontaktů místo dlouhodobého plánování."}
  ]
},
{
  id:"q13",
  title:"Má Česko více danit kapitálové zisky, investiční majetek a vysokopříjmové OSVČ?",
  context:"Uzavření výjimek může financovat nižší zdanění práce. Zároveň může změnit umístění kapitálu, právní formu práce a investiční chování.",
  book:{
    summary:"Kniha označuje výjimky u kapitálových příjmů, investičních nemovitostí a vysokopříjmových OSVČ za hlavní daňové díry a chce jejich část uzavřít.",
    sourceLabel:"Rozhovor k nové knize a veřejný projekt Chytřejší daně.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q13_book",bookAligned:true,text:"Uzavřít vybrané výjimky u kapitálových zisků, investičních nemovitostí a vysokopříjmových OSVČ a výnos použít na snížení daní zaměstnancům.",note:"Silný přesun daňové zátěže; rozpočet téměř neutrální.",fx:{labourPp:-0.6,otherTaxMonthly:700,richTaxRevenueBn:90,deficitBn:-10,marginalPp:-1.0,growth10Pp:0.3,stateScope:3,efficiency:2},score:S(-1,1,2,2,1,1,0,0,1,2,3,2),story:"Petr platí méně z práce, investor a vysokopříjmový kontraktor více."},
    {id:"q13_low",bookAligned:false,text:"Ponechat kapitálové výjimky a dále snížit daně z firem, investic a vysokých příjmů bez okamžitých škrtů.",note:"Vyšší návratnost kapitálu, ale velký nový schodek.",fx:{labourPp:-1.0,otherTaxMonthly:-500,richTaxRevenueBn:-50,deficitBn:70,marginalPp:-1.5,growth10Pp:0.4,stateScope:-4},score:S(3,-3,2,1,-1,-1,0,3,1,2,0,1),story:"Kapitál zůstává více soukromý, úroky z výpadku však platí budoucí rozpočet."},
    {id:"q13_heavy",bookAligned:false,text:"Zavést širokou daň z bohatství a dědictví, vysokou progresi kapitálu a výnos rozdělit univerzálně.",note:"Velké přerozdělení a nejvyšší riziko přesunu kapitálu.",fx:{cashMonthly:2000,otherTaxMonthly:300,richTaxRevenueBn:150,deficitBn:-20,marginalPp:5.0,growth10Pp:-1.0,stateScope:12},score:S(-3,3,-2,1,0,3,0,-3,1,0,1,1),story:"Rodina dostane transfer, ale investiční aktivita a výnosy reagují na vysoké sazby."},
    {id:"q13_status",bookAligned:false,text:"Zachovat dnešní mix výjimek a kompenzovat výpadky vyšším skrytým zdaněním zaměstnanecké práce.",note:"Status quo pro kapitál, vyšší účet práce.",fx:{labourPp:1.5,richTaxRevenueBn:-10,deficitBn:10,marginalPp:1.5,growth10Pp:-0.3,stateScope:1,efficiency:-2},score:S(0,0,-1,-1,-1,0,0,0,0,-1,-1,-1),story:"Kapitálové výjimky zůstávají, zaměstnanci drží větší část daňového základu."}
  ]
},
{
  id:"q14",
  title:"Jak podpořit firemní investice a produktivitu?",
  context:"Daňový odpis nebo kredit snižuje příjem rozpočtu, ale může zvýšit investice. Dotace navíc přidávají výběr vítězů a klientelistické riziko.",
  book:{
    summary:"Daňová část knihy a navazující projekt Chytřejší daně spojují uzavírání neefektivních výjimek s podporou firemních investic, odpisů a produktivnějšího daňového mixu.",
    sourceLabel:"Rozhovor k nové knize; veřejně popsané analýzy firemních odpisů a investic.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q14_book",bookAligned:true,text:"Zjednodušit regulaci a zavést transparentní investiční odpis či kredit s pravidelným vyhodnocením.",note:"Rozpočtový výpadek je omezen podmínkou skutečné investice.",fx:{richTaxRevenueBn:-20,deficitBn:15,marginalPp:-0.5,growth10Pp:0.8,stateScope:0,efficiency:5,integrity:4},score:S(1,0,3,3,1,1,1,2,2,3,3,2),story:"Firma získá úlevu jen za doloženou investici a výsledek se vyhodnocuje."},
    {id:"q14_cut",bookAligned:false,text:"Plošně snížit daň firem bez podmínek a nové výpadky dočasně financovat dluhem.",note:"Jednoduché, ale úleva není vázána na investici.",fx:{richTaxRevenueBn:-80,deficitBn:60,marginalPp:-1.0,growth10Pp:0.5,stateScope:-4},score:S(3,-2,1,1,-1,-1,0,3,1,3,0,1),story:"Firma má vyšší zisk; zda investuje, závisí na konkurenci a poptávce."},
    {id:"q14_champions",bookAligned:false,text:"Vybrat národní šampiony a dát jim kapitál, dotace, zakázky a ochranu.",note:"Velký účet a koncentrace politického rozhodování.",fx:{deficitBn:50,growth10Pp:-0.2,stateScope:10,efficiency:-4,integrity:-7,servicesBn:{transport:5}},score:S(-3,3,0,-1,-1,0,0,-3,0,-1,-1,0),story:"Úspěch firmy závisí na zařazení do státní strategie."},
    {id:"q14_neutral",bookAligned:false,text:"Nedávat dotace ani daňové úlevy; držet stabilní obecnou sazbu a soutěžní prostředí.",note:"Bez selektivního nákladu, menší cílená podpora výzkumu.",fx:{deficitBn:-5,growth10Pp:0.3,stateScope:-3,efficiency:2,integrity:3},score:S(2,-1,2,2,0,0,0,2,2,2,2,1),story:"Firma investuje jen tehdy, když projekt obstojí bez veřejné podpory."}
  ]
},
{
  id:"q15",
  title:"Jak financovat nové veřejné sliby a daňové úlevy?",
  context:"Schválený státní rozpočet na rok 2026 je deficitní. Každý další trvalý výdaj nebo nekrytá daňová úleva zvyšují budoucí úrokový účet.",
  book:{
    summary:"Kniha se podle autora věnuje dluhové spirále i daňovým dírám. Polemická otázka testuje, zda se reformy skutečně zaplatí, nebo pouze odloží účet.",
    sourceLabel:"Rozhovor k nové knize, pasáž o rozpočtové legislativě, dluhu a daňových dírách.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q15_rule",bookAligned:true,text:"Reformy popsané v knize financovat uzavřením výjimek, novými stabilními příjmy a rušením neúčinných výdajů; žádný trvalý slib nenechat bez krytí.",note:"Tvrdé rozpočtové omezení; méně prostoru pro rychlé politické sliby.",fx:{deficitBn:-50,growth10Pp:0.5,stateScope:-1,efficiency:5,integrity:4},score:S(1,-1,3,3,2,1,0,1,2,3,3,2),story:"Nová dávka má na stejné stránce uvedeno, kdo ji zaplatí."},
    {id:"q15_socialdebt",bookAligned:false,text:"Rozšířit dávky a veřejné služby nyní a financovat je deset let novým dluhem.",note:"Dnešní příjemci nevidí plnou cenu; úrokový účet platí všechny domácnosti.",fx:{cashMonthly:1500,deficitBn:100,marginalPp:0.5,growth10Pp:-0.8,stateScope:10,servicesBn:{health:10,education:10}},score:S(-3,3,-2,0,1,3,1,-2,1,0,-3,1),story:"Tuhle dávku jste si nepůjčili vy, ale splácíte ji vy."},
    {id:"q15_taxdebt",bookAligned:false,text:"Snížit daně bez odpovídajících škrtů a výpadek deset let financovat dluhem.",note:"Více hotovosti dnes, rostoucí úroková služba zítra.",fx:{labourPp:-2.0,richTaxRevenueBn:-30,deficitBn:100,marginalPp:-1.5,growth10Pp:-0.2,stateScope:-4},score:S(3,-3,0,1,-1,-1,0,3,1,2,-3,1),story:"Rodina dnes ušetří na dani, ale veřejný dluh roste stejným tempem."},
    {id:"q15_repay",bookAligned:false,text:"Snížit transfery, dotace i část veřejných služeb a použít úsporu na rychlejší snižování dluhu.",note:"Nižší úroky později, viditelné omezení služeb dnes.",fx:{cashMonthly:-800,deficitBn:-100,growth10Pp:0.1,stateScope:-10,servicesBn:{health:-5,education:-5,transport:-5,security:-5}},score:S(3,-3,0,1,-2,-3,-1,2,1,2,3,-1),story:"Rodina platí více služeb sama, stát však postupně snižuje úrokový účet."}
  ]
}
);

// Pořadí možností se při každém otevření promíchá. Identifikátory a fiskální účinky zůstávají s možností.
questions.forEach(question => {
  for (let i = question.options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
  }
});
