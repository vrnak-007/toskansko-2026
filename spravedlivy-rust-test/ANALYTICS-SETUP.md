# Aktivace statistik testu

Zdrojový kód dashboardu a API je součástí tohoto repozitáře. GitHub Pages je statický hosting, proto ukládání používá samostatný Cloudflare Worker s databází D1.

## Jednorázová aktivace

1. Otevřete [`analytics-worker/README.md`](./analytics-worker/README.md).
2. Použijte tlačítko **Deploy to Cloudflare**.
3. Při nasazení zadejte dva odlišné náhodné tajné řetězce `ADMIN_TOKEN` a `PSEUDONYM_KEY`.
4. Po nasazení otevřete kořenovou adresu Workeru. Zobrazí se:
   - hotový odkaz na test se zapnutým sběrem;
   - odkaz na chráněný manažerský přehled;
   - kontrolní endpoint služby.

Pro zapnutí na stálé základní adrese lze později zapsat adresu Workeru do `analytics-config.json` jako `apiBase`. Bez toho funguje parametr `?analyticsApi=https://…workers.dev`, který instalační stránka Workeru vytvoří automaticky.

## Datová ochrana

Výsledek může vypovídat o politických názorech. Odesílá se pouze po samostatném výslovném souhlasu. Každé dokončení je samostatný záznam, opakování se propojuje pseudonymním HMAC otiskem a surová IP adresa se do aplikační databáze neukládá. Retence je 365 dní a účastník může ze stejného prohlížeče vymazat všechny své záznamy.
