# Spravedlivý růst – analytické API

Cloudflare Worker + D1 pro dobrovolný sběr výsledků testu a neveřejný manažerský přehled.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vrnak-007/toskansko-2026/tree/main/spravedlivy-rust-test/analytics-worker)

## Nasazení

1. Otevřete tlačítko **Deploy to Cloudflare** a přihlaste se nebo vytvořte účet Cloudflare.
2. Zadejte dva různé náhodné tajné údaje:
   - `ADMIN_TOKEN`: alespoň 32 znaků; slouží k otevření dashboardu.
   - `PSEUDONYM_KEY`: alespoň 64 znaků; slouží výhradně k HMAC pseudonymizaci.
3. Cloudflare automaticky vytvoří D1 databázi a nasadí Worker.
4. Otevřete kořenovou adresu nového Workeru. Zobrazí hotový odkaz na test se zapnutým sběrem a odkaz na manažerský přehled.

Adresa API není tajná. Tajný je pouze `ADMIN_TOKEN` a `PSEUDONYM_KEY`.

## Datový model a ochrana údajů

- Každé dokončení má samostatné UUID a samostatný řádek.
- Opakované průchody se spojují pseudonymním aliasem.
- Prohlížeč vytváří náhodné UUID až po výslovném souhlasu; databáze ukládá pouze HMAC-SHA-256 otisk s tajným serverovým klíčem.
- Worker nečte ani neukládá surovou IP adresu, geolokaci, user-agent nebo fingerprint zařízení.
- Záznam se přijme jen s aktuální verzí výslovného souhlasu.
- Endpoint `/v1/withdraw` odstraní všechny záznamy spojené s místním pseudonymem.
- Denní cron odstraňuje záznamy starší než 365 dní.
- CORS je omezen na `https://vrnak-007.github.io`.
- Správní přehled vyžaduje bearer token a neukládá jej do URL.

## Endpointy

- `GET /` – instalační stránka s hotovými odkazy
- `GET /health` – kontrola služby a verze souhlasu
- `POST /v1/submissions` – uložení jednoho dokončení
- `POST /v1/withdraw` – výmaz všech dokončení místního pseudonymu
- `GET /v1/admin/dashboard` – agregace, analýza a detailní řádky
- `DELETE /v1/admin/submissions/:id` – výmaz jednoho dokončení

## Lokální kontrola

```bash
npm install
cp .dev.vars.example .dev.vars
npm run check
npm run dev
```

Skutečné hodnoty v `.dev.vars` se nesmějí commitovat.
