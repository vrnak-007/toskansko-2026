questions.push(
{
    title:"Jak spojit energetiku, klima a sociální únosnost?",
    context:"Energetické a emisní ceny mění chování, ale mohou silně dopadat na domácnosti s nízkými příjmy a špatným bydlením. Plošné kompenzace jsou zase drahé a tlumí motivaci šetřit.",
    options:[
      {text:"Zdanit škodlivé externality, výnos vracet cíleně domácnostem a snižovat zdanění práce; současně investovat do sítí a úspor.", note:"Cenový signál, kompenzace a produktivní investice.", score:S(0,1,3,2,2,2,1,0,2,1,2,2), story:"Energie zdražuje podle skutečných nákladů, ale rodina dostane cílenou kompenzaci a levnější práci; vyplatí se jí zateplení."},
      {text:"Odložit nové povinnosti a daně, nechat inovace a ceny na trhu a nefinancovat plošné přechodové programy.", note:"Nízký zásah, vyšší riziko budoucího skokového přizpůsobení.", score:S(3,-2,0,1,-1,0,0,3,1,2,0,1), story:"Rodina nyní neplatí novou daň, ale budoucí cena energie a nutná modernizace přicházejí méně předvídatelně."},
      {text:"Použít zákazy, kvóty a rozsáhlé veřejné investice a dotace do vybraných technologií.", note:"Rychlé řízené změny, menší volba a riziko chybného výběru technologie.", score:S(-3,3,0,1,1,2,0,-3,1,-1,-2,0), story:"Stát určuje tempo i technologii; rodina získá dotaci, jen pokud její dům a projekt splní přesné parametry."},
      {text:"Držet ceny energií stropy a plošnými dotacemi pro domácnosti i firmy.", note:"Okamžitá úleva, vysoké náklady a slabá motivace k úsporám.", score:S(-1,2,-2,-1,-2,3,0,-1,0,0,-3,1), story:"Účet je krátkodobě nižší, ale deficit roste a rodina nemá silný důvod investovat do úspor."}
    ]
  },
{
    title:"Jak omezit korupci a plýtvání ve veřejných zakázkách?",
    context:"Korupční riziko neroste automaticky s velikostí státu. Roste zejména tam, kde chybí soutěž, dohledatelné vlastnictví, data, nezávislá kontrola a osobní odpovědnost.",
    options:[
      {text:"Povinná otevřená data, skuteční vlastníci dodavatelů, více soutěže, nezávislý audit, ochrana oznamovatelů a kontroly zaměřené podle rizika.", note:"Silná transparentnost i ex post odpovědnost.", score:S(0,0,3,3,1,1,1,1,3,2,3,1), story:"Petr si na portálu ověří cenu nové silnice i vlastníka dodavatele; podezřelé zakázky vybírá kontrola podle datových signálů."},
      {text:"Zjednodušit procedury a decentralizovat nákup, ale vše zveřejňovat a za prokázané zneužití ukládat vysoké osobní sankce.", note:"Rychlost a odpovědnost, menší prevence před podpisem.", score:S(3,-1,2,2,0,0,1,3,2,3,2,1), story:"Obec nakupuje rychleji a odpovědnost je osobní; kvalita výsledku však více závisí na schopnosti místních lidí."},
      {text:"Centralizovat většinu nákupů a zavést mnoho předběžných kontrol a schvalovacích stupňů.", note:"Jednotnost a prevence, ale riziko pomalosti a formálního alibismu.", score:S(-2,2,0,2,0,1,-1,-2,1,-2,1,0), story:"Zakázka pro Hvozdnici prochází centrální kontrolou; cena může klesnout, ale oprava trvá déle a odpovědnost se rozplývá."},
      {text:"U strategických projektů umožnit přímé zadání prověřeným domácím firmám, aby se nebrzdila realizace.", note:"Rychlost za cenu soutěže a vysokého klientelistického rizika.", score:S(0,1,-2,-3,-1,-1,0,-1,-3,1,-2,-1), story:"Projekt se rozjede rychle, ale občané nemohou ověřit, zda vybraná firma nabídla nejlepší cenu a zda nebyla vybrána kvůli kontaktům."}
    ]
  },
{
    title:"Jak má fungovat digitální stát a ochrana soukromí?",
    context:"Digitalizace může odstranit formuláře a zvýšit dostupnost pomoci, ale jen pokud jsou data minimalizována, přístup je dohledatelný a člověk se může proti rozhodnutí odvolat.",
    options:[
      {text:"Princip „jednou a dost“, minimum údajů, občanský přehled přístupů, auditní stopy, vysvětlitelné rozhodnutí a snadné odvolání.", note:"Vysoká efektivita při silných procesních zárukách.", score:S(0,0,3,3,2,3,3,1,3,3,2,3), story:"Jana vyplní údaje jednou, vidí, kdo je použil, a může opravit chybu dřív, než ovlivní dávku nebo školku."},
      {text:"Stát má držet minimum centrálních dat; většinu služeb mají poskytovat obce a soukromé subjekty bez sdílených registrů.", note:"Silné informační soukromí, ale roztříštěné služby.", score:S(3,-2,0,1,-1,-2,-1,3,3,0,1,-1), story:"O rodině je méně centrálních dat, ale stejné dokumenty nosí na více míst a služby se hůře propojují."},
      {text:"Zákonem široce propojit registry pro automatické nároky a kontroly, s nezávislým dozorem, ale omezenou možností odmítnout sdílení.", note:"Vysoká automatizace, nižší individuální kontrola nad daty.", score:S(-2,2,2,2,2,3,3,-1,0,3,2,2), story:"Rodina dostává služby téměř automaticky, ale nemůže vždy rozhodnout, které instituce si data předají."},
      {text:"Použít neveřejné algoritmické skóre občana pro dávky, kontroly a prioritu služeb, aby se šetřily kapacity.", note:"Zdánlivá rychlost, vysoké riziko diskriminace a neodvolatelnosti.", score:S(0,1,-1,-3,0,0,1,-2,-3,1,0,0), story:"Petr neví, proč systém označil jeho domácnost za rizikovou; chyba se obtížně hledá a ovlivní několik služeb současně."}
    ]
  },
{
    title:"Jak zvýšit čas rodičů pro rodinu a vlastní život?",
    context:"Méně odpracovaných hodin neznamená automaticky vyšší životní úroveň. Rozhoduje produktivita, dojíždění, flexibilita, péče o děti a to, kdo nese náklady.",
    options:[
      {text:"Prosadit vymahatelné právo žádat flexibilní nebo zkrácený úvazek, dostupnou péči a práci na dálku tam, kde to provoz umožňuje; plošně hodiny nesnižovat.", note:"Cílená časová autonomie při zachování produktivity.", score:S(0,1,3,2,2,2,3,2,2,1,2,3), story:"Petr pracuje jeden den z domova na administrativě a Jana má předvídatelný úvazek; rodina šetří dojíždění i krizové hlídání."},
      {text:"Nechat pracovní dobu i flexibilitu výhradně na smlouvě a snížit odvody, aby vzniklo více různých pracovních nabídek.", note:"Vysoká smluvní volnost, slabší vyjednávací pozice části zaměstnanců.", score:S(3,-2,1,1,-1,-2,-1,3,1,3,2,1), story:"Firma může nabídnout různé režimy, ale Petr získá flexibilitu jen tehdy, když má silnou pozici při vyjednávání."},
      {text:"Zákonem zavést 35hodinový nebo čtyřdenní týden při stejné měsíční mzdě pro většinu zaměstnanců.", note:"Více času, riziko růstu nákladů a intenzity práce.", score:S(-3,2,-2,0,0,3,3,-3,2,0,-1,1), story:"Rodina má volnější pátek, ale některé služby zdražují a Petr stihne stejný objem práce v kratším čase."},
      {text:"Podpořit přesčasy a druhé příjmy daňovými bonusy, aby domácnosti rychleji zvýšily spotřebu a úspory.", note:"Více peněz za cenu méně času a vyššího rizika vyčerpání.", score:S(1,1,-1,0,-1,0,-3,1,1,-1,-2,0), story:"Petrův příjem roste díky přesčasům, ale večery a víkendy mizí a Jana přebírá větší díl neplacené péče."}
    ]
  },
{
    title:"Jak má stát reagovat na hlubokou hospodářskou krizi?",
    context:"Krize testuje, zda jsou pravidla připravena předem. Plošná podpora je rychlá, ale drahá; prudké škrty mohou propad prohloubit; ad hoc pomoc zvyšuje prostor pro lobbying.",
    options:[
      {text:"Automaticky a dočasně posílit cílenou podporu dolní poloviny domácností, držet produktivní investice a v dobrých letech předem tvořit fiskální rezervu.", note:"Cílená stabilizace, předvídatelnost a proticyklická disciplína.", score:S(-1,1,3,3,3,2,1,1,2,2,3,3), story:"Při výpadku zakázek pomoc naskočí bez nového politického boje; obec neruší připravenou infrastrukturu a později se podpora vypne."},
      {text:"Rychle vyrovnat rozpočet plošnými škrty a snížením daní, aby se ekonomika přizpůsobila bez růstu dluhu.", note:"Fiskální tvrdost, riziko zesílení propadu poptávky a služeb.", score:S(3,-3,-1,1,-2,-3,-1,3,1,2,3,-1), story:"Dluh se nezvyšuje, ale škola, obec i rodina škrtají současně a místní ekonomika se zotavuje pomaleji."},
      {text:"Zavést široké cenové stropy a plošné transfery všem domácnostem, financované dluhem až do odeznění krize.", note:"Rychlé pokrytí, slabé cílení a vysoké budoucí náklady.", score:S(-3,3,-1,0,-1,3,1,-2,1,0,-3,1), story:"Rodina je okamžitě chráněna, ale část podpory dostávají i bohatí a dluh omezuje pozdější investice."},
      {text:"Rozdělovat pomoc jednotlivým firmám a profesím podle jejich strategického významu a naléhavosti.", note:"Flexibilní, ale silně závislé na lobbingu a diskrétním rozhodování.", score:S(0,2,-2,-3,-2,-1,0,-1,-1,-2,-3,-1), story:"O přežití Petrovy firmy rozhoduje, zda je označena za strategickou a zda se dostane k rozhodujícím lidem."}
    ]
  }
);

// Při každém otevření se pořadí odpovědí promíchá. Písmena jsou pouze vizuální označení.
questions.forEach(q => {
  for (let i = q.options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
  }
});
