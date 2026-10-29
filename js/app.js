"use strict";
/* Kern des Spiels: Speicherstand, Navigation, Titel, Einleitung, Karte, Sieg. */
const Game = (() => {
  const KEY = "hz-save-v1";
  const LEVELS = ["Bauernhof", "Europapark", "Zauber-Schule", "Backwelt", "Fee-Schloss"];
  const defaults = { introSeen: false, stars: [false, false, false, false, false], sound: true, horse: { body: "#8A552B", mane: "#3B2314" } };
  let state = JSON.parse(JSON.stringify(defaults));
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { /* ohne Speicher spielen */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* egal */ } };

  const screens = {};
  const $ = (sel, el = document) => el.querySelector(sel);

  /* ---------- Ton ---------- */
  let ctx = null;
  const sfx = (kind) => {
    if (!state.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { find: [660, 880], ok: [523, 659, 784], win: [523, 659, 784, 1047], miss: [220], tap: [440] }[kind] || [440];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = kind === "miss" ? "triangle" : "sine";
        o.frequency.value = f;
        const t = ctx.currentTime + i * 0.11;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.3);
      });
    } catch (e) { /* kein Ton */ }
  };
  let lastText = "";
  const speak = (text) => {
    if (!state.sound || !("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-AT"; u.rate = 0.95; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) { /* egal */ }
  };
  const say = (text) => {
    lastText = text;
    const b = $("#bubble");
    if (b) b.textContent = text;
  };

  /* ---------- Bausteine ---------- */
  const speakerSvg = (c = "#fff") => `<svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10 H8 L13 5 V19 L8 14 H4 Z"/><path d="M16.5 9 Q19 12 16.5 15"/><path d="M19 6.5 Q23 12 19 17.5"/></svg>`;
  const soundBtn = () => `<button class="icon-btn" data-act="sound" aria-label="Ton an oder aus" aria-pressed="${state.sound}">${speakerSvg("#7A2455")}</button>`;
  const top = (label) => `<div class="top"><div class="chip">${label}</div>${soundBtn()}</div>`;
  const steps = (now, total, label) => `<div class="steps">${Array.from({ length: total }, (_, i) => `<i class="${i < now ? "done" : i === now ? "now" : ""}"></i>`).join("")}<span>${label}</span></div>`;
  const minaRow = (text) => `<div class="mina-row"><div class="mina-ico">${Art.minaFace()}</div><div class="bubble" id="bubble">${text}</div><button class="speak" data-act="speak" aria-label="Vorlesen">${speakerSvg()}</button></div>`;
  const starsRow = () => `<svg aria-hidden="true" viewBox="0 0 130 24" width="130" height="24">${state.stars.map((on, i) => `<g transform="translate(${13 + i * 26} 12)"><polygon points="${Art.starPts(10)}" fill="${on ? "url(#g-star)" : "none"}" stroke="${on ? "#D99A1E" : "#B8326F"}" stroke-width="1.8" stroke-linejoin="round"/></g>`).join("")}</svg>`;
  const svgPoint = (svg, e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
  const confetti = (root) => {
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["#FFC93C", "#B8326F", "#6BB7E8", "#7CC05A", "#F29AC1"];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 2 + Math.random() * 2 + "s";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      box.appendChild(p);
    }
    root.appendChild(box);
    setTimeout(() => box.remove(), 5000);
  };

  const go = (name, params = {}) => {
    const s = screens[name](params);
    const app = $("#app");
    app.innerHTML = `<div class="screen ${s.cls || ""}" data-screen="${name}">${s.html}</div>`;
    const el = app.firstElementChild;
    el.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]");
      if (!act) return;
      if (act.dataset.act === "sound") {
        state.sound = !state.sound; save();
        act.setAttribute("aria-pressed", state.sound);
        if (!state.sound && "speechSynthesis" in window) speechSynthesis.cancel();
      }
      if (act.dataset.act === "speak") speak(lastText || ($("#bubble") && $("#bubble").textContent));
    });
    lastText = ($("#bubble") && $("#bubble").textContent) || "";
    if (s.mount) s.mount(el);
  };

  /* ---------- Titel ---------- */
  screens.title = () => ({
    cls: "title",
    html: `<div class="head"><h1>Hanna und der Zauberstern</h1><p>Hilf Mina, die fünf Sternstücke zu finden!</p></div>
<div class="art">${Art.titleScene(state.horse)}</div>
<div class="foot"><button class="btn big" id="play">Los geht's</button><div class="stars-line">${starsRow()}<span>${state.stars.filter(Boolean).length} von 5 Sternstücken</span></div></div>`,
    mount(el) { $("#play", el).onclick = () => { sfx("tap"); go(state.introSeen ? "map" : "intro", { i: 0 }); }; },
  });

  /* ---------- Einleitung ---------- */
  const SLIDES = [
    { art: () => Art.titleScene(state.horse), text: "Hallo Hanna! Ich bin Mina, eine kleine Fee. Schön, dass du da bist!" },
    { art: () => Art.brokenStar(), text: "Oje! Mein Zauberstern ist in fünf Stücke zerbrochen und überall verstreut." },
    { art: () => Art.titleScene(state.horse), text: "Hilfst du mir, sie zu finden? Auf dem Bauernhof geht es los. Cheyenne kommt auch mit!" },
  ];
  screens.intro = ({ i = 0 }) => ({
    cls: "intro",
    html: `${top("Einleitung")}<div class="art">${SLIDES[i].art()}</div>${minaRow(SLIDES[i].text)}
<div class="dots">${SLIDES.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
<button class="btn" id="next">${i === SLIDES.length - 1 ? "Auf zum Hof!" : "Weiter"}</button>
<button class="link-btn" id="skip">Überspringen</button>`,
    mount(el) {
      const finish = () => { state.introSeen = true; save(); go("map"); };
      $("#next", el).onclick = () => { sfx("tap"); i === SLIDES.length - 1 ? finish() : go("intro", { i: i + 1 }); };
      $("#skip", el).onclick = finish;
    },
  });

  /* ---------- Karte ---------- */
  const NODES = [[28, 82], [70, 64], [30, 47], [70, 31], [42, 13]];
  const lockSvg = `<svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  screens.map = () => {
    const firstOpen = state.stars.findIndex((s) => !s);
    const nodes = NODES.map(([x, y], i) => {
      const done = state.stars[i];
      const open = i === 0 && !done;
      const locked = i > 0 && !done;
      return `<button class="node ${done ? "done" : ""} ${open ? "open" : ""} ${locked ? "locked" : ""}" style="left:${x}%;top:${y}%" data-level="${i}" aria-label="Level ${i + 1}: ${LEVELS[i]}${locked ? ", noch gesperrt" : ""}">
<span class="disc">${locked ? lockSvg : done ? "★" : i + 1}</span><span class="lbl">${LEVELS[i]}</span></button>`;
    }).join("");
    const text = state.stars[0]
      ? "Das erste Sternstück ist gefunden! Die nächsten Etappen schalten wir bald frei."
      : "Tippe auf die 1, dann geht's los. Auf dem Bauernhof wartet Cheyenne!";
    return {
      cls: "map",
      html: `${top("Hannas Reise")}
<div class="map-art"><svg class="path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M28 82C50 80 80 76 70 64C60 52 20 58 30 47C38 38 78 42 70 31C62 20 34 24 42 13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 9" vector-effect="non-scaling-stroke" opacity=".9"/></svg>
${nodes}<div class="map-hanna" style="left:8%;top:92%">${Art.hanna()}</div></div>
${minaRow(text)}`,
      mount(el) {
        el.querySelectorAll(".node").forEach((n) => {
          n.onclick = () => {
            const i = +n.dataset.level;
            if (i === 0) { sfx("tap"); go("l1search"); }
            else { sfx("miss"); say(state.stars[i] ? "Das hast du schon geschafft!" : `${LEVELS[i]}: Diese Etappe schalten wir bald frei. Versprochen!`); }
          };
        });
      },
    };
  };

  /* ---------- Sieg ---------- */
  screens.win = ({ level = 0 }) => ({
    cls: "win",
    html: `<h1>Sternstück gefunden!</h1><div class="art">${Art.winScene(state.horse)}</div>
${minaRow("Das hast du toll gemacht, Hanna! Das erste Sternstück leuchtet wieder.")}
<button class="btn big" id="back">Zur Karte</button>`,
    mount(el) {
      state.stars[level] = true; save();
      sfx("win"); confetti(el);
      $("#back", el).onclick = () => go("map");
    },
  });

  const start = () => {
    document.body.insertAdjacentHTML("afterbegin", Art.defs());
    go("title");
  };

  return { state, save, screens, go, say, speak, sfx, start, top, steps, minaRow, svgPoint, confetti, $, speakerSvg, LEVELS };
})();
