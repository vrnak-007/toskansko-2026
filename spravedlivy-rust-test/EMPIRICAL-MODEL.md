# Empirický a hodnotový model testu „Spravedlivý růst: kdo opravdu zaplatí?“

Verze 3.0, červenec 2026

## 1. Účel

Test je transparentně tržně-liberální scénářový simulátor. Jeho hlavní otázka není pouze „levice, nebo pravice“, ale:

1. kolik ekonomické hodnoty stát povinně převezme;
2. kolik vrátí konkrétní domácnosti v hotovosti a použitelných službách;
3. kolik peněz zůstane pod soukromou kontrolou;
4. kolik domácnost udrží z další práce, podnikání a investice;
5. zda se zdanění firem, vysokých příjmů a mobilního kapitálu přenese na zaměstnance, zákazníky a investice.

Model je záměrně kritický k plošnému přerozdělování, vysokým mezním sazbám, dotacím, výjimkám a politicky přidělovanému kapitálu. Veřejné statky však nepovažuje automaticky za bezcenné.

## 2. Co je empirický údaj

Výchozí domácnost vytváří 120 000 Kč měsíčních nákladů práce a má 45 500 Kč hlavních nezbytných soukromých výdajů. Tyto dvě částky jsou didaktické předpoklady.

Empirickými kotvami jsou zejména:

- český průměrný daňový klín 41,2 % nákladů práce pro bezdětného zaměstnance na průměrné mzdě v roce 2025 podle OECD;
- mezní klín 45,1 % používaný jako výchozí návratnost další práce;
- literatura OECD o rozdílné distorznosti daňových základen;
- mikroekonomická evidence, že část firemní daně se může přenést do mezd;
- evidence behaviorální reakce vysokých příjmů a mobilního majetku na sazby.

## 3. Co je normativní a scénářový předpoklad

Následující převody nejsou pozorovanou statistikou České republiky:

- peněžní ekvivalent veřejných služeb;
- soukromý náklad náhrady chybějící služby;
- převod odpovědí na daňovou kvótu, rozsah státu a mezní klín;
- desetiletý scénář HDP;
- přenos 20–50 % dodatečného zatížení firem a mobilního kapitálu na mzdy, ceny a investice;
- korupční a nehospodárná expozice na 1 mil. Kč ekonomické hodnoty.

Tyto předpoklady jsou záměrně viditelné v kódu a nesmějí být prezentovány jako přesná předpověď.

## 4. Hlavní rovnice

### 4.1 Povinné odvody

```text
sazba odvodů
= 41,2 %
+ vliv preference přerozdělování
+ vliv administrativní složitosti
+ vliv zvoleného daňového mixu
```

Výsledek je omezen na 27–55 % nákladů práce.

```text
povinné odvody = 120 000 Kč × sazba odvodů
```

### 4.2 Peníze pod vlastní kontrolou

```text
peníze pod vlastní kontrolou
= 120 000 Kč
− povinné odvody
+ hotovostní dávky a bonusy
− 45 500 Kč nezbytných soukromých výdajů
```

Jde o hlavní rodinný ukazatel testu.

### 4.3 Návratnost dalšího výkonu

```text
mezní klín
= 45,1 %
+ změna odvodové sazby
+ administrativní náklady
+ dávková past nebo bonus za práci
```

```text
z dalších 10 000 Kč zůstane
= 10 000 Kč × (1 − mezní klín)
```

### 4.4 Veřejná protihodnota

```text
stát vrátí
= hotovostní dávky
+ modelová hodnota skutečně použitelných služeb
```

Hodnota služeb roste s dostupností, efektivitou a kvalitou institucí. Nejde o hotovost ani právní nárok.

### 4.5 Zdanění vysokých příjmů, firem a kapitálu

Test vytváří index intenzity 0–100 z odpovědí na daňový mix, zdanění firem, přerozdělování a ekonomickou svobodu.

Při intenzitě nad výchozí hodnotou 50 se vytvoří modelový objem dodatečného zatížení mobilního kapitálu a firem. Z něj se 20–50 % přenese na běžnou domácnost:

```text
nepřímý dopad
= dodatečné zatížení firem a kapitálu × 20 až 50 %
```

Kanály přenosu:

- pomalejší investice;
- nižší růst produktivity a mezd;
- vyšší ceny;
- změna sídla, právní formy nebo vykazování příjmů;
- omezení podnikatelské aktivity.

Interval 20–50 % je citlivostní pásmo. Studie Fuest, Peichl a Siegloch na německých lokálních firemních daních odhadla přibližně poloviční podíl pracovníků na břemenu. Novější skandinávská studie majetkových daní nachází významnou migraci bohatých, ale agregátní dopady na zaměstnanost, investice a přidanou hodnotu jsou menší. Proto model nepoužívá jediný univerzální koeficient.

### 4.6 Desetiletý scénář společnosti

```text
změna HDP na obyvatele
= tržní dynamika
+ produktivní veřejný kapitál
− vysoký mezní klín
− růst daňové kvóty bez protihodnoty
− intenzivní zdanění mobilního kapitálu
− extrémní podfinancování základních institucí
```

Model tedy systematicky penalizuje vysoké zdanění práce, firem a kapitálu, ale umožňuje pozitivní dopad kvalitního školství, infrastruktury, prevence a právního státu.

## 5. Co nelze vydávat za empirický zákon

Nelze poctivě tvrdit, že každé zvýšení daně nejbohatším vždy sníží příjem každého člověka. Výzkum ukazuje více mechanismů a výsledky se liší podle:

- druhu daně;
- mobility základu;
- možnosti vyhýbání se dani;
- konkurence a tržní síly;
- použití výnosu;
- kvality institucí;
- výchozí sazby a velikosti změny.

Test proto sděluje uživateli: „v tomto tržně-liberálním modelu se část účtu přenáší na všechny“, nikoli „věda dokázala, že každá daň bohatým ochudí všechny“.

## 6. Zdroje

- OECD, *Taxing Wages 2026*: https://www.oecd.org/en/publications/taxing-wages-2026_8c611f4a-en.html
- OECD, *Taxation and Economic Growth*: https://www.oecd.org/en/publications/taxation-and-economic-growth_241216205486.html
- Fuest, Peichl, Siegloch, *Do Higher Corporate Taxes Reduce Wages?*: https://pubs.aeaweb.org/doi/abs/10.1257/aer.20130570
- Jakobsen et al., *Taxing Top Wealth: Migration Responses and their Aggregate Economic Implications*: https://www.nber.org/papers/w32153
- Milligan, Smart, *Taxation and Top Incomes in Canada*: https://www.nber.org/papers/w20489
- Piketty, Saez, Stantcheva, *Optimal Taxation of Top Labor Incomes*: https://pubs.aeaweb.org/doi/abs/10.1257/pol.6.1.230
- Daniel Prokop, *Spravedlivý růst*: https://www.hostbrno.cz/spravedlivy-rust/
