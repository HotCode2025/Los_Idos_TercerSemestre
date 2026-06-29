const app = document.querySelector("#app");
const logoutBtn = document.querySelector("#logoutBtn");

let currentUser = null;
let currentGame = null;
let currentState = null;
let memoryTimer = null;
let memorySelectedOrder = [];
let hanoiSelectedTower = null;

const gameMeta = {
  ahorcado: {
    icon: "🕵️",
    tag: "Palabras",
    description: "Adiviná la palabra antes de llegar a 6 errores.",
    tip: "Probá primero vocales y letras comunes.",
  },
  auto: {
    icon: "🏎️",
    tag: "Reflejos",
    description: "Mové el auto por 3 carriles y esquivá 5 obstáculos.",
    tip: "Elegí izquierda, centro o derecha antes del choque.",
  },
  "piedra-papel-tijera": {
    icon: "⚔️",
    tag: "Estrategia rápida",
    description: "Jugá 3 rondas contra la CPU. Si empatan, hay desempate.",
    tip: "Piedra rompe tijera, tijera corta papel y papel cubre piedra.",
  },
  penales: {
    icon: "⚽",
    tag: "Precisión",
    description: "Anotá 7 goles antes de que el arquero te ataje 3 tiros.",
    tip: "Elegí el lado del tiro y mirá dónde salta el arquero.",
  },
  hanoi: {
    icon: "🗼",
    tag: "Lógica",
    description: "Mové todos los discos a la torre 3 sin romper las reglas.",
    tip: "Nunca pongas un disco grande sobre uno chico.",
  },
  memoria: {
    icon: "🧠",
    tag: "Memoria",
    description: "Recordá el orden de palabras en 4 niveles progresivos.",
    tip: "Asociá las palabras con una historia corta.",
  },
};

const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || "Error desconocido");
  return payload;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function setAuthMessage(text, type = "") {
  const msg = document.querySelector("#authMsg");
  if (!msg) return;
  msg.textContent = text;
  msg.className = `message ${type}`;
}

let authMode = "login";

function setAuthMode(mode) {
  authMode = mode;
  const isLogin = mode === "login";
  const title = document.querySelector("#authTitle");
  const description = document.querySelector("#authDescription");
  const submit = document.querySelector("#authSubmit");
  const password = document.querySelector("#password");
  const loginTab = document.querySelector("#loginModeBtn");
  const registerTab = document.querySelector("#registerModeBtn");

  if (title) title.textContent = isLogin ? "Iniciar sesión" : "Crear cuenta";
  if (description) {
    description.textContent = isLogin
      ? "Ingresá con una cuenta ya creada para continuar con tus puntajes guardados."
      : "Creá una cuenta nueva. Si el usuario ya existe y la contraseña coincide, el sistema te deja ingresar igual.";
  }
  if (submit) submit.textContent = isLogin ? "Ingresar" : "Crear cuenta";
  if (password)
    password.autocomplete = isLogin ? "current-password" : "new-password";
  loginTab?.classList.toggle("active", isLogin);
  registerTab?.classList.toggle("active", !isLogin);
  setAuthMessage("", "");
}

async function refreshUsersList() {
  const box = document.querySelector("#usersList");
  const dataList = document.querySelector("#usersDatalist");
  if (!box && !dataList) return;

  try {
    const data = await api("/api/users");
    const users = data.users || [];

    if (dataList) {
      dataList.innerHTML = users
        .map((user) => `<option value="${escapeHtml(user.username)}"></option>`)
        .join("");
    }

    if (!box) return;

    box.querySelectorAll("[data-fill-user]").forEach((button) => {
      button.addEventListener("click", () => {
        const usernameInput = document.querySelector("#username");
        if (usernameInput) usernameInput.value = button.dataset.fillUser;
        document.querySelector("#password")?.focus();
        setAuthMode("login");
      });
    });
  } catch (_) {
    if (box)
      box.innerHTML =
        '<p class="small-note">No se pudieron cargar las cuentas.</p>';
  }
}

function bindAuthForm() {
  const authForm = document.querySelector("#authForm");
  const loginModeBtn = document.querySelector("#loginModeBtn");
  const registerModeBtn = document.querySelector("#registerModeBtn");

  loginModeBtn?.addEventListener("click", () => setAuthMode("login"));
  registerModeBtn?.addEventListener("click", () => setAuthMode("register"));

  authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await auth(authMode);
  });
}

async function auth(mode) {
  const username = document.querySelector("#username")?.value.trim() || "";
  const password = document.querySelector("#password")?.value || "";
  const submit = document.querySelector("#authSubmit");

  if (!username || !password) {
    setAuthMessage("Completá usuario y contraseña.", "error");
    return;
  }

  try {
    if (submit) submit.disabled = true;
    const data = await api(`/api/${mode}`, {
      method: "POST",
      body: { username, password },
    });
    currentUser = data.user;
    setAuthMessage(data.message || "Ingreso correcto.", "ok");
    await renderDashboard();
  } catch (error) {
    setAuthMessage(error.message, "error");
    await refreshUsersList();
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function init() {
  bindAuthForm();
  setAuthMode("login");
  await refreshUsersList();

  logoutBtn.addEventListener("click", async () => {
    await api("/api/logout", { method: "POST", body: {} });
    currentUser = null;
    currentGame = null;
    currentState = null;
    logoutBtn.classList.add("hidden");
    location.reload();
  });

  try {
    const data = await api("/api/me");
    if (data.user) {
      currentUser = data.user;
      await renderDashboard();
    }
  } catch (_) {
    // Si falla, se queda en login.
  }
}

async function renderDashboard() {
  currentGame = null;
  currentState = null;
  logoutBtn.classList.remove("hidden");
  const [gamesResponse, scoresResponse] = await Promise.all([
    api("/api/games"),
    api("/api/scores"),
  ]);

  const gameCards = gamesResponse.games
    .map((game) => {
      const meta = gameMeta[game.key] || {
        icon: "🎮",
        tag: "Juego",
        description: "Juego disponible",
        tip: "",
      };
      return `
      <article class="game-card">
        <div class="game-card-icon">${escapeHtml(meta.icon)}</div>
        <span class="mini-badge">${escapeHtml(meta.tag)}</span>
        <h3>${escapeHtml(game.title)}</h3>
        <p>${escapeHtml(meta.description)}</p>
        <small>${escapeHtml(meta.tip)}</small>
        <button class="primary" data-start-game="${game.key}">Jugar</button>
      </article>
    `;
    })
    .join("");

  const summary = scoresResponse.summary.length
    ? scoresResponse.summary
        .map(
          (row) => `
      <div class="stat-line">
        <span>${escapeHtml(scoresResponse.gameTitles[row.game_key] || row.game_key)}</span>
        <strong>✅ ${row.won || 0} | ❌ ${row.lost || 0} | Mejor: ${row.best_score ?? 0}</strong>
      </div>
    `,
        )
        .join("")
    : "<p>Todavía no hay puntajes. Jugá una partida para llenar la base de datos.</p>";

  const recent = scoresResponse.scores.length
    ? scoresResponse.scores
        .slice(0, 8)
        .map(
          (row) => `
      <div class="score-line">
        <div>
          <strong>${escapeHtml(scoresResponse.gameTitles[row.game_key] || row.game_key)}</strong><br>
          <small>${escapeHtml(row.detail || "")}</small><br>
          <small>${escapeHtml(formatDateTime(row.created_at))}</small>
        </div>
        <span class="badge ${row.result === "won" ? "win" : "lost"}">${row.result === "won" ? "Ganada" : "Perdida"}</span>
      </div>
    `,
        )
        .join("")
    : "<p>Sin partidas registradas todavía.</p>";

  app.innerHTML = `
    <section class="dashboard-grid">
      <div class="panel">
        <p class="eyebrow">Hola, ${escapeHtml(currentUser.username)}</p>
        <h2>Elegí un juego</h2>
        <p>Los juegos fueron pasados de Java de consola a una aplicación web con backend Python, frontend JavaScript y base de datos SQLite.</p>
        <div class="games-grid">${gameCards}</div>
      </div>
      <aside class="panel">
        <p class="eyebrow">Base de datos</p>
        <h2>Puntajes</h2>
        <div class="stats-grid">${summary}</div>
        <h3 style="margin-top:22px">Últimas partidas</h3>
        <div class="stats-grid">${recent}</div>
      </aside>
    </section>
  `;

  document.querySelectorAll("[data-start-game]").forEach((button) => {
    button.addEventListener("click", () => openGame(button.dataset.startGame));
  });
}

function gameHeader(title) {
  const meta = gameMeta[currentGame] || { icon: "🎮", tag: "Juego", tip: "" };
  return `
    <div class="game-header">
      <div>
        <p class="eyebrow">${escapeHtml(meta.tag)}</p>
        <h2><span class="title-icon">${escapeHtml(meta.icon)}</span> ${escapeHtml(title)}</h2>
        <p class="game-tip">${escapeHtml(meta.tip)}</p>
      </div>
      <button class="ghost" id="backDashboard">Volver al menú</button>
    </div>
  `;
}

function bindBack() {
  document
    .querySelector("#backDashboard")
    ?.addEventListener("click", async () => {
      clearTimeout(memoryTimer);
      await renderDashboard();
    });
}

async function openGame(gameKey) {
  currentGame = gameKey;
  clearTimeout(memoryTimer);
  if (gameKey === "hanoi") {
    app.innerHTML = `
      <section class="panel game-layout">
        ${gameHeader("Torres de Hanoi")}
        <div class="game-board hanoi-start">
          <div class="rules-card">
            <h3>Reglas</h3>
            <p>Mové todos los discos de la Torre 1 a la Torre 3. Solo podés mover un disco a la vez, siempre el superior, y nunca podés poner un disco grande sobre uno más chico.</p>
          </div>
          <div class="actions-row">
            <label style="max-width: 180px">Discos
              <select id="diskCount">
                ${[2, 3, 4, 5, 6, 7, 8].map((n) => `<option value="${n}" ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}
              </select>
            </label>
            <button class="primary" id="startHanoi">Comenzar</button>
          </div>
        </div>
      </section>
    `;
    bindBack();
    document
      .querySelector("#startHanoi")
      .addEventListener("click", async () => {
        const n = Number(document.querySelector("#diskCount").value);
        await startGame(gameKey, { n });
      });
    return;
  }
  await startGame(gameKey, {});
}

async function startGame(gameKey, extra = {}) {
  try {
    const data = await api(`/api/games/${gameKey}/start`, {
      method: "POST",
      body: extra,
    });
    currentGame = gameKey;
    currentState = data.state;
    if (gameKey === "memoria") {
      memorySelectedOrder = [];
    }
    if (gameKey === "hanoi") {
      hanoiSelectedTower = null;
    }
    renderGame(data.title, data.state);
  } catch (error) {
    app.innerHTML = `
      <section class="panel game-layout">
        ${gameHeader("Error")}
        <p class="message error">${escapeHtml(error.message)}</p>
      </section>
    `;
    bindBack();
  }
}

async function sendGameAction(body) {
  const data = await api(`/api/games/${currentGame}/action`, {
    method: "POST",
    body: { session_id: currentState.session_id, ...body },
  });
  currentState = data.state;
  renderGame(data.title, data.state);
}

function finalBanner(state) {
  if (state.status === "won")
    return '<p class="message ok result-banner">🎉 ¡Ganaste! La partida se guardó en la base de datos.</p>';
  if (state.status === "lost")
    return '<p class="message error result-banner">💀 Perdiste. La partida se guardó en la base de datos.</p>';
  if (state.status === "cancelled")
    return '<p class="message result-banner">Partida cancelada.</p>';
  return "";
}

function renderGame(title, state) {
  clearTimeout(memoryTimer);
  const renderers = {
    ahorcado: renderAhorcado,
    auto: renderAuto,
    "piedra-papel-tijera": renderRps,
    penales: renderPenales,
    hanoi: renderHanoi,
    memoria: renderMemory,
  };
  app.innerHTML = `
    <section class="panel game-layout">
      ${gameHeader(title)}
      ${renderers[currentGame](state)}
    </section>
  `;
  bindBack();
  bindGameEvents();
}

function renderHangmanFigure(errors) {
  const visible = (part) => (errors >= part ? "visible" : "");
  return `
    <div class="hangman-stage" aria-label="Ahorcado con ${errors} errores">
      <div class="hangman-frame base"></div>
      <div class="hangman-frame pole"></div>
      <div class="hangman-frame top"></div>
      <div class="hangman-frame rope"></div>
      <div class="person head ${visible(1)}"></div>
      <div class="person body ${visible(2)}"></div>
      <div class="person arm left ${visible(3)}"></div>
      <div class="person arm right ${visible(4)}"></div>
      <div class="person leg left ${visible(5)}"></div>
      <div class="person leg right ${visible(6)}"></div>
    </div>
  `;
}

function renderWordMask(masked) {
  return masked
    .split(" ")
    .map(
      (char) => `
    <span class="word-letter ${char === "_" ? "empty" : "revealed"}">${char === "_" ? "" : escapeHtml(char)}</span>
  `,
    )
    .join("");
}

function renderAhorcado(state) {
  const used = (state.used || []).map((letter) => String(letter).toUpperCase());
  const keyboard = alphabet
    .map((letter) => {
      const isUsed = used.includes(letter);
      return `<button class="letter-key ${isUsed ? "used" : ""}" data-letter="${letter.toLowerCase()}" ${isUsed || state.status !== "active" ? "disabled" : ""}>${letter}</button>`;
    })
    .join("");

  return `
    <div class="game-board ahorcado-board">
      <div class="ahorcado-layout">
        <div>
          ${renderHangmanFigure(state.errors)}
          <div class="attempts-track">
            ${Array.from({ length: state.max_errors }, (_, i) => `<span class="attempt-dot ${i < state.errors ? "lost" : ""}"></span>`).join("")}
          </div>
        </div>
        <div class="word-panel">
          <p class="eyebrow">Adiviná la palabra</p>
          <div class="word-mask visual-mask">${renderWordMask(state.masked)}</div>
          <p><strong>Errores:</strong> ${state.errors}/${state.max_errors}</p>
          <p><strong>Letras usadas:</strong> ${escapeHtml(state.used.join(", ") || "ninguna")}</p>
          <p class="message">${escapeHtml(state.message)}</p>
          ${finalBanner(state)}
          ${
            state.status === "active"
              ? `
            <div class="letter-keyboard">${keyboard}</div>
            <form id="letterForm" class="actions-row compact-form">
              <input id="letterInput" maxlength="1" placeholder="Otra letra" autofocus>
              <button class="primary" type="submit">Probar</button>
            </form>
          `
              : `
            <p><strong>Palabra:</strong> ${escapeHtml(state.word)}</p>
            <button class="primary" data-restart>Jugar de nuevo</button>
          `
          }
        </div>
      </div>
    </div>
  `;
}

function renderAuto(state) {
  const lanes = [0, 1, 2]
    .map(
      (lane) => `
    <div class="lane ${state.carLane === lane ? "selected-lane" : ""}">
      <span class="road-line"></span>
      ${state.obsLane === lane && state.status === "active" ? '<span class="obs">🚧</span>' : ""}
      ${state.carLane === lane ? '<span class="car">🏎️</span>' : ""}
    </div>
  `,
    )
    .join("");
  const progress = Math.min(100, (state.dodged / state.target) * 100);
  return `
    <div class="game-board racing-board">
      <div class="racing-hud">
        <div><span>Esquivados</span><strong>${state.dodged}/${state.target}</strong></div>
        <div class="progress"><span style="width:${progress}%"></span></div>
      </div>
      <div class="road">${lanes}</div>
      <p class="message">${escapeHtml(state.message)}</p>
      ${finalBanner(state)}
      ${
        state.status === "active"
          ? `
        <div class="choice-grid controls-grid">
          <button class="secondary" data-auto="a">⬅️ Izquierda</button>
          <button class="secondary" data-auto="w">⬆️ Seguir</button>
          <button class="secondary" data-auto="d">➡️ Derecha</button>
          <button class="danger" data-auto="q">Salir</button>
        </div>
      `
          : '<button class="primary" data-restart>Jugar de nuevo</button>'
      }
    </div>
  `;
}

function renderRps(state) {
  const last = state.last
    ? `
    <div class="rps-duel">
      <div class="rps-card">
        <span>${rpsIcon(state.last.player)}</span>
        <strong>Tú</strong>
        <small>${escapeHtml(state.last.player)}</small>
      </div>
      <div class="versus">VS</div>
      <div class="rps-card cpu">
        <span>${rpsIcon(state.last.cpu)}</span>
        <strong>CPU</strong>
        <small>${escapeHtml(state.last.cpu)}</small>
      </div>
    </div>
    <p class="message">${escapeHtml(state.last.outcome)}</p>
  `
    : `
    <div class="rps-duel empty-duel">
      <div class="rps-card"><span>❔</span><strong>Tú</strong><small>Elegí una jugada</small></div>
      <div class="versus">VS</div>
      <div class="rps-card cpu"><span>🤖</span><strong>CPU</strong><small>Esperando</small></div>
    </div>
  `;
  return `
    <div class="game-board rps-board">
      <div class="scoreboard">
        <div><span>Ronda</span><strong>${state.tieBreaker ? "Desempate" : state.round + "/3"}</strong></div>
        <div><span>Tú</span><strong>${state.playerScore}</strong></div>
        <div><span>CPU</span><strong>${state.cpuScore}</strong></div>
      </div>
      ${last}
      <p class="message">${escapeHtml(state.message)}</p>
      ${finalBanner(state)}
      ${
        state.status === "active"
          ? `
        <div class="choice-grid rps-actions">
          <button class="secondary" data-rps="1"><span>✊</span> Piedra</button>
          <button class="secondary" data-rps="2"><span>✋</span> Papel</button>
          <button class="secondary" data-rps="3"><span>✌️</span> Tijera</button>
        </div>
      `
          : '<button class="primary" data-restart>Jugar de nuevo</button>'
      }
    </div>
  `;
}

function rpsIcon(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("piedra")) return "✊";
  if (normalized.includes("papel")) return "✋";
  if (normalized.includes("tijera")) return "✌️";
  return "❔";
}

function renderPenales(state) {
  const lanes = [1, 2, 3]
    .map((lane) => {
      const keeperHere = state.last && state.last.keeper === laneName(lane);
      const ballHere =
        state.last && state.last.shot === laneName(lane) && !state.last.saved;
      const savedBallHere =
        state.last && state.last.keeper === laneName(lane) && state.last.saved;
      const label = laneName(lane);
      return `
      <button class="goal-lane ${state.last?.shot === label ? "shot-lane" : ""}" data-penal="${lane}" ${state.status !== "active" ? "disabled" : ""}>
        <span class="net-line"></span>
        ${keeperHere ? '<span class="keeper">🧤</span>' : ""}
        ${ballHere || savedBallHere ? '<span class="ball">⚽</span>' : ""}
        <small>${escapeHtml(label)}</small>
      </button>
    `;
    })
    .join("");
  const last = state.last
    ? `<p><strong>Tiro:</strong> ${escapeHtml(state.last.shot)} | <strong>Arquero:</strong> ${escapeHtml(state.last.keeper)}</p>`
    : "";
  return `
    <div class="game-board penalty-board">
      <div class="penalty-score">
        <div><span>Goles</span><strong>${state.goals}/7</strong></div>
        <div><span>Atajadas</span><strong>${state.saves}/3</strong></div>
      </div>
      <div class="goal">${lanes}</div>
      <div class="grass"></div>
      ${last}
      <p class="message">${escapeHtml(state.message)}</p>
      ${finalBanner(state)}
      ${state.status !== "active" ? '<button class="primary" data-restart>Jugar de nuevo</button>' : '<p class="helper-text">También podés patear tocando directamente un sector del arco.</p>'}
    </div>
  `;
}

function laneName(n) {
  return { 1: "Izquierda", 2: "Centro", 3: "Derecha" }[n];
}

function renderHanoi(state) {
  const towersHtml = state.towers
    .map((tower, index) => {
      const disks = tower
        .map((disk) => {
          const width = 28 + (disk / state.n) * 64;
          return `<div class="disk disk-${disk}" style="width:${width}%"><span>${disk}</span></div>`;
        })
        .join("");
      return `<div class="tower-wrap" data-hanoi-tower="${index + 1}"><div class="tower">${disks}</div><div class="tower-label">Torre ${index + 1}</div></div>`;
    })
    .join("");

  return `
    <div class="game-board hanoi-board">
      <div class="hanoi-stats">
        <div><span>Movimientos</span><strong>${state.moves}</strong></div>
        <div><span>Mínimo ideal</span><strong>${state.minimum}</strong></div>
      </div>
      <p class="helper-text">Click en la torre de origen y luego en la de destino.</p>
      <div class="towers">${towersHtml}</div>
      <p class="message">${escapeHtml(state.message)}</p>
      ${finalBanner(state)}
      ${state.status !== "active" ? '<button class="primary" data-restart>Jugar de nuevo</button>' : ""}
    </div>
  `;
}

function renderMemory(state) {
  if (state.status === "active") {
    return `
      <div class="game-board memory-board">
        <div class="memory-hud">
          <div><span>Nivel</span><strong>${state.level}/4</strong></div>
          <div><span>Palabras</span><strong>${state.shown.length}</strong></div>
        </div>
        <p class="message">${escapeHtml(state.message)}</p>
        <div id="memoryStage" class="memory-show"><span>Preparado...</span></div>
        <div id="memoryAnswer" class="hidden">
          <p class="helper-text">Hace click en el orden correcto de las palabras.</p>
          <div class="memory-list" id="memoryClickList">
            ${state.shuffled.map((word, index) => `<div class="memory-item clickable-item" data-index="${index}" data-word="${escapeHtml(word)}"><span>${escapeHtml(word)}</span><div class="selection-order"></div></div>`).join("")}
          </div>
          <div class="memory-actions">
            <button class="primary" id="memorySubmitOrder">Comprobar orden</button>
            <button class="secondary" id="memoryClearOrder">Limpiar selección</button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.status === "passed") {
    return `
      <div class="game-board memory-board">
        <div class="success-illustration">✨</div>
        <p class="message ok">${escapeHtml(state.message)}</p>
        <div class="choice-grid">
          <button class="primary" data-memory-action="continue">Continuar al siguiente nivel</button>
          <button class="secondary" data-memory-action="finish_after_pass">Terminar y guardar victoria</button>
        </div>
      </div>
    `;
  }

  if (state.status === "failed") {
    return `
      <div class="game-board memory-board">
        <div class="success-illustration">🧩</div>
        <p class="message error">${escapeHtml(state.message)}</p>
        <p><strong>Respuesta correcta:</strong> ${escapeHtml(state.correctAnswer)}</p>
        <div class="choice-grid">
          <button class="primary" data-memory-action="retry">Reintentar nivel</button>
          <button class="danger" data-memory-action="finish_after_fail">Terminar y guardar derrota</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="game-board memory-board">
      ${finalBanner(state)}
      <p class="message">${escapeHtml(state.message)}</p>
      <button class="primary" data-restart>Jugar de nuevo</button>
    </div>
  `;
}

function bindGameEvents() {
  document
    .querySelector("[data-restart]")
    ?.addEventListener("click", () => openGame(currentGame));

  document
    .querySelector("#letterForm")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.querySelector("#letterInput");
      await sendGameAction({ letter: input.value });
    });

  document.querySelectorAll("[data-letter]").forEach((button) => {
    button.addEventListener("click", () =>
      sendGameAction({ letter: button.dataset.letter }),
    );
  });

  document.querySelectorAll("[data-auto]").forEach((button) => {
    button.addEventListener("click", () =>
      sendGameAction({ move: button.dataset.auto }),
    );
  });

  document.querySelectorAll("[data-rps]").forEach((button) => {
    button.addEventListener("click", () =>
      sendGameAction({ choice: Number(button.dataset.rps) }),
    );
  });

  document.querySelectorAll("[data-penal]").forEach((button) => {
    button.addEventListener("click", () =>
      sendGameAction({ shot: Number(button.dataset.penal) }),
    );
  });

  if (currentGame === "hanoi" && currentState?.status === "active") {
    bindHanoiTowers();
  }

  if (currentGame === "memoria" && currentState?.status === "active") {
    playMemorySequence(currentState.shown);
    bindMemoryClickableItems();
  }

  document
    .querySelector("#memorySubmitOrder")
    ?.addEventListener("click", async () => {
      const order = memorySelectedOrder.map((index) => index + 1).join(" ");
      await sendGameAction({ action: "submit", order: order });
    });

  document.querySelector("#memoryClearOrder")?.addEventListener("click", () => {
    memorySelectedOrder = [];
    document.querySelectorAll(".clickable-item").forEach((item) => {
      item.classList.remove("selected");
      item.querySelector(".selection-order").textContent = "";
    });
  });

  document.querySelectorAll("[data-memory-action]").forEach((button) => {
    button.addEventListener("click", () =>
      sendGameAction({ action: button.dataset.memoryAction }),
    );
  });
}

function playMemorySequence(words) {
  const stage = document.querySelector("#memoryStage");
  const answer = document.querySelector("#memoryAnswer");
  if (!stage || !answer) return;
  let index = -3;
  const tick = () => {
    if (!document.body.contains(stage)) return;
    if (index < 0) {
      stage.innerHTML = `<span class="countdown-number">${Math.abs(index)}</span>`;
      index += 1;
      memoryTimer = setTimeout(tick, 700);
      return;
    }
    if (index < words.length) {
      stage.innerHTML = `<span class="memory-word"><small>${index + 1}</small>${escapeHtml(words[index])}</span>`;
      index += 1;
      memoryTimer = setTimeout(tick, 850);
      return;
    }
    stage.innerHTML = "<span>Ahora hace click en el orden correcto</span>";
    memorySelectedOrder = [];
    answer.classList.remove("hidden");
  };
  tick();
}

function bindMemoryClickableItems() {
  document.querySelectorAll(".clickable-item").forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number(item.dataset.index);
      if (memorySelectedOrder.includes(index)) {
        memorySelectedOrder = memorySelectedOrder.filter((i) => i !== index);
        item.classList.remove("selected");
        item.querySelector(".selection-order").textContent = "";
        updateAllOrderNumbers();
      } else {
        memorySelectedOrder.push(index);
        item.classList.add("selected");
        updateAllOrderNumbers();
      }
    });
  });
}

function bindHanoiTowers() {
  clearHanoiSelection();
  document.querySelectorAll("[data-hanoi-tower]").forEach((towerEl) => {
    towerEl.addEventListener("click", async () => {
      const towerId = Number(towerEl.dataset.hanoiTower);
      if (!hanoiSelectedTower) {
        hanoiSelectedTower = towerId;
        towerEl.classList.add("selected-tower");
        return;
      }

      if (hanoiSelectedTower === towerId) {
        clearHanoiSelection();
        return;
      }

      const source = hanoiSelectedTower;
      const target = towerId;
      clearHanoiSelection();
      await sendGameAction({ source, target });
    });
  });
}

function clearHanoiSelection() {
  hanoiSelectedTower = null;
  document
    .querySelectorAll("[data-hanoi-tower].selected-tower")
    .forEach((item) => {
      item.classList.remove("selected-tower");
    });
}

function updateAllOrderNumbers() {
  document.querySelectorAll(".clickable-item").forEach((item) => {
    const index = Number(item.dataset.index);
    const position = memorySelectedOrder.indexOf(index);
    if (position >= 0) {
      item.querySelector(".selection-order").textContent = position + 1;
    } else {
      item.querySelector(".selection-order").textContent = "";
    }
  });
}

init();
