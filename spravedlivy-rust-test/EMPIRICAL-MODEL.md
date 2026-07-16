# Empirický a hodnotový model testu „Spravedlivý růst: kdo zaplatí účet?“

Verze 2.0, červenec 2026

## 1. Co tento test je

Tento projekt je **transparentně tržně-liberální stresový test**. Není neutrální volební kalkulačkou ani odhadem skutečného státního rozpočtu.

Hodnotové předpoklady jsou následující:

1. Peníze ponechané původnímu příjemci mají vyšší hodnotu osobní volby než stejně vysoký veřejný výdaj, pokud veřejný výdaj nepřinese prokazatelnou službu nebo pojistnou hodnotu.
2. Vyšší čistá návratnost další práce, podnikání, inovace a investice je žádoucí.
3. Soutěž, vlastnická práva, jednoduchá pravidla a osobní odpovědnost jsou preferovány před dotacemi, výjimkami a diskrétním politickým výběrem.
4. Rozsah státu zvyšuje objem prostředků vystavený politickému rozhodování. Samotná velikost státu však neurčuje míru korupce; rozhodující jsou integrita, soutěž, transparentnost a kontrola.
5. Veřejné statky a sociální pojištění mohou mít pozitivní produktivní hodnotu. Model proto započítává využitelné veřejné služby a zároveň náklady, které domácnost nese, pokud si chybějící služby musí koupit soukromě.

## 2. Co empirická literatura podporuje

### Účetní vztah

Při nezměněných hrubých příjmech a službách vyšší povinné daně a odvody mechanicky snižují hotovost pod soukromou kontrolou. Jde o účetní identitu, nikoli o spornou kauzální hypotézu.

### Nabídka práce, zdanitelný příjem a dávkové pasti

Vyšší mezní zdanění a prudké odebírání dávek snižují částku, která člověku zůstane z další vydělané koruny. Empirická reakce se liší mezi skupinami. Literatura obvykle nachází větší elasticitu vykazovaného zdanitelného příjmu u vysokých příjmů než reakci skutečných odpracovaných hodin; část reakce je daňové plánování.

- Jon Gruber, Emmanuel Saez: *The Elasticity of Taxable Income: Evidence and Implications*, NBER Working Paper 7512.  
  https://www.nber.org/papers/w7512
- OECD: *Taxing Wages 2026*.  
  https://www.oecd.org/en/publications/taxing-wages-2026_8c611f4a-en.html

### Inovace, podnikání a umístění aktivity

Historická data ukazují, že osobní a firemní daně mohou ovlivňovat počet inovací, umístění inovátorů a investiční rozhodování. Odhady nejsou univerzální konstantou pro každou zemi a každou sazbu.

- Ufuk Akcigit et al.: *Taxation and Innovation in the 20th Century*, NBER Working Paper 24982.  
  https://www.nber.org/papers/w24982

### Struktura daní je důležitější než samotná daňová kvóta

OECD ve svém růstovém pořadí považuje daně z příjmů právnických osob za škodlivější pro dlouhodobý růst než osobní příjmové daně, spotřební daně a zejména opakované daně z nemovitostí. Model proto nezachází se všemi daněmi stejně.

- OECD: *Tax Policy Reform and Economic Growth*.  
  https://www.oecd.org/en/publications/tax-policy-reform-and-economic-growth_9789264091085-en.html

### Makroekonomické účinky daňových změn

Historické americké studie identifikující exogenní změny daní nacházejí záporné dopady zvýšení daní na ekonomickou aktivitu. Velikost multiplikátoru je citlivá na období, monetární režim, počáteční sazby, typ daně a způsob identifikace.

- Christina Romer, David Romer: *The Macroeconomic Effects of Tax Changes*, NBER Working Paper 13264.  
  https://www.nber.org/papers/w13264
- Karel Mertens, José Luis Montiel Olea: *Marginal Tax Rates and Income*, NBER Working Paper 19171.  
  https://www.nber.org/papers/w19171

## 3. Co empirická literatura nepotvrzuje

Data nepodporují blanketní tvrzení, že **každé** přerozdělování nebo **každý** vyšší veřejný výdaj automaticky snižuje celkovou prosperitu. Produktivní vzdělávání, zdravotní prevence, infrastruktura, právní stát, ochrana soutěže a dobře navržené sociální pojištění mohou zvýšit pracovní účast, lidský kapitál a odolnost.

IMF v mezinárodní analýze nenašel obecný robustní důkaz, že redistribuce sama o sobě poškozuje růst, s výjimkou extrémních případů. To neznamená, že redistribuce je bez nákladů; znamená to, že čistý dopad závisí na konstrukci daní, výdajů a institucí.

- Jonathan Ostry, Andrew Berg, Charalambos Tsangarides: *Redistribution, Inequality, and Growth*, IMF Staff Discussion Note 14/02.  
  https://www.imf.org/external/pubs/ft/sdn/2014/sdn1402.pdf

Proto model nepoužívá rovnici „větší stát = vždy nižší HDP“. Vyšší rozsah státu vždy snižuje soukromou kontrolu nad penězi, ale může částečně nebo zcela kompenzovat tento náklad hodnotou služeb a produktivních veřejných statků.

## 4. Výchozí domácnost

Model používá jednu společnou domácnost, aby byly výsledky porovnatelné:

- Petr, 41 let, technická údržba;
- Jana, 37 let, úvazek 0,75;
- dvě děti ve věku 4 a 10 let;
- bydlení na hypotéku v Hvozdnici, okres Praha-západ;
- celkové měsíční náklady práce obou dospělých: **120 000 Kč**;
- hlavní nezbytné soukromé výdaje: **45 500 Kč měsíčně**.

Částka 120 000 Kč je didaktický předpoklad, nikoli statistický údaj o konkrétní obci.

## 5. Daňové kotvy

### Průměrný klín z nákladů práce

Výchozí hodnota je **41,2 %** nákladů práce. Jde o ukotvení podle OECD pro českého bezdětného zaměstnance s průměrnou mzdou v roce 2025. Rodina se dvěma dětmi může mít skutečný klín odlišný kvůli rozdělení příjmů, slevám a dávkám.

Modelový klín se mění takto:

```text
grossLabourLevyRate =
  41,2
  + 0,13 × (přerozdělování − 50)
  + 0,025 × (50 − administrativní jednoduchost)
  + úprava daňového mixu
```

Rozsah je omezen na 27–55 %.

### Mezní klín

Výchozí mezní klín je **45,1 %**. Vyjadřuje, jaká část dodatečných nákladů práce se ztratí na daních, odvodech a konstrukci podpor.

```text
marginalWedge =
  45,1
  + 0,72 × (modelový průměrný klín − 41,2)
  + 0,04 × (50 − administrativní jednoduchost)
  + úprava dávkové pasti
```

Z dalších 10 000 Kč nákladů práce zůstane:

```text
successKeep = 10 000 × (1 − marginalWedge / 100)
```

### Daňová kvóta

Výchozí hodnota je 34 % HDP. Model ji posouvá podle preference přerozdělování a ekonomické svobody:

```text
taxQuota = 34
  + 0,18 × (přerozdělování − 50)
  + 0,04 × (50 − ekonomická svoboda)
```

Rozsah je 26,5–44 % HDP.

### Cenová daňová složka

Česká základní sazba DPH je 21 % a snížená sazba 12 %. Model používá efektivní scénářovou cenovou daňovou složku ukotvenou na 15 %, protože spotřební koš kombinuje různé sazby a položky mimo DPH. Nejde o výpočet skutečné efektivní sazby konkrétní rodiny.

- Evropská komise: VAT rates.  
  https://taxation-customs.ec.europa.eu/taxation/vat/vat-directive/vat-rates_en

## 6. Měsíční účet

```text
mandatoryLevies = labourCost × grossLabourLevyRate
cashAfterState  = labourCost − mandatoryLevies + cashSupport
ownChoiceCash   = cashAfterState − essentialPrivateCosts
purchasePower   = ownChoiceCash / (1 + consumptionRate)
```

Výsledek zobrazuje odděleně:

- povinné odvody;
- hotovostní dávky a bonusy;
- peníze pod vlastní kontrolou;
- cenové daně ve vlastní spotřebě;
- kupní sílu;
- modelovou užitnou hodnotu veřejných služeb;
- soukromé náklady na náhradu chybějících služeb.

Veřejná služba není hotovost. Peněžní ekvivalent je pouze nástroj pro porovnání scénářů.

## 7. Rozsah státu a pobídky

Rozsah státu kombinuje přerozdělování, pokrytí programů, rodinné politiky a omezení ekonomické volby.

```text
stateScope =
  0,52 × přerozdělování
  + 0,18 × pokrytí
  + 0,12 × rodinný dopad
  + 0,18 × (100 − ekonomická svoboda)
```

Index pobídky k výkonu kombinuje ekonomickou svobodu, růstový potenciál, fiskální stabilitu, jednoduchost a soukromou návratnost další práce.

## 8. Veřejné služby a přímá návratnost

```text
publicServiceValue =
  3 200
  + 105 × stateScope
  + 55 × (efficiency − 50)
  + 20 × (coverage − 50)
```

Výsledek je omezen na 2 000–18 000 Kč měsíčně. Jde o scénářový ekvivalent využitelných služeb pro modelovou domácnost.

```text
directReturn = cashSupport + publicServiceValue
returnRatio  = directReturn / mandatoryLevies
```

Poměr nezahrnuje všechny veřejné funkce, například obranu, soudnictví, makroekonomickou stabilitu nebo služby čerpané jinými generacemi. Proto není „returnRatio“ účetní návratností státu jako celku.

## 9. Soukromá náhrada služeb

Nízký rozsah a pokrytí veřejných systémů zvyšují částku, kterou domácnost vydá za soukromé pojištění, péči, vzdělávání, dopravu a jiné náhrady.

```text
privateReplacement =
  14 500
  − 125 × stateScope
  − 12 × (economicFreedom − 50)
  − 15 × (coverage − 50)
```

Rozsah je 2 200–14 500 Kč měsíčně. Tento převod je normativní scénářový předpoklad, nikoli empiricky odhadnutá česká spotřební funkce.

## 10. Desetiletý růstový scénář

Model odděluje dvě složky:

```text
marketDynamism =
  0,32 × ekonomická svoboda
  + 0,24 × růstový potenciál
  + 0,16 × fiskální stabilita
  + 0,14 × jednoduchost
  + 0,14 × (100 − přerozdělování)

publicCapital =
  0,30 × růstový potenciál
  + 0,25 × integrita
  + 0,20 × jednoduchost
  + 0,15 × pokrytí
  + 0,10 × cílení
```

Následují penalizace za mezní klín nad výchozí hodnotou, růst daňové kvóty bez odpovídající návratnosti a extrémní podfinancování základních funkcí.

Výsledek je omezen na −6 až +5 % HDP na obyvatele po deseti letech proti pokračování trendu. Nejde o ekonometrický odhad. Deklarovaná nejistota je nejméně ±2 procentní body.

## 11. Korupční a nehospodárná expozice

Míra rizika vysoce exponovaných investic a zakázek je podle integrity systému rozdělena do pásem 3–7 %, 6–10 %, 9–14 %, 13–19 % a 18–25 %.

Kombinovaná expozice na 1 mil. Kč ekonomické hodnoty:

```text
riskPerMillion =
  1 000 000
  × taxQuota
  × 20 % podíl veřejného toku s vysokou zakázkovou expozicí
  × střed rizikového pásma
```

Dvacetiprocentní podíl je otevřený modelový předpoklad. Výsledek není odhadem prokázané krádeže ani podílem celého rozpočtu.

## 12. Interpretace výsledku

Při porovnávání dvou výsledků je potřeba sledovat současně:

1. peníze pod vlastní kontrolou;
2. mezní návratnost dodatečného výkonu;
3. hodnotu veřejných služeb;
4. soukromou náhradu chybějících služeb;
5. dlouhodobý růstový scénář;
6. integritu a korupční expozici;
7. pokrytí lidí bez rezervy.

Jedna hodnota nemůže nahradit celý společenský kompromis.
