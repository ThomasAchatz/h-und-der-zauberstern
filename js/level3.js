"use strict";
/* Level 3: Zauber-Schule. Zaubertränke (Plus und Minus bis 100), Zauberkugeln (erste Malrechnungen mit Bildern), Zauberladen (Euro und Cent).
   Orientiert am Lehrplan der Volksschule in Österreich, Ende der 2. Schulstufe. */
(() => {
  const G = Game;
  const $ = G.$;
  const LABEL = "Level 3 · Zauber-Schule";
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const MINUS = "−";
  const choices = (correct, extra) => {
    const pool = [...extra, correct + 1, correct - 1, correct + 10, correct - 10, correct + 2].filter((v) => v !== correct && v >= 0 && v <= 200);
    const out = [];
    pool.forEach((v) => { if (out.length < 2 && !out.includes(v)) out.push(v); });
    return shuffle([correct, ...out]);
  };

  /* Klassenzimmer-Hintergrund */
  const room = (inner, h = 300) => `<svg id="scene" class="scene" viewBox="0 0 360 ${h}" role="img" aria-label="Zauber-Schule">
<defs><linearGradient id="g-room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4B3B8F"/><stop offset="1" stop-color="#7B5DB5"/></linearGradient></defs>
<rect width="360" height="${h}" fill="url(#g-room)"/>
<g fill="#FFF6BF" opacity=".7"><circle cx="24" cy="26" r="1.6"/><circle cx="336" cy="22" r="1.8"/><circle cx="312" cy="60" r="1.2"/><circle cx="48" cy="70" r="1.2"/><circle cx="340" cy="120" r="1.4"/></g>
<rect y="${h - 46}" width="360" height="46" fill="#3A2A66"/><path d="M0 ${h - 46}H360" stroke="#2A1D4D" stroke-width="3"/>
${inner}</svg>`;

  /* ---------- 1) Zaubertränke: Plus und Minus ---------- */
  const T = {
    A: () => { const t = rnd(2, 8), u = rnd(1, 5), b = rnd(1, 9 - u), a = t * 10 + u; return { q: `${a} + ${b}`, r: a + b, a, b, op: "+", hint: `Rechne zuerst die Einer: ${u} + ${b} = ${u + b}. Die ${t} Zehner bleiben gleich.` }; },
    B: () => { const t = rnd(2, 9), u = rnd(5, 9), b = rnd(1, u - 1), a = t * 10 + u; return { q: `${a} ${MINUS} ${b}`, r: a - b, a, b, op: "-", hint: `Rechne die Einer: ${u} ${MINUS} ${b} = ${u - b}. Die Zehner bleiben gleich.` }; },
    C: () => { const t1 = rnd(2, 6), t2 = rnd(1, 9 - t1); return { q: `${t1 * 10} + ${t2 * 10}`, r: (t1 + t2) * 10, a: t1 * 10, b: t2 * 10, op: "+", hint: `${t1} Zehner und ${t2} Zehner sind zusammen ${t1 + t2} Zehner.` }; },
    F: () => { const t1 = rnd(2, 6), u = rnd(1, 9), t2 = rnd(1, 9 - t1), a = t1 * 10 + u, b = t2 * 10; return { q: `${a} + ${b}`, r: a + b, a, b, op: "+", hint: `Rechne nur die Zehner: ${t1} Zehner plus ${t2} Zehner. Die ${u} Einer bleiben.` }; },
    D: () => { const t = rnd(1, 8), u = rnd(5, 9), b = rnd(11 - u, 9), a = t * 10 + u; return { q: `${a} + ${b}`, r: a + b, a, b, op: "+", extra: [a + b - 10], hint: `Zuerst bis zum Zehner: ${a} + ${10 - u} = ${a + 10 - u}. Dann noch ${b - (10 - u)} dazu.` }; },
    E: () => { const t = rnd(2, 9), u = rnd(1, 4), b = rnd(u + 2, 9), a = t * 10 + u; return { q: `${a} ${MINUS} ${b}`, r: a - b, a, b, op: "-", extra: [a - b + 10], hint: `Zuerst zurück zum Zehner: ${a} ${MINUS} ${u} = ${a - u}. Dann noch ${b - u} weg.` }; },
    K: () => { const t = rnd(2, 8), u = rnd(2, 8), a = t * 10 + u, z = (t + 1) * 10; return { q: `${a} + ? = ${z}`, r: z - a, a, b: z - a, op: "?", hint: `Wie weit ist es von ${a} bis ${z}? Zähle weiter: ${a + 1}, ${a + 2} und so weiter.` }; },
  };
  const ORDER = ["A", "B", "C", "F", "D", "E", "D", "K"];
  const BOTTLE = ["#F29AC1", "#7CC05A", "#6BB7E8"];

  const blocks = (n, color, x0, y0) => {
    const tens = Math.floor(n / 10), ones = n % 10;
    let s = "";
    for (let i = 0; i < tens; i++) s += `<rect x="${x0 + i * 9}" y="${y0}" width="7" height="50" rx="1.5" fill="${color}" stroke="#fff" stroke-width=".8"/>${Array.from({ length: 9 }, (_, k) => `<path d="M${x0 + i * 9} ${y0 + 5 + k * 5}h7" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/>`).join("")}`;
    const ox = x0 + tens * 9 + 4;
    for (let i = 0; i < ones; i++) s += `<rect x="${ox + (i % 3) * 8}" y="${y0 + 26 + Math.floor(i / 3) * 8}" width="7" height="7" rx="1.2" fill="${color}" stroke="#fff" stroke-width=".8"/>`;
    return { s, w: tens * 9 + 4 + Math.min(3, ones) * 8 };
  };

  const cauldronArt = () => `
<g transform="translate(180 250)">
<ellipse cx="0" cy="8" rx="80" ry="10" fill="#000" opacity=".25"/>
<path d="M-24 0L-34 14M24 0L34 14" stroke="#2B2B2B" stroke-width="6" stroke-linecap="round"/>
<path d="M-74 -62Q-82 6 0 6Q82 6 74 -62Z" fill="#3A3A44"/>
<path d="M-60 -50Q-62 -10 -30 -4" stroke="#fff" stroke-opacity=".15" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse id="brew" cx="0" cy="-62" rx="72" ry="13" fill="#9B7BD4"/>
<ellipse cx="0" cy="-62" rx="76" ry="14" fill="none" stroke="#555560" stroke-width="7"/>
<g id="bubbles" fill="#fff" opacity=".55"><circle cx="-26" cy="-66" r="4"/><circle cx="18" cy="-64" r="3"/><circle cx="40" cy="-68" r="2.4"/></g>
<g id="sparkle" opacity="0">${[[-40, -100], [0, -120], [42, -98], [-16, -90], [24, -112]].map(([x, y]) => `<g transform="translate(${x} ${y})"><polygon points="${Art.starPts(7)}" fill="#FFE278"/></g>`).join("")}</g>
</g>`;

  G.screens.l3potion = () => {
    const tasks = ORDER.map((k) => T[k]());
    return {
      html: `${G.top(LABEL)}${G.steps(0, 3, "Zaubertränke")}
<div class="stage">${room(`
<rect x="30" y="14" width="300" height="130" rx="12" fill="#2E4A3C" stroke="#8A5A33" stroke-width="7"/>
<text id="task" x="180" y="92" text-anchor="middle" font-size="44" font-weight="600" fill="#fff" font-family="Fredoka, system-ui, sans-serif"></text>
<g id="help" opacity="0"></g>
<text id="count" x="180" y="168" text-anchor="middle" font-size="14" fill="#E8DCF7" font-family="Fredoka, system-ui, sans-serif"></text>
${cauldronArt()}`)}</div>
<div class="bottles" id="bottles"></div>
${G.minaRow("Willkommen in der Zauber-Schule! Rechne und tippe auf die Flasche mit der richtigen Zahl.")}
<div class="actions"><button class="btn ghost" id="hint">Zauberwürfel</button></div>`,
      mount(el) {
        let i = 0, wrong = 0, busy = false;
        const show = () => {
          const t = tasks[i];
          wrong = 0; busy = false;
          $("#task", el).textContent = t.q.includes("?") ? t.q : `${t.q} = ?`;
          $("#count", el).textContent = `Trank ${i + 1} von ${tasks.length}`;
          $("#help", el).setAttribute("opacity", 0);
          $("#task", el).setAttribute("y", 92); $("#task", el).setAttribute("font-size", 44);
          const cs = choices(t.r, t.extra || []);
          $("#bottles", el).innerHTML = cs.map((v, k) => `<button class="bottle" data-v="${v}" style="--c:${BOTTLE[k]}" aria-label="${v}"><svg viewBox="0 0 60 80" aria-hidden="true"><rect x="22" y="2" width="16" height="10" rx="3" fill="#C99660"/><path d="M24 12h12v12c12 4 18 14 18 26 0 16-11 28-24 28S6 66 6 50c0-12 6-22 18-26z" fill="#F3ECF7" stroke="#B9A6C6" stroke-width="2"/><path d="M9 48c6 3 36 3 42 0 1 14-9 26-21 26S8 62 9 48z" fill="${BOTTLE[k]}"/><ellipse cx="20" cy="40" rx="3" ry="7" fill="#fff" opacity=".5"/></svg><b>${v}</b></button>`).join("");
          el.querySelectorAll(".bottle").forEach((b) => (b.onclick = () => pick(b)));
        };
        const help = () => {
          const t = tasks[i];
          const A = blocks(t.a, "#FFC93C", 0, 0);
          const B = t.op === "+" ? blocks(t.b, "#F29AC1", 0, 0) : null;
          const w = A.w + (B ? B.w + 24 : 0);
          $("#help", el).innerHTML = `<g transform="translate(${180 - w * 0.65} 66) scale(1.3)">${A.s}${B ? `<text x="${A.w + 7}" y="34" font-size="18" fill="#fff">+</text><g transform="translate(${A.w + 22} 0)">${B.s}</g>` : ""}</g>`;
          $("#help", el).setAttribute("opacity", 1);
          $("#task", el).setAttribute("y", 52);
          $("#task", el).setAttribute("font-size", 34);
          G.say(t.hint); G.speak(t.hint);
        };
        const pick = (b) => {
          if (busy) return;
          const t = tasks[i];
          if (+b.dataset.v === t.r) {
            busy = true;
            b.classList.add("pour");
            G.sfx("ok");
            $("#brew", el).setAttribute("fill", b.style.getPropertyValue("--c"));
            const sp = $("#sparkle", el);
            sp.style.transition = "none"; sp.setAttribute("opacity", 1);
            requestAnimationFrame(() => { sp.style.transition = "opacity .9s"; sp.setAttribute("opacity", 0); });
            const cheer = ["Blubb! Richtig!", "Der Trank funkelt!", "Genau richtig, Hannah!", "Zauberhaft gerechnet!", "Puff! Das stimmt!"][i % 5];
            G.say(`${cheer} ${t.q.includes("?") ? `${t.a} + ${t.r} = ${t.a + t.r}` : `${t.q} = ${t.r}`}`);
            setTimeout(() => {
              i++;
              if (i < tasks.length) show();
              else {
                $("#task", el).textContent = "Alle Tränke fertig!";
                $("#task", el).setAttribute("font-size", 30);
                $("#bottles", el).innerHTML = `<button class="btn" id="next">Weiter</button>`;
                $("#hint", el).hidden = true;
                G.say("Alle acht Zaubertränke sind fertig! Jetzt kommen die Zauberkugeln.");
                G.sfx("win");
                $("#next", el).onclick = () => { G.sfx("tap"); G.go("l3book"); };
              }
            }, 1300);
          } else {
            wrong++;
            G.sfx("miss");
            b.classList.add("nope"); b.disabled = true;
            if (wrong === 1) G.say("Hoppla, das zischt! Probier eine andere Flasche. Mit dem Zauberwürfel helfe ich dir.");
            else help();
          }
        };
        $("#hint", el).onclick = () => { G.sfx("tap"); help(); };
        show();
      },
    };
  };

  /* ---------- 2) Zauberkugeln: erste Malrechnungen mit Bildern ---------- */
  const BOOK = [[2, 3], [3, 2], [4, 5], [2, 10], [5, 2], [3, 4]];
  const dotPos = (k) => {
    const P = { 2: [[-9, 0], [9, 0]], 3: [[-10, 8], [10, 8], [0, -9]], 4: [[-9, -9], [9, -9], [-9, 9], [9, 9]], 5: [[-11, -11], [11, -11], [0, 0], [-11, 11], [11, 11]] };
    if (P[k]) return P[k];
    return Array.from({ length: k }, (_, i) => [-16 + (i % 5) * 8, i < 5 ? -6 : 8]);
  };
  const orbs = (n, k) => {
    const cols = n <= 3 ? n : Math.ceil(n / 2);
    const rows = Math.ceil(n / cols);
    const R = 30;
    return Array.from({ length: n }, (_, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const inRow = r === rows - 1 ? n - cols * (rows - 1) : cols;
      const x = 180 + (c - (inRow - 1) / 2) * 80;
      const y = (rows === 1 ? 178 : 142 + r * 76);
      return `<g class="orb" data-i="${i}" transform="translate(${x} ${y})">
<ellipse cx="0" cy="${R + 4}" rx="20" ry="5" fill="#000" opacity=".25"/><path d="M-14 ${R - 4}h28l4 8h-36z" fill="#8A5A33"/>
<circle r="${R}" fill="#CFE0FF" fill-opacity=".25" stroke="#E8DCF7" stroke-width="2.5"/><circle class="glow" r="${R - 2}" fill="url(#g-glow)" opacity="0"/>
<ellipse cx="-11" cy="-14" rx="6" ry="9" fill="#fff" opacity=".35"/>
${dotPos(k).map(([dx, dy]) => `<polygon points="${Art.starPts(k > 5 ? 4.6 : 6.5)}" transform="translate(${dx} ${dy})" fill="#FFE278" stroke="#D99A1E" stroke-width=".8"/>`).join("")}
<g class="tag" opacity="0"><circle cx="${R - 4}" cy="${-R + 4}" r="12" fill="#B8326F"/><text x="${R - 4}" y="${-R + 9}" text-anchor="middle" font-size="13" font-weight="600" fill="#fff" font-family="Fredoka, system-ui, sans-serif"></text></g></g>`;
    }).join("");
  };

  G.screens.l3book = () => {
    const tasks = shuffle(BOOK.slice(0, 4)).concat(shuffle(BOOK.slice(4)));
    return {
      html: `${G.top(LABEL)}${G.steps(1, 3, "Zauberkugeln")}
<div class="stage">${room(`<rect x="30" y="14" width="300" height="70" rx="12" fill="#2E4A3C" stroke="#8A5A33" stroke-width="7"/>
<text id="task" x="180" y="48" text-anchor="middle" font-size="30" font-weight="600" fill="#fff" font-family="Fredoka, system-ui, sans-serif"></text>
<text id="sub" x="180" y="72" text-anchor="middle" font-size="14" fill="#CFE6D6" font-family="Fredoka, system-ui, sans-serif"></text>
<g id="orbs"></g>`)}</div>
<div class="bottles" id="bottles"></div>
${G.minaRow("Wie viele Sterne sind in allen Kugeln zusammen? Tippe die Kugeln an, ich zähle mit.")}
<div class="actions"><button class="btn ghost" id="hint">Tipp von Mina</button></div>`,
      mount(el) {
        let i = 0, busy = false, wrong = 0;
        const show = () => {
          const [n, k] = tasks[i];
          busy = false; wrong = 0;
          let tapped = 0;
          $("#task", el).textContent = `${n} · ${k} = ?`;
          $("#sub", el).textContent = `${n} Kugeln mit je ${k} Sternen · Aufgabe ${i + 1} von ${tasks.length}`;
          $("#orbs", el).innerHTML = orbs(n, k);
          el.querySelectorAll(".orb").forEach((o) => {
            o.onclick = () => {
              if (o.classList.contains("on")) return;
              o.classList.add("on");
              tapped++;
              $(".glow", o).setAttribute("opacity", 1);
              $(".tag", o).setAttribute("opacity", 1);
              $(".tag text", o).textContent = tapped * k;
              G.sfx("tap");
              G.say(`${tapped} mal ${k}: ${Array.from({ length: tapped }, (_, j) => (j + 1) * k).join(", ")}`);
            };
          });
          const cs = choices(n * k, [n + k, n * k + k]);
          $("#bottles", el).innerHTML = cs.map((v) => `<button class="bottle round" data-v="${v}" aria-label="${v}"><b>${v}</b></button>`).join("");
          el.querySelectorAll(".bottle").forEach((b) => (b.onclick = () => pick(b)));
        };
        const pick = (b) => {
          if (busy) return;
          const [n, k] = tasks[i];
          if (+b.dataset.v === n * k) {
            busy = true;
            b.classList.add("pour");
            G.sfx("ok");
            el.querySelectorAll(".orb .glow").forEach((g) => g.setAttribute("opacity", 1));
            G.say(`Richtig! ${n} mal ${k} sind ${n * k} Sterne.`);
            setTimeout(() => {
              i++;
              if (i < tasks.length) show();
              else {
                $("#task", el).textContent = "Alle Kugeln leuchten!";
                $("#sub", el).textContent = "";
                $("#bottles", el).innerHTML = `<button class="btn" id="next">Weiter</button>`;
                $("#hint", el).hidden = true;
                G.say("Du kannst schon Malrechnen! Jetzt gehen wir in den Zauberladen einkaufen.");
                G.sfx("win");
                $("#next", el).onclick = () => { G.sfx("tap"); G.go("l3shop", { i: 0 }); };
              }
            }, 1300);
          } else {
            wrong++;
            G.sfx("miss");
            b.classList.add("nope"); b.disabled = true;
            G.say(wrong === 1 ? `Fast! Tippe jede Kugel an. In jeder sind ${k} Sterne.` : `Zähl immer ${k} dazu: ${k}, ${2 * k} und so weiter.`);
          }
        };
        $("#hint", el).onclick = () => { G.sfx("tap"); const [, k] = tasks[i]; const t = `Tippe die Kugeln nacheinander an. Jedes Mal kommen ${k} Sterne dazu: ${k}, ${2 * k} und so weiter.`; G.say(t); G.speak(t); };
        show();
      },
    };
  };

  /* ---------- 3) Zauberladen: Euro und Cent ---------- */
  const COINS = [
    { v: 100, label: "1 €", kind: "bi" }, { v: 50, label: "50", kind: "gold" }, { v: 20, label: "20", kind: "gold" }, { v: 10, label: "10", kind: "gold" },
    { v: 5, label: "5", kind: "copper" }, { v: 2, label: "2", kind: "copper" }, { v: 1, label: "1", kind: "copper" },
  ];
  const coinSvg = (c, r = 20) => {
    const size = { 100: 1, 50: 0.98, 20: 0.9, 10: 0.82, 5: 0.86, 2: 0.76, 1: 0.68 }[c.v] * r;
    const fill = c.kind === "copper" ? "#C8743A" : c.kind === "gold" ? "#E2B640" : "#C9CED3";
    const inner = c.kind === "bi" ? `<circle r="${size * 0.68}" fill="#E2B640"/>` : "";
    const edge = c.kind === "copper" ? "#8E4A1F" : c.kind === "gold" ? "#A98320" : "#7E858C";
    return `<circle r="${size}" fill="${fill}" stroke="${edge}" stroke-width="1.6"/>${inner}<circle r="${size * 0.84}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>
<text y="${c.kind === "bi" ? 4 : 5}" text-anchor="middle" font-size="${c.v === 100 ? size * 0.6 : size * 0.78}" font-weight="700" fill="#3A2330" font-family="Fredoka, system-ui, sans-serif">${c.label}</text>`;
  };
  const euro = (c) => (c >= 100 ? `${Math.floor(c / 100)} € ${c % 100 ? `${c % 100} c` : ""}`.trim() : `${c} Cent`);
  const euroSay = (c) => (c >= 100 ? `${Math.floor(c / 100)} Euro${c % 100 ? ` und ${c % 100} Cent` : ""}` : `${c} Cent`);
  const ITEMS = [
    { name: "Zauberfeder", der: "Die", price: 15, art: `<path d="M-4 30C-8 6 6 -22 24 -34C18 -10 12 10 -4 30Z" fill="#F29AC1" stroke="#B8326F" stroke-width="2"/><path d="M-4 30L18 -26" stroke="#B8326F" stroke-width="1.5"/>` },
    { name: "Glitzerkristall", der: "Der", price: 32, art: `<polygon points="0,-34 20,-10 12,28 -12,28 -20,-10" fill="#9ED3F1" stroke="#3D7BD9" stroke-width="2"/><path d="M0 -34L0 28M-20 -10L20 -10" stroke="#fff" stroke-width="1.5" opacity=".8"/>` },
    { name: "Zauberstab", der: "Der", price: 56, art: `<path d="M-22 28L14 -14" stroke="#6B4423" stroke-width="6" stroke-linecap="round"/><g transform="translate(18 -20)"><polygon points="${Art.starPts(14)}" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2"/></g>` },
    { name: "Zauberbuch", der: "Das", price: 125, art: `<rect x="-24" y="-28" width="48" height="58" rx="5" fill="#B8326F" stroke="#7A2455" stroke-width="2.5"/><rect x="-18" y="-22" width="36" height="46" rx="3" fill="none" stroke="#FFD23F" stroke-width="2"/><polygon points="${Art.starPts(9)}" fill="#FFD23F"/>` },
  ];

  G.screens.l3shop = ({ i = 0 }) => {
    const it = ITEMS[i];
    return {
      html: `${G.top(LABEL)}${G.steps(2, 3, `Zauberladen ${i + 1}/${ITEMS.length}`)}
<div class="stage">${room(`
<path d="M20 30H340" stroke="#8A5A33" stroke-width="6"/><path d="M20 112H340" stroke="#8A5A33" stroke-width="6"/>
${[[46, 24, "#F29AC1"], [70, 20, "#7CC05A"], [300, 24, "#6BB7E8"], [322, 18, "#FFC93C"]].map(([x, h, c]) => `<rect x="${x - 7}" y="${30 - h - 8}" width="14" height="${h}" rx="5" fill="${c}" opacity=".85"/>`).join("")}
<g transform="translate(306 72)"><ellipse rx="22" ry="26" fill="#A57240"/><ellipse cy="6" rx="14" ry="16" fill="#E9D3B0"/><circle cx="-8" cy="-8" r="8" fill="#fff"/><circle cx="8" cy="-8" r="8" fill="#fff"/><circle cx="-8" cy="-8" r="4" fill="#2B1C12"/><circle cx="8" cy="-8" r="4" fill="#2B1C12"/><path d="M-3 0L0 5L3 0z" fill="#F28C28"/><path d="M-18 -22L-12 -14M18 -22L12 -14" stroke="#A57240" stroke-width="5" stroke-linecap="round"/></g>
<g transform="translate(96 66)">${it.art}</g>
<g transform="translate(162 50) rotate(5)"><path d="M0 0H96V36H0L-10 18Z" fill="#FFF1DC" stroke="#C9A23A" stroke-width="2"/><circle cx="-2" cy="18" r="3" fill="#C9A23A"/><text x="48" y="25" text-anchor="middle" font-size="19" font-weight="700" fill="#7A2455" font-family="Fredoka, system-ui, sans-serif">${euro(it.price)}</text></g>
<rect x="30" y="140" width="300" height="104" rx="16" fill="#E8DCF7" fill-opacity=".2" stroke="#E8DCF7" stroke-width="2" stroke-dasharray="6 5"/>
<text x="180" y="160" text-anchor="middle" font-size="13" fill="#E8DCF7" font-family="Fredoka, system-ui, sans-serif">Zahlteller</text>
<g id="tray"></g>
<text id="sum" x="180" y="276" text-anchor="middle" font-size="15" fill="#FFF6BF" font-family="Fredoka, system-ui, sans-serif"></text>`)}</div>
<div class="coins">${COINS.map((c, k) => `<button class="coin" data-k="${k}" aria-label="${c.v === 100 ? "1 Euro" : c.v + " Cent"}"><svg viewBox="-22 -22 44 44" aria-hidden="true">${coinSvg(c)}</svg></button>`).join("")}</div>
${G.minaRow(i === 0 ? `Willkommen im Zauberladen! ${it.der} ${it.name} kostet ${euroSay(it.price)}. Leg genau so viel Geld hin.` : `${it.der} ${it.name} kostet ${euroSay(it.price)}. Leg genau so viel Geld auf den Teller.`)}
<div class="actions"><button class="btn ghost" id="hint">Tipp</button><button class="btn" id="pay">Bezahlen</button></div>`,
      mount(el) {
        const tray = [];
        let done = false;
        const draw = () => {
          $("#tray", el).innerHTML = tray.map((k, j) => {
            const x = 66 + (j % 6) * 46, y = 194 + Math.floor(j / 6) * 40 - (tray.length > 6 ? 16 : 0);
            return `<g class="tcoin" data-j="${j}" transform="translate(${x} ${y})">${coinSvg(COINS[k], 19)}</g>`;
          }).join("");
          el.querySelectorAll(".tcoin").forEach((g) => (g.onclick = () => { if (done) return; tray.splice(+g.dataset.j, 1); G.sfx("tap"); $("#sum", el).textContent = ""; draw(); }));
        };
        const sum = () => tray.reduce((s, k) => s + COINS[k].v, 0);
        el.querySelectorAll(".coin").forEach((b) => (b.onclick = () => {
          if (done) return;
          if (tray.length >= 12) { G.say("Der Teller ist voll! Nimm lieber größere Münzen."); return; }
          tray.push(+b.dataset.k); G.sfx("tap"); $("#sum", el).textContent = ""; draw();
        }));
        $("#hint", el).onclick = () => {
          G.sfx("tap");
          const s = sum();
          $("#sum", el).textContent = `Auf dem Teller: ${euro(s)}`;
          const t = s === 0 ? `Fang mit einer großen Münze an. ${it.price >= 100 ? "Ein Euro sind 100 Cent!" : `${it.price} Cent: Wie viele Zehner passen da hinein?`}` : `Auf dem Teller liegen ${euroSay(s)}. ${s < it.price ? `Es fehlen noch ${euroSay(it.price - s)}.` : s > it.price ? "Das ist zu viel." : "Das passt genau!"}`;
          G.say(t); G.speak(t);
        };
        $("#pay", el).onclick = () => {
          if (done) return;
          const s = sum();
          if (s === it.price) {
            done = true;
            G.sfx("win");
            $("#sum", el).textContent = `${euro(s)}: genau richtig!`;
            G.say(`Genau ${euroSay(s)}! Die Eule sagt danke. ${it.der} ${it.name} gehört jetzt dir.`);
            $("#pay", el).textContent = "Weiter";
            $("#hint", el).hidden = true;
            $("#pay", el).onclick = () => { G.sfx("tap"); i + 1 < ITEMS.length ? G.go("l3shop", { i: i + 1 }) : G.go("win", { level: 2 }); };
            done = true;
          } else if (s === 0) {
            G.sfx("miss"); G.say("Der Teller ist noch leer. Tippe unten auf die Münzen.");
          } else if (s > it.price) {
            G.sfx("miss"); G.say("Das ist zu viel Geld. Tippe eine Münze auf dem Teller an, dann nimmst du sie zurück.");
          } else {
            G.sfx("miss"); G.say("Da fehlt noch etwas. Lege noch eine Münze dazu.");
          }
        };
        draw();
      },
    };
  };
})();
