(() => {
  "use strict";

  const CONFIG_PATH = "./analytics-config.json";
  const API_QUERY_KEY = "analyticsApi";
  const PARTICIPANT_KEY = "spravedlivy_rust_participant_v1";
  if (!document.querySelector('link[href$="analytics.css"]')) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "./analytics.css";
    document.head.appendChild(style);
  }

  if (!document.querySelector('meta[name="referrer"]')) {
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);
  }

  let config = null;
  let apiBase = "";
  let serviceReady = false;
  let consentedAt = null;
  let runId = uuid();
  let lastResult = null;
  let consentInput = null;
  let consentNote = null;
  let statusBox = null;

  init().catch(() => {
    injectUi();
    setServiceState(false, "Statistická služba není dostupná; test funguje bez odesílání dat.");
  });

  async function init() {
    config = await loadConfig();
    apiBase = resolveApiBase(config.apiBase);
    injectUi();

    if (!apiBase) {
      setServiceState(false, "Statistický sběr zatím není aktivní; test se vyhodnotí pouze v tomto prohlížeči.");
      return;
    }

    updateLinkedUrls();
    try {
      const health = await request("/health", { method: "GET" }, false);
      if (!health.ok || health.consentVersion !== config.consentVersion) {
        throw new Error("Nesoulad verze souhlasu.");
      }
      serviceReady = true;
      setServiceState(true, `Dobrovolný sběr je aktivní. Uchování nejvýše ${Number(config.retentionDays || 365)} dní.`);
    } catch {
      setServiceState(false, "Statistická služba nyní neodpovídá; žádná data se neodešlou.");
    }
  }

  async function loadConfig() {
    const response = await fetch(CONFIG_PATH, { cache: "no-store", credentials: "omit" });
    if (!response.ok) throw new Error("Konfiguraci statistik nelze načíst.");
    const body = await response.json();
    return {
      apiBase: typeof body.apiBase === "string" ? body.apiBase : "",
      consentVersion: String(body.consentVersion || "2026-07-16-v1"),
      quizVersion: String(body.quizVersion || "1.1"),
      retentionDays: Number(body.retentionDays || 365)
    };
  }

  function resolveApiBase(configured) {
    const url = new URL(window.location.href);
    const supplied = url.searchParams.get(API_QUERY_KEY);
    return normalizeApiBase(supplied || configured || "");
  }

  function normalizeApiBase(value) {
    if (!value) return "";
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "https:") return "";
      return parsed.origin + parsed.pathname.replace(/\/$/, "");
    } catch {
      return "";
    }
  }

  function injectUi() {
    const startCard = document.querySelector("#introPanel .start-card");
    consentInput = document.getElementById("analyticsConsent");
    consentNote = document.getElementById("analyticsServiceNote");

    if (!consentInput && startCard) {
      const existingFineprint = startCard.querySelector(".fineprint");
      if (existingFineprint) {
        existingFineprint.textContent = "Bez souhlasu zůstávají odpovědi pouze v tomto prohlížeči. Se souhlasem se po dokončení odešle jeden pseudonymní statistický záznam.";
      }
      const consent = document.createElement("div");
      consent.className = "analytics-consent";
      consent.innerHTML = `
        <label>
          <input id="analyticsConsent" type="checkbox" disabled>
          <span><strong>Výslovně souhlasím</strong> s uložením tohoto výsledku pro neveřejné statistiky. Výsledek může vypovídat o mých politických názorech. Uloží se zvolené odpovědi, výsledkové ukazatele, čas a pseudonymní identifikátor pro rozpoznání opakovaných průchodů. Surová IP adresa se do aplikační databáze neukládá. <a class="privacy-link" href="./privacy.html">Podrobnosti a výmaz údajů</a>.</span>
        </label>
        <small id="analyticsServiceNote" class="analytics-service-note">Ověřuji dostupnost statistické služby…</small>`;
      const startButton = document.getElementById("startBtn");
      if (startButton) startButton.insertAdjacentElement("afterend", consent);
      else startCard.appendChild(consent);
      consentInput = document.getElementById("analyticsConsent");
      consentNote = document.getElementById("analyticsServiceNote");
    }

    if (consentInput && consentInput.dataset.analyticsBound !== "1") {
      consentInput.dataset.analyticsBound = "1";
      consentInput.addEventListener("change", () => {
        consentedAt = consentInput.checked ? new Date().toISOString() : null;
      });
    }

    const introPanel = document.getElementById("introPanel");
    if (introPanel && !introPanel.querySelector(".analytics-small-link")) {
      const smallLink = document.createElement("div");
      smallLink.className = "analytics-small-link";
      smallLink.innerHTML = '<a class="stats-link" href="./stats/" rel="nofollow">statistiky vyplnění</a>';
      introPanel.appendChild(smallLink);
    }

    statusBox = document.getElementById("analyticsStatus");
    const actions = document.querySelector("#resultPanel .actions");
    if (!statusBox && actions) {
      statusBox = document.createElement("div");
      statusBox.id = "analyticsStatus";
      statusBox.className = "analytics-result-status";
      statusBox.setAttribute("role", "status");
      statusBox.setAttribute("aria-live", "polite");
      actions.insertAdjacentElement("afterend", statusBox);
    }

    const restartButton = document.getElementById("restartBtn");
    if (restartButton && restartButton.dataset.analyticsBound !== "1") {
      restartButton.dataset.analyticsBound = "1";
      restartButton.addEventListener("click", resetRun);
    }
    if (!window.__spravedlivyRustAnalyticsBound) {
      window.__spravedlivyRustAnalyticsBound = true;
      window.addEventListener("spravedlivy-rust:completed", event => {
        lastResult = event.detail;
        handleCompletion(event.detail).catch(() => {
          showStatus("error", 'Výsledek se do statistik nepodařilo uložit. Test je jinak dokončen; <a class="privacy-link" href="./privacy.html">informace o zpracování</a>.');
        });
      });
    }
  }

  function setServiceState(active, message) {
    serviceReady = active;
    if (consentInput) {
      consentInput.disabled = !active;
      if (!active) {
        consentInput.checked = false;
        consentedAt = null;
      }
    }
    if (consentNote) consentNote.textContent = message;
    updateLinkedUrls();
  }

  function updateLinkedUrls() {
    const suffix = apiBase ? `?${API_QUERY_KEY}=${encodeURIComponent(apiBase)}` : "";
    document.querySelectorAll("a.stats-link").forEach(link => { link.href = `./stats/${suffix}`; });
    document.querySelectorAll("a.privacy-link").forEach(link => { link.href = `./privacy.html${suffix}`; });
  }

  async function handleCompletion(result) {
    if (!consentInput?.checked || !consentedAt) {
      showStatus("off", 'Výsledek nebyl odeslán. Statistiky jsou dobrovolné; <a class="privacy-link" href="./privacy.html">informace o zpracování</a>.');
      updateLinkedUrls();
      return;
    }
    if (!serviceReady || !apiBase) {
      showStatus("error", "Souhlas byl zvolen, ale statistická služba není dostupná. Výsledek nebyl odeslán.");
      return;
    }

    const participantId = getOrCreateParticipantId();
    showStatus("sending", "Ukládám samostatný pseudonymní záznam tohoto dokončení…");

    const payload = {
      submissionId: runId,
      participantId,
      completedAt: String(result.completedAt || new Date().toISOString()),
      consentedAt,
      consent: true,
      consentVersion: config.consentVersion,
      result: { ...result, quizVersion: config.quizVersion }
    };

    const response = await request("/v1/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(response.error || "Uložení selhalo.");
    showStatus(
      "sent",
      `Výsledek byl uložen jako samostatný pseudonymní záznam <strong>${escapeHtml(response.submissionId.slice(0, 8))}</strong>. Opakované vyplnění vytvoří další řádek. <a class="privacy-link" href="./privacy.html">Odvolání souhlasu a výmaz</a>.`
    );
    updateLinkedUrls();
  }

  function getOrCreateParticipantId() {
    try {
      let value = localStorage.getItem(PARTICIPANT_KEY);
      if (!isUuid(value)) {
        value = uuid();
        localStorage.setItem(PARTICIPANT_KEY, value);
      }
      return value;
    } catch {
      throw new Error("Pro pseudonymní statistiku musí být dostupné místní úložiště prohlížeče.");
    }
  }

  async function request(path, options = {}, includeOriginHeaders = true) {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      headers: { ...(options.headers || {}), ...(includeOriginHeaders ? {} : {}) }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || body.error || `HTTP ${response.status}`);
    return body;
  }

  function showStatus(state, html) {
    if (!statusBox) return;
    statusBox.dataset.state = state;
    statusBox.innerHTML = html;
    updateLinkedUrls();
  }

  function resetRun() {
    runId = uuid();
    lastResult = null;
    consentedAt = null;
    if (consentInput) consentInput.checked = false;
    if (statusBox) {
      statusBox.removeAttribute("data-state");
      statusBox.textContent = "";
    }
  }

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }

  function isUuid(value) {
    return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  }
})();
