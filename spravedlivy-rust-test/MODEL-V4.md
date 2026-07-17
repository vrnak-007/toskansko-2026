# Model verze 4.0: daně, dluh, veřejné služby a akumulace kapitálu

## Účel

Test je transparentně tržně-liberální polemika s veřejně popsanými návrhy knihy Daniela Prokopa *Spravedlivý růst*. Není neutrální volební kalkulačkou, osobním daňovým přiznáním ani makroekonomickou prognózou.

Každá z 15 otázek obsahuje:

1. parafrázi konkrétní veřejně popsané teze knihy a zdroj;
2. variantu označenou jako nejbližší této tezi;
3. tržní, centralistickou, plošnou nebo dluhovou alternativu;
4. explicitní fiskální účinky používané výpočtem.

## Oficiální vstupy

| Vstup | Hodnota | Rok | Zdroj |
|---|---:|---:|---|
| Schválený schodek státního rozpočtu | 310 mld. Kč | 2026 | Ministerstvo financí |
| Výdaje kapitoly Státní dluh | 109 966 880 286 Kč | 2026 | schválený státní rozpočet |
| Hospodařící domácnosti | 4 813 103 | 2021 | ČSÚ, Sčítání 2021 |
| Veřejné zdroje zdravotnictví | 596,1 mld. Kč | 2024 | ČSÚ |
| Kapitola školství | 268 659 913 381 Kč | 2026 | schválený státní rozpočet |
| Kapitoly vnitro a justice | 155 315 669 836 Kč | 2026 | schválený státní rozpočet |
| Kapitola doprava | 129 432 433 222 Kč | 2026 | schválený státní rozpočet |
| Medián hrubé mzdy | 44 337 Kč | 2025 | ČSÚ |
| Výchozí daňový klín | 41,2 % nákladů práce | 2025 | OECD Taxing Wages 2026 |
| Výchozí mezní klín | 45,1 % | 2025 | OECD Taxing Wages 2026 |

## Profily domácnosti

### Mediánová domácnost

- měsíční náklady práce: 60 000 Kč;
- hlavní nezbytné soukromé výdaje: 30 000 Kč;
- náklady práce jsou zaokrouhlený analytický převod mediánu hrubé mzdy 44 337 Kč po přičtení povinných nákladů zaměstnavatele.

### Rodina se dvěma příjmy

- měsíční náklady práce: 120 000 Kč;
- hlavní nezbytné soukromé výdaje: 45 500 Kč.

Nezbytné výdaje jsou didaktické předpoklady, nikoli údaj ČSÚ.

## Měsíční hotovostní účet

```text
povinné odvody = náklady práce × modelová sazba práce + jiné daně domácnosti

přímá hotovost po státu = náklady práce − povinné odvody + dávky a bonusy

hotovost pod vlastní kontrolou před incidencí
= přímá hotovost po státu
− nezbytné soukromé výdaje
− dodatečné soukromé náklady politik

hotovost pod vlastní kontrolou
= předchozí částka
± střed citlivostního přenosu daní z firem a mobilního kapitálu
```

Pro incidence daní z firem, vysokých příjmů a mobilního kapitálu se zobrazuje interval 20–50 % dodatečného výběru přeneseného na ostatní domácnosti. Hlavní výsledek používá střed 35 %. Jde o citlivostní model, nikoli český kauzální odhad.

## Dluh

Dnešní účet dluhové služby na domácnost:

```text
109 966 880 286 / 4 813 103 / 12 = 1 903,95 Kč měsíčně
```

Schválený schodek 310 mld. Kč odpovídá novému financování:

```text
310 000 000 000 / 4 813 103 / 12 = 5 367,75 Kč měsíčně na domácnost
```

Budoucí citlivostní scénář:

```text
budoucí roční dluhová služba
= dnešní dluhová služba
+ roční saldo × 10 let × 3,5 %
```

Záporné saldo znamená schodek. Výpočet předpokládá opakování stejného ročního salda deset let a průměrnou cenu nového dluhu 3,5 %. Nejde o prognózu Ministerstva financí.

## Akumulace kapitálu

Hlavní horizont je 20 let a výnos 6 % ročně s měsíční kapitalizací:

```text
FV = měsíční rozdíl × ((1 + 0,06 / 12)^240 − 1) / (0,06 / 12)
```

Příklad:

```text
3 000 Kč měsíčně → přibližně 1,386 mil. Kč za 20 let
```

Podrobnosti ukazují citlivost 4 %, 6 % a 8 %. Výsledek je nominální, před poplatky, daněmi a inflací. Pokud volba výslovně převádí část hotovosti na účet ve vlastnictví domácnosti, tento účet je přičten zvlášť; není považován za spotřebu.

## Veřejné služby: cost-based metoda

Veřejná protihodnota není odhad subjektivního užitku. Jde o průměrný účetní náklad:

```text
měsíční náklad oblasti na domácnost
= oficiální roční veřejný výdaj / 4 813 103 / 12
```

Výchozí součet čtyř oblastí je přibližně 19 900 Kč na domácnost měsíčně. Tato částka není hotovost, nárok ani tvrzení, že každá domácnost čerpá stejnou službu.

Efektivita, integrita a dostupnost jsou zobrazeny odděleně jako index dodání. Účetní náklad se tímto indexem nepřepisuje ani diskontuje.

## Vazba na knihu

Hlavní zdroj mapování otázek je rozhovor nakladatelství Host s Danielem Prokopem k vydání knihy. Další zdroje jsou veřejné rozhovory k rodičům, majetkovým daním a projekt Chytřejší daně. Test používá parafráze, nikoli dlouhé citace.

Témata: daňový mix; nízkopříjmová práce; dávky a exekuce; rodiče; bydlení; raná selekce; řízení škol; prevence; penzijní spoření; práce ve vyšším věku; migrace; fiskální motivace obcí; kapitálové výjimky; firemní investice; dluhové financování.

## Omezení

- fiskální účinky jednotlivých odpovědí jsou scénářové parametry, nikoli rozpočtové skórování Ministerstva financí;
- některé návrhy se překrývají; sazby a výdaje jsou proto kalibrovány konzervativně a omezovány rozsahem;
- rozdělení výdajů na domácnost je průměr, nikoli incidence daně ani osobní čerpání;
- 6% výnos není garantovaný;
- budoucí cena dluhu se může výrazně lišit;
- dobrovolný vzorek výsledků nebude reprezentativní pro populaci České republiky.
