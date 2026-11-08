"use strict";
/* Kern des Spiels: Speicherstand, Navigation, Titel, Einleitung, Karte, Sieg. */
const Game = (() => {
  const KEY = "hz-save-v1";
  const LEVELS = ["Bauernhof", "Europapark", "Zauber-Schule", "Backwelt", "Fee-Schloss"];
  const defaults = { bonus: {}, introSeen: false, stars: [false, false, false, false, false], sound: true, horse: Object.assign({}, Art.HORSE_DEFAULT) };
  let state = JSON.parse(JSON.stringify(defaults));
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (saved.horse && !saved.horse.tail) saved.horse.tail = saved.horse.mane;
    Object.assign(state, saved);
    state.horse = Object.assign({}, Art.HORSE_DEFAULT, state.horse);
    while (state.stars.length < 5) state.stars.push(false);
  } catch (e) { /* ohne Speicher spielen */ }
  /* Zum Testen: ?alle schaltet alle Etappen frei */
  const ALL = /[?&]alle\b/.test(location.search);
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
  /* Schrift in der Sprechblase verkleinern, bis der Text ganz hineinpasst */
  const fitBubble = (b) => {
    b.style.fontSize = ""; b.style.lineHeight = "";
    let f = 15.5;
    while (b.scrollHeight > b.clientHeight + 1 && f > 12) { f -= 0.5; b.style.fontSize = f + "px"; b.style.lineHeight = Math.round(f * 1.22) + "px"; }
  };
  const say = (text) => {
    lastText = text;
    const b = $("#bubble");
    if (b) { b.textContent = text; fitBubble(b); }
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
  /* Saubere Markierungen: immer in einer eigenen obersten Ebene, unabhängig von Skalierung */
  const NS = "http://www.w3.org/2000/svg";
  const fx = (svg) => {
    let g = svg.querySelector(":scope > g.fx");
    if (!g) { g = document.createElementNS(NS, "g"); g.setAttribute("class", "fx"); svg.appendChild(g); }
    return g;
  };
  const boxOf = (svg, el) => {
    const r = el.getBoundingClientRect();
    const m = svg.getScreenCTM().inverse();
    const a = new DOMPoint(r.left, r.top).matrixTransform(m);
    const b = new DOMPoint(r.right, r.bottom).matrixTransform(m);
    return { cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, w: b.x - a.x, h: b.y - a.y };
  };
  const radius = (b) => Math.max(18, Math.min(34, Math.max(b.w, b.h) / 2 + 5));
  const markFound = (svg, cx, cy, r) => {
    const bx = cx + r * 0.72, by = cy - r * 0.72;
    fx(svg).insertAdjacentHTML("beforeend", `<g class="found-mark" style="transform-origin:${cx.toFixed(1)}px ${cy.toFixed(1)}px">
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="#fff" stroke-width="7" stroke-opacity=".85"/>
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="#2F8F46" stroke-width="3.5"/>
<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="9.5" fill="#2F8F46" stroke="#fff" stroke-width="2"/>
<path d="M${(bx - 4.4).toFixed(1)} ${by.toFixed(1)}l3 3 5.6-6.2" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  };
  const markEl = (svg, el) => {
    if (el._hint) { el._hint.remove(); el._hint = null; }
    if (el.dataset.mark) { const [cx, cy, r] = el.dataset.mark.split(",").map(Number); markFound(svg, cx, cy, r); return; }
    const b = boxOf(svg, el.querySelector(".item") || el);
    markFound(svg, b.cx, b.cy, radius(b));
  };
  const hintEl = (svg, el) => {
    if (el._hint) el._hint.remove();
    let b, r;
    if (el.dataset.mark) { const [cx, cy, rr] = el.dataset.mark.split(",").map(Number); b = { cx, cy }; r = rr + 3; }
    else { b = boxOf(svg, el.querySelector(".item") || el); r = radius(b) + 3; }
    fx(svg).insertAdjacentHTML("beforeend", `<circle class="hint-ring" cx="${b.cx.toFixed(1)}" cy="${b.cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="#B8326F" stroke-width="3.5" stroke-dasharray="6 5"/>`);
    const ring = fx(svg).lastElementChild;
    el._hint = ring;
    el.classList.add("pulse");
    setTimeout(() => { ring.remove(); if (el._hint === ring) el._hint = null; el.classList.remove("pulse"); }, 3500);
  };
  const ripple = (svg, x, y) => {
    fx(svg).insertAdjacentHTML("beforeend", `<circle class="ripple" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" style="transform-origin:${x.toFixed(1)}px ${y.toFixed(1)}px"/>`);
    const c = fx(svg).lastElementChild;
    setTimeout(() => c.remove(), 550);
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
    if ($("#bubble")) fitBubble($("#bubble"));
    if (s.mount) s.mount(el);
  };

  /* ---------- Titel ---------- */
  screens.title = () => ({
    cls: "title",
    html: `<div class="head"><h1>Hannah und der Zauberstern</h1><p>Hilf Mina, die fünf Sternstücke zu finden!</p></div>
<div class="art">${Art.titleScene(state.horse)}</div>
<div class="foot"><button class="btn big" id="play">${state.introSeen ? "Weiterspielen" : "Los geht's"}</button><div class="stars-line">${starsRow()}<span>${state.stars.filter(Boolean).length} von 5 Sternstücken</span></div>
${state.introSeen ? `<button class="link-btn small" id="reset">Neu beginnen</button>` : ""}</div>`,
    mount(el) {
      $("#play", el).onclick = () => { sfx("tap"); go(state.introSeen ? "map" : "intro", { i: 0 }); };
      if ($("#reset", el)) $("#reset", el).onclick = () => { sfx("tap"); go("reset"); };
    },
  });

  /* ---------- Neu beginnen ---------- */
  screens.reset = () => ({
    cls: "reset",
    html: `<h1>Neu beginnen?</h1><div class="art">${Art.brokenStar()}</div>
${minaRow("Willst du das ganze Abenteuer nochmal von vorne spielen? Dann sind alle Sternstücke und Cheyennes Farben weg.")}
<div class="actions col"><button class="btn" id="no">Nein, weiterspielen</button><button class="btn ghost" id="yes">Ja, von vorne spielen</button></div>`,
    mount(el) {
      $("#no", el).onclick = () => { sfx("tap"); go("title"); };
      $("#yes", el).onclick = () => {
        const sound = state.sound;
        Object.assign(state, JSON.parse(JSON.stringify(defaults)), { sound, horse: Object.assign({}, Art.HORSE_DEFAULT) });
        save();
        sfx("ok");
        go("title");
      };
    },
  });

  /* ---------- Einleitung ---------- */
  const SLIDES = [
    { art: () => Art.titleScene(state.horse), text: "Hallo Hannah! Ich bin Mina, eine kleine Fee. Schön, dass du da bist!" },
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
  const ENTRY = ["l1search", "l2find", "l3potion", "l4dough", "l5maze"];
  const isOpen = (i) => ENTRY[i] && (ALL || i === 0 || state.stars[i - 1] || state.stars[i]);
  screens.map = () => {
    const nodes = NODES.map(([x, y], i) => {
      const done = state.stars[i];
      const open = isOpen(i) && !done;
      const locked = !isOpen(i) && !done;
      return `<button class="node ${done ? "done" : ""} ${open ? "open" : ""} ${locked ? "locked" : ""}" style="left:${x}%;top:${y}%" data-level="${i}" aria-label="Level ${i + 1}: ${LEVELS[i]}${locked ? ", noch gesperrt" : ""}">
<span class="disc">${locked ? lockSvg : done ? "★" : i + 1}</span><span class="lbl">${LEVELS[i]}</span></button>`;
    }).join("");
    const next = state.stars.findIndex((s) => !s);
    const MAPTEXT = [
      "Tippe auf die 1, dann geht's los. Auf dem Bauernhof wartet Cheyenne!",
      "Ein Sternstück leuchtet schon! Tippe auf die 2, wir fahren in den Europapark.",
      "Zwei Sternstücke! Tippe auf die 3. In der Zauber-Schule wird gerechnet.",
      "Drei Sternstücke! Tippe auf die 4. In der Backwelt duftet es schon nach Kuchen.",
      "Vier Sternstücke! Tippe auf die 5. Das Fee-Schloss wartet auf uns!",
    ];
    const text = next === -1 ? "Alle Sternstücke gefunden! Tippe auf eine Etappe, um sie nochmal zu spielen." : MAPTEXT[next];
    const pos = next === -1 ? 4 : next;
    const [hx, hy] = NODES[pos];
    return {
      cls: "map",
      html: `${top("Hannahs Reise")}
<div class="map-art"><svg class="path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M28 82C50 80 80 76 70 64C60 52 20 58 30 47C38 38 78 42 70 31C62 20 34 24 42 13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 9" vector-effect="non-scaling-stroke" opacity=".9"/></svg>
${nodes}<button class="bonus-btn" data-act="bonus"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><polygon points="${Art.starPts(10)}" transform="translate(12 12)" fill="url(#g-star)" stroke="#D99A1E" stroke-width="1.2"/></svg><span>Bonus:<br>Rechnen</span></button><div class="map-hanna" style="left:${hx + (hx < 50 ? -17 : 17)}%;top:${hy + 6}%">${Art.hanna()}</div></div>
${minaRow(text)}`,
      mount(el) {
        $(".bonus-btn", el).onclick = () => { sfx("tap"); go("bonus"); };
        el.querySelectorAll(".node").forEach((n) => {
          n.onclick = () => {
            const i = +n.dataset.level;
            if (isOpen(i)) { sfx("tap"); go(ENTRY[i]); }
            else if (!ENTRY[i]) { sfx("miss"); say(`${LEVELS[i]}: Diese Etappe bauen wir gerade. Bald geht es weiter!`); }
            else { sfx("miss"); say(`Zuerst brauchen wir das Sternstück aus Level ${i}. Dann geht es hier weiter!`); }
          };
        });
      },
    };
  };

  /* ---------- Sieg ---------- */
  const WINTEXT = [
    "Das hast du toll gemacht, Hannah! Das erste Sternstück leuchtet wieder.",
    "Juhu, was für ein Tag im Europapark! Das zweite Sternstück ist gefunden.",
    "Du bist eine echte Rechen-Zauberin! Das dritte Sternstück funkelt.",
    "Mmh, das duftet! Das vierte Sternstück ist gefunden.",
    "Der Zauberstern ist wieder ganz! Danke, Hannah, du bist die Beste!",
  ];
  screens.win = ({ level = 0 }) => ({
    cls: "win",
    html: `<h1>Sternstück gefunden!</h1><div class="art">${Art.winScene(state.horse)}</div>
${minaRow(WINTEXT[level])}
<button class="btn big" id="back">Zur Karte</button>`,
    mount(el) {
      state.stars[level] = true; save();
      sfx("win"); confetti(el);
      $("#back", el).onclick = () => go("map");
    },
  });

  /* Auf Tablets und großen Bildschirmen die ganze Spielfläche gleichmäßig vergrößern */
  const BASE_W = 440, BASE_H = 700, MAX_W = 560;
  const fit = () => {
    const app = $("#app");
    const W = window.innerWidth, H = window.innerHeight;
    const s = Math.max(1, Math.min(2.4, W / BASE_W, H / BASE_H));
    if (s <= 1.02) { app.removeAttribute("style"); document.body.classList.remove("scaled"); return; }
    const bw = Math.min(MAX_W, W / s), bh = H / s;
    document.body.classList.add("scaled");
    Object.assign(app.style, { position: "absolute", top: "0", left: `${(W - bw) / 2}px`, width: `${bw}px`, height: `${bh}px`, maxWidth: "none", margin: "0", transformOrigin: "50% 0", transform: `scale(${s})` });
  };
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", () => setTimeout(fit, 200));

  const start = () => {
    fit();
    document.body.insertAdjacentHTML("afterbegin", Art.defs());
    go("title");
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { const b = $("#bubble"); if (b) fitBubble(b); });
  };

  return { markFound, markEl, hintEl, ripple, ALL, state, save, screens, go, say, speak, sfx, start, top, steps, minaRow, svgPoint, confetti, $, speakerSvg, LEVELS };
})();
