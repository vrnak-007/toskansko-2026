questions.push(
{
    title:"Jak změnit české daně?",
    context:"Kniha i současné analýzy upozorňují, že Česko vybírá relativně mnoho z práce a málo z nemovitostí. Otázka není jen „více, nebo méně daní“, ale také z čeho je vybírat.",
    options:[
      {text:"Snížit odvody nízkých a středních mezd; výpadek nahradit lépe nastavenou daní z hodnoty nemovitostí, omezením výjimek a účinnějším výběrem.", note:"Daňový přesun, nikoli automaticky vyšší celkové zdanění.", score:S(0,0,3,2,2,1,0,1,1,2,3,3), story:"Práce je pro rodinu zdaněna mírněji, ale dům nese vyšší a předvídatelnou majetkovou daň; obec má stabilnější příjem."},
      {text:"Snížit daň z příjmů, odvody, daň firem i majetkové daně a odpovídajícím způsobem omezit veřejné výdaje.", note:"Nízké daně, menší rozsah služeb.", score:S(3,-3,1,0,-1,-2,0,3,1,2,1,1), story:"Petr si nechá větší část výplaty, ale více služeb, pojištění a péče platí rodina přímo."},
      {text:"Výrazně zvýšit progresi daně z příjmů a zdanění firem; majetkové daně nechat nízké kvůli ochraně vlastnického bydlení.", note:"Vyšší vertikální přerozdělování, ale práce a podnikání zůstávají hlavním základem.", score:S(-3,3,-1,1,1,2,0,-2,1,0,2,0), story:"Rodina čerpá širší služby, ale vyšší náklady práce a firem se částečně promítnou do mezd a cen."},
      {text:"Sazby příliš neměnit; přidávat odpočty, slevy a výjimky pro skupiny, které stát zrovna potřebuje podpořit.", note:"Politicky snadné, administrativně složité.", score:S(0,0,-2,-2,-2,-1,0,1,0,-3,-1,-1), story:"Daňové přiznání je plné výjimek. Kdo má poradce a správný status, získá více než rodina se stejným příjmem bez něj."}
    ]
  },
{
    title:"Jak má stát podpořit člověka s nízkou mzdou?",
    context:"Vysoké odvody a prudké odebírání dávek mohou vytvořit situaci, kdy se další práce málo vyplatí. Na druhé straně příliš široká podpora může být drahá a necílená.",
    options:[
      {text:"Zavést vratný daňový bonus za práci a dávky odebírat plynule, aby každá další vydělaná koruna zvýšila čistý příjem.", note:"Podpora zaměstnání bez dávkové pasti.", score:S(-1,1,3,2,3,2,1,1,1,2,1,3), story:"Když Jana zvýší úvazek, nepřijde skokově o podporu. Další směna se domácnosti skutečně vyplatí."},
      {text:"Zrušit většinu podpor a minimální mzdu; nízkopříjmovým výrazně snížit odvody a nechat mzdy určovat trh.", note:"Silná motivace přes trh, slabší sociální pojistka.", score:S(3,-3,1,0,-1,-3,-1,3,0,3,2,0), story:"Práce je levnější a flexibilnější, ale při výpadku příjmu nese téměř celé riziko rodina."},
      {text:"Výrazně zvýšit minimální mzdu a přidat univerzální příspěvek všem pracujícím s dětmi.", note:"Vysoké pokrytí, vyšší náklady a slabší cílení.", score:S(-3,3,0,1,1,3,1,-2,1,1,-1,2), story:"Rodina má jistější příjmové minimum, část nákladů však nese zaměstnavatel a část daňový systém."},
      {text:"Rozdělovat dočasné příspěvky a dotace oborům, v nichž jsou mzdy právě politickým problémem.", note:"Rychlé, ale selektivní a obtížně předvídatelné.", score:S(0,1,-2,-2,-2,-1,0,0,0,-2,-2,-1), story:"Petr čeká, zda se jeho obor vejde do příštího dotačního programu; pravidla se mění s každým rozpočtem."}
    ]
  },
{
    title:"Jak má vypadat systém sociálních dávek?",
    context:"Dobrý systém musí současně trefit potřebné, neztratit oprávněné lidi v administrativě a nebrat motivaci pracovat.",
    options:[
      {text:"Jedna srozumitelná digitální žádost, automatické předvyplnění, terénní pomoc a plynulé snižování dávky s růstem příjmu.", note:"Vysoké cílení i dostupnost, pokud jsou kvalitní data a opravné prostředky.", score:S(-1,1,2,2,3,3,2,1,2,3,2,3), story:"Když rodině krátce vypadne příjem, systém údaje předvyplní a pomoc se s návratem do práce snižuje postupně."},
      {text:"Nízké, přísně testované a časově omezené dávky, pravidelné kontroly a povinnost přijmout nabízenou práci.", note:"Nízké náklady a vysoká selektivita, riziko nečerpání oprávněnými.", score:S(3,-3,1,1,2,-2,-1,2,0,1,3,-1), story:"Pomoc je levná, ale při chybě nebo zpoždění musí Petr rychle sáhnout do rezerv; podmínky jsou tvrdé."},
      {text:"Široké univerzální dávky pro rodiny, děti a bydlení bez podrobného testování příjmu.", note:"Jednoduché a dostupné, ale menší část peněz míří jen k chudým.", score:S(-3,3,0,1,-1,3,2,-1,2,2,-1,2), story:"Rodina dostává podporu bez stigmatizace a papírování, stejně jako domácnosti, které ji nutně nepotřebují."},
      {text:"Zachovat mnoho samostatných dávek pro různé životní situace a rozhodování ponechat jednotlivým úřadům.", note:"Detailní, ale složité a náchylné k rozdílům v praxi.", score:S(0,1,-2,-2,0,-2,-2,-1,0,-3,-2,-1), story:"Jana obíhá několik formulářů a výsledek závisí na tom, jak místní úřad vyloží jednotlivé podmínky."}
    ]
  },
{
    title:"Rodičovská a péče o malé děti: co má být prioritou?",
    context:"Česko má dlouhé čerpání rodičovské a nízkou dostupnost péče pro děti do tří let. To omezuje návrat části rodičů, zejména matek, na trh práce.",
    options:[
      {text:"Kratší a flexibilnější rodičovská, část vyhrazená druhému rodiči, dostatek dostupných dětských skupin a školek a možnost částečných úvazků.", note:"Investice do služeb a zaměstnanosti rodičů.", score:S(-1,1,3,2,2,3,3,1,2,1,2,3), story:"Eliška má místo v dětské skupině a Jana se vrací na tři čtvrtiny úvazku; péče se častěji dělí mezi oba rodiče."},
      {text:"Nechat péči na rodině a trhu; místo budování zařízení dát rodičům daňovou slevu a volbu, jak ji využijí.", note:"Vysoká volba pro solventní rodiny, nerovná dostupnost služeb.", score:S(3,-2,1,0,-1,-2,-1,3,1,2,2,0), story:"Rodina si může vybrat, ale dostupná soukromá péče rozhoduje, zda se Jana vrátí do práce."},
      {text:"Zachovat dlouhou štědrou rodičovskou a garantovat veřejnou školku až od tří let.", note:"Příjmová jistota v rané péči, delší výpadek z práce.", score:S(-3,3,-1,1,0,2,2,-1,2,1,-2,1), story:"Jana zůstává déle doma; rodina má jistotu dávky, ale její kariéra a budoucí výdělek se obnovují pomaleji."},
      {text:"Nařídit zaměstnavatelům čtyřdenní týden a plně placené rodičovské volno bez změny odvodů nebo veřejného financování.", note:"Více času, ale vysoké náklady přenesené na zaměstnavatele.", score:S(-2,2,-2,0,0,1,3,-3,1,-2,-1,1), story:"Petr získá více času doma, ale jeho firma omezuje nábor a zvyšuje tlak na výkon v kratším týdnu."}
    ]
  },
{
    title:"Jak řešit nedostupné bydlení?",
    context:"Ceny a nájmy ovlivňuje nabídka, územní plánování, infrastruktura, daňové pobídky i sociální ochrana. Jedno opatření obvykle nestačí.",
    options:[
      {text:"Zrychlit povolování a zahušťovat vhodná místa, motivovat obce k nové výstavbě, rozvíjet dostupné nájemní bydlení a stabilní pravidla nájmu.", note:"Kombinace nabídky, místních pobídek a sociálního nástroje.", score:S(0,1,3,2,2,2,2,1,2,1,2,3), story:"V okolí přibývají byty i infrastruktura; mladé rodiny nejsou odkázány jen na drahou hypotéku."},
      {text:"Maximálně uvolnit územní a stavební pravidla, prodat veřejné pozemky a zrušit podpory i obecní bydlení.", note:"Silná sázka na nabídku trhu.", score:S(3,-3,2,1,-2,-2,0,3,1,2,3,0), story:"Staví se rychleji, ale domácnost bez úspor nemá veřejnou pojistku a nese plné tržní riziko."},
      {text:"Zavést stropy nájmů a masivní veřejnou výstavbu financovanou státem.", note:"Silná cenová ochrana, riziko menší soukromé nabídky a vysokých nákladů.", score:S(-3,3,-1,1,1,2,1,-3,1,0,-2,1), story:"Nájemníci jsou chráněni, ale čekací seznamy a rozpočtová kapacita rozhodují, kdo se k bydlení dostane."},
      {text:"Rozšířit dotace hypoték, daňové odpočty úroků a jednorázové příspěvky na koupi.", note:"Pomáhá kupujícím, ale může zvýšit poptávku a ceny.", score:S(1,1,-2,0,-2,-1,0,1,1,0,-2,0), story:"Rodina dostane podporu na hypotéku, ale část výhody se rychle promítne do vyšších cen nemovitostí."}
    ]
  }
);
