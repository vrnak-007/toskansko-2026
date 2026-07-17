const HOST_BOOK_INTERVIEW = "https://kavarna.hostbrno.cz/clanky/omezujeme-sance-na-uspech-a-rozvoj-spouste-lidi-sociolog-daniel-prokop-o-nove-knize-spravedlivy-rust";
const HOST_BOOK_PAGE = "https://www.hostbrno.cz/spravedlivy-rust/";
const PAQ_TAX_SOURCE = "https://www.paqresearch.cz/post/vyber-dane-srovnani/";
const PARENTS_SOURCE = "https://www.irozhlas.cz/zpravy-domov/prokop-navrat-rodicu-do-prace-je-u-nas-obrovsky-zdaneny-velka-cast-se-vracet_2511051600_elev";
const PROPERTY_SOURCE = "https://www.irozhlas.cz/ekonomika/dan-z-nemovitosti-investice-byty-pozemky-zivot-k-nezaplaceni-daniel-prokop_2404101438_har";

questions.push(
{
  id:"q01",
  title:"Má se přesunout daňová zátěž z práce na majetek, spotřebu a kapitál?",
  context:"Změna daňového mixu může snížit cenu práce, ale neznamená automaticky nižší celkové daně. Každá nahrazená koruna se vybere jinde nebo se projeví ve schodku.",
  book:{
    summary:"Kniha navrhuje snížit zdanění nízkých a části středních mezd a výpadek krýt uzavřením výjimek a vyšším výběrem z majetku, spotřeby a kapitálu.",
    sourceLabel:"Daniel Prokop v rozhovoru k nové knize; daňová část vychází z projektu Chytřejší daně a analýz PAQ.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q01_book",bookAligned:true,text:"Snížit odvody z práce a výpadek plně nahradit daní z hodnoty nemovitostí, omezením výjimek a vyšším zdaněním některých kapitálových příjmů.",note:"Rozpočtově neutrální přesun: práce zlevní, majetek a kapitál zaplatí více.",fx:{labourPp:-0.6,otherTaxMonthly:900,richTaxRevenueBn:40,deficitBn:0,marginalPp:-1.5,growth10Pp:0.4,stateScope:2,efficiency:2},score:S(0,0,3,2,2,1,0,1,1,2,3,2),story:"Rodina odvádí méně z výplaty, ale platí vyšší majetkovou a spotřební složku."},
    {id:"q01_market",bookAligned:false,text:"Snížit daně z práce, firem i majetku a současně trvale snížit veřejné výdaje, aby nevznikl nový dluh.",note:"Nižší daňová kvóta, ale menší veřejný rozsah.",fx:{labourPp:-4.0,otherTaxMonthly:-300,richTaxRevenueBn:-20,deficitBn:0,marginalPp:-3.0,growth10Pp:0.3,stateScope:-8,servicesBn:{education:-5,health:-5,transport:-10}},score:S(3,-3,1,0,-1,-2,0,3,1,2,2,1),story:"Rodině zůstává více hotovosti, část služeb však nakupuje sama."},
    {id:"q01_progressive",bookAligned:false,text:"Zvýšit progresi daně z příjmů a daň firem a výnos použít na širší veřejné služby.",note:"Vyšší přerozdělování; část účtu může přejít do mezd, investic a cen.",fx:{labourPp:1.0,richTaxRevenueBn:80,deficitBn:-20,marginalPp:4.0,growth10Pp:-0.5,stateScope:9,servicesBn:{education:15,health:15,transport:10}},score:S(-3,3,-1,1,1,2,0,-2,1,0,1,1),story:"Stát vybírá více a rozšiřuje služby; rodina má menší soukromý rozpočet."},
    {id:"q01_exemptions",bookAligned:false,text:"Sazby téměř neměnit a přidávat nové slevy, odpočty a výjimky pro podporované skupiny.",note:"Nižší viditelný konflikt, vyšší složitost a tlak na schodek.",fx:{otherTaxMonthly:-200,richTaxRevenueBn:-10,deficitBn:20,marginalPp:1.5,growth10Pp:-0.3,stateScope:2,efficiency:-4,integrity:-2,adminHours:1.2},score:S(0,0,-2,-2,-2,-1,0,1,0,-3,-2,-1),story:"Kdo zná výjimky, ušetří; zbytek platí složitější systém a budoucí dluh."}
  ]
},
{
  id:"q02",
  title:"Jak má stát zvýšit čistý příjem lidí s nízkou mzdou?",
  context:"Nižší odvody nebo pracovní bonus zvyšují čistý příjem, ale musí být kryty jinou daní, nižším výdajem nebo dluhem.",
  book:{
    summary:"Kniha zdůrazňuje snížení zdanění nízkopříjmové práce a odstranění situací, kdy se další práce domácnosti finančně téměř nevyplatí.",
    sourceLabel:"Veřejný popis první části knihy v rozhovoru nakladatelství Host.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q02_book",bookAligned:true,text:"Zavést vratný pracovní bonus, snížit odvody nízkých mezd a dávky odebírat plynule.",note:"Vyšší návratnost další směny; část výpadku zůstává jako schodek.",fx:{labourPp:-0.6,cashMonthly:800,deficitBn:15,marginalPp:-3.5,growth10Pp:0.4,stateScope:1,efficiency:2},score:S(-1,1,3,2,3,2,1,1,1,2,1,3),story:"Janě se zvýšení úvazku skutečně projeví v čistém příjmu."},
    {id:"q02_market",bookAligned:false,text:"Výrazně snížit odvody nízkých mezd a současně zrušit většinu pracovních podpor a minimální mzdu.",note:"Silná tržní motivace, slabší pojistka při výpadku příjmu.",fx:{labourPp:-3.0,cashMonthly:-1200,deficitBn:-5,marginalPp:-2.5,growth10Pp:0.2,stateScope:-5},score:S(3,-3,1,0,-1,-3,-1,3,0,3,2,0),story:"Práce je levnější, ale riziko nezaměstnanosti nese více rodina."},
    {id:"q02_universal",bookAligned:false,text:"Zvýšit minimální mzdu a zavést univerzální příspěvek všem pracujícím rodinám.",note:"Vysoké pokrytí; náklad se dělí mezi zaměstnavatele, poplatníky a dluh.",fx:{labourPp:0.5,cashMonthly:1800,deficitBn:30,marginalPp:1.0,growth10Pp:-0.2,stateScope:7},score:S(-3,3,0,1,1,3,1,-2,1,1,-1,2),story:"Rodina dostává jistější minimum, ale roste cena práce a rozpočtový účet."},
    {id:"q02_subsidy",bookAligned:false,text:"Dotovat jen obory a zaměstnavatele, kde jsou mzdy politicky označeny za problém.",note:"Selektivní pomoc, vyšší lobbying a nejistota pravidel.",fx:{cashMonthly:600,deficitBn:20,marginalPp:0.5,growth10Pp:-0.3,stateScope:4,efficiency:-4,integrity:-4,adminHours:1.0},score:S(0,1,-2,-2,-2,-1,0,0,0,-2,-2,-1),story:"Petr čeká, zda se jeho firma dostane na seznam podporovaných."}
  ]
},
{
  id:"q03",
  title:"Jak mají fungovat dávky, exekuce a návrat do legální práce?",
  context:"Příliš prudké odebrání dávky nebo srážky z vyšší mzdy mohou vytvořit efektivní mezní zatížení, při kterém člověk z další práce téměř nic nemá.",
  book:{
    summary:"Kniha kritizuje systém, v němž člověk při zvýšení mzdy může kvůli dávkám či exekučním srážkám přijít o čistý příjem, a požaduje plynulejší motivace k legální práci.",
    sourceLabel:"Rozhovor k nové knize: veřejné systémy jsou podle autora chronicky demotivující.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q03_book",bookAligned:true,text:"Sloučit žádosti, dávky a srážky nastavovat plynule a garantovat, že každá další vydělaná koruna zvýší čistý příjem.",note:"Nižší dávková a exekuční past; jednorázové náklady na změnu systému.",fx:{cashMonthly:400,deficitBn:5,marginalPp:-4.0,growth10Pp:0.4,stateScope:1,efficiency:5,adminHours:-1.5},score:S(-1,1,2,2,3,3,2,1,2,3,2,3),story:"Rodina nepřijde skokově o podporu při návratu do práce."},
    {id:"q03_strict",bookAligned:false,text:"Dávky držet nízké, přísně testované a časově omezené; exekuční srážky vymáhat rychle.",note:"Nižší veřejný náklad, vyšší riziko nečerpání a práce mimo systém.",fx:{cashMonthly:-1200,deficitBn:-20,marginalPp:2.0,growth10Pp:-0.1,stateScope:-4,adminHours:0.8},score:S(3,-3,1,1,2,-2,-1,2,0,1,3,-1),story:"Pomoc je levná, ale chyba nebo krátký výpadek příjmu rychle zasáhne rezervy."},
    {id:"q03_universal",bookAligned:false,text:"Nahradit testované dávky širokými univerzálními platbami bez kontroly příjmu.",note:"Jednoduché, ale drahé; pomoc dostávají i domácnosti bez potřeby.",fx:{labourPp:1.0,cashMonthly:2500,deficitBn:35,marginalPp:0,growth10Pp:-0.2,stateScope:9,efficiency:1},score:S(-3,3,0,1,-1,3,2,-1,2,2,-1,2),story:"Rodina dostává platbu automaticky, stejně jako bohatší sousedé."},
    {id:"q03_fragmented",bookAligned:false,text:"Ponechat mnoho samostatných dávek, výjimek a místního uvážení úřadů.",note:"Detailní, ale nákladné a obtížně předvídatelné.",fx:{cashMonthly:600,deficitBn:15,marginalPp:4.0,growth10Pp:-0.4,stateScope:4,efficiency:-5,integrity:-2,adminHours:3.0},score:S(0,1,-2,-2,0,-2,-2,-1,0,-3,-2,-1),story:"Jana vyplňuje několik žádostí a výsledek závisí na interpretaci úřadu."}
  ]
},
{
  id:"q04",
  title:"Jak snížit finanční trest za návrat rodiče do práce?",
  context:"Místo ve školce, délka rodičovské, daňový klín a dostupnost částečných úvazků rozhodují, zda se druhý příjem domácnosti skutečně vyplatí.",
  book:{
    summary:"Autor knihy veřejně argumentuje, že návrat rodičů do práce je v Česku silně zatížen kombinací daní, ztráty podpory a nedostupné péče.",
    sourceLabel:"Rozhovor Daniela Prokopa pro iROZHLAS o návratu rodičů do práce.",
    sourceUrl:PARENTS_SOURCE
  },
  options:[
    {id:"q04_book",bookAligned:true,text:"Zkrátit a zpružnit rodičovskou, rozšířit dětské skupiny a školky a snížit klín druhého příjmu.",note:"Vyšší veřejný náklad dnes, vyšší pracovní účast a daňový základ později.",fx:{labourPp:-0.3,cashMonthly:300,deficitBn:15,marginalPp:-2.0,growth10Pp:0.5,stateScope:4,servicesBn:{education:15},timeHours:1.5},score:S(-1,1,3,2,2,3,3,1,2,1,2,3),story:"Jana získá místo pro dítě a návrat na úvazek jí zvýší čistý příjem."},
    {id:"q04_market",bookAligned:false,text:"Místo veřejných zařízení dát rodinám daňovou slevu a nechat péči na trhu.",note:"Vyšší volba; dostupnost závisí na ceně soukromé péče.",fx:{otherTaxMonthly:-500,deficitBn:5,marginalPp:-0.5,growth10Pp:0.1,stateScope:-4,servicesBn:{education:-5},privateCostMonthly:700},score:S(3,-2,1,0,-1,-2,-1,3,1,2,2,0),story:"Rodina má slevu, ale musí najít a doplatit soukromou péči."},
    {id:"q04_long",bookAligned:false,text:"Zachovat dlouhou štědrou rodičovskou a veřejné místo garantovat až od tří let.",note:"Příjmová jistota, ale delší výpadek kariéry a vyšší transfery.",fx:{cashMonthly:1800,deficitBn:25,marginalPp:1.0,growth10Pp:-0.4,stateScope:6,timeHours:2.0},score:S(-3,3,-1,1,0,2,2,-1,2,1,-2,1),story:"Jana zůstává déle doma; krátkodobě má dávku, dlouhodobě slabší mzdu."},
    {id:"q04_mandate",bookAligned:false,text:"Přenést náklad na zaměstnavatele povinným čtyřdenním týdnem a plně placeným rodičovským volnem.",note:"Nejde přes rozpočet, ale přes vyšší cenu práce, mzdy a nábor.",fx:{deficitBn:0,marginalPp:2.0,richTaxRevenueBn:10,growth10Pp:-0.6,stateScope:6,timeHours:2.5},score:S(-2,2,-2,0,0,1,3,-3,1,-2,-1,1),story:"Rodina získá čas, firma však omezuje nábor a zvyšuje výkonové normy."}
  ]
},
{
  id:"q05",
  title:"Jak řešit nedostupné bydlení?",
  context:"Nabídková reforma, obecní výstavba, daňové pobídky a přímé dotace mají odlišný účet i dopad na ceny.",
  book:{
    summary:"Kniha prosazuje kombinaci uvolnění územního plánování, zahušťování, obecní výstavby a daňové či legislativní motivace k dlouhodobým nájmům; regulaci nájmů hodnotí skepticky.",
    sourceLabel:"Rozhovor k nové knize, část o bydlení a regionálním rozvoji.",
    sourceUrl:HOST_BOOK_INTERVIEW
  },
  options:[
    {id:"q05_book",bookAligned:true,text:"Uvolnit vhodnou výstavbu, motivovat obce, stavět část obecního nájemního bydlení a zvýhodnit dlouhodobé pronájmy.",note:"Kombinace trhu a veřejné investice; část se financuje majetkovou daní.",fx:{otherTaxMonthly:300,deficitBn:10,growth10Pp:0.6,stateScope:4,servicesBn:{transport:15},efficiency:2},score:S(0,1,3,2,2,2,2,1,2,1,2,3),story:"Staví se více a obec investuje do infrastruktury; vlastník platí vyšší majetkovou daň."},
    {id:"q05_market",bookAligned:false,text:"Maximálně uvolnit výstavbu, prodat veřejné pozemky a zrušit obecní bydlení i podpory.",note:"Silná nabídka trhu, menší veřejný účet a pojistka.",fx:{deficitBn:-10,growth10Pp:0.4,stateScope:-6,servicesBn:{transport:-5},privateCostMonthly:300},score:S(3,-3,2,1,-2,-2,0,3,1,2,3,0),story:"Výstavba se zrychlí, ale slabší domácnost nemá veřejnou alternativu."},
    {id:"q05_public",bookAligned:false,text:"Zavést stropy nájmů a masivní státní výstavbu financovanou rozpočtem.",note:"Silná cenová ochrana pro vybrané nájemníky, vysoký kapitálový účet.",fx:{deficitBn:60,growth10Pp:-0.5,stateScope:10,servicesBn:{transport:20},efficiency:-1},score:S(-3,3,-1,1,1,2,1,-3,1,0,-2,1),story:"Někteří nájemníci platí méně, jiní čekají na byt; dluh financuje výstavbu."},
    {id:"q05_subsidy",bookAligned:false,text:"Rozšířit dotace hypoték, odpočty úroků a jednorázové příspěvky na koupi.",note:"Přímá úleva kupujícím, část podpory se může propsat do vyšší ceny.",fx:{otherTaxMonthly:-800,cashMonthly:500,deficitBn:35,growth10Pp:-0.2,stateScope:4},score:S(1,1,-2,0,-2,-1,0,1,1,0,-2,0),story:"Rodina získá podporu, ale část výhody zachytí vyšší cena nemovitosti."}
  ]
},

);
