"use strict";
/* Bonus: Rechen-Training. Übungen wie im Schulheft der 2. Klasse:
   Plus und Mal (Lang- und Kurzschreibweise), Malrechnungen im Raster bemalen, Plus und Minus mit Zehnerübergang, Zahlenfolgen fortsetzen. */
(() => {
  const G = Game;
  const $ = G.$;
  const FONT = 'font-family="Fredoka, system-ui, sans-serif"';
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const MINUS = "−";
  const ROUND = 10;

  const MODES = {
    plusmal: { title: "Plus und Mal", sub: "8 + 8 + 8 = 3 · 8", color: "#F29AC1" },
    raster: { title: "Raster bemalen", sub: "4 · 7 im Hunderterfeld", color: "#7CC05A" },
    zehner: { title: "Zehnerübergang", sub: "17 + 7 und 23 − 5", color: "#6BB7E8" },
    folgen: { title: "Zahlenfolgen", sub: "66, 68, 70, …", color: "#FFC93C" },
  };

  const best = () => { G.state.bonus = G.state.bonus || {}; return G.state.bonus; };
  const starsFor = (ok) => (ok >= 9 ? 3 : ok >= 7 ? 2 : ok >= 4 ? 1 : 0);
  const miniStars = (n, size = 16) => `<svg viewBox="0 0 ${size * 3.4} ${size * 1.2}" width="${size * 3.4}" height="${size * 1.2}" aria-hidden="true">${[0, 1, 2].map((i) => `<g transform="translate(${size * 0.6 + i * size * 1.1} ${size * 0.6})"><polygon points="${Art.starPts(size * 0.5)}" fill="${i < n ? "url(#g-star)" : "none"}" stroke="${i < n ? "#D99A1E" : "#C9B8C2"}" stroke-width="1.6" stroke-linejoin="round"/></g>`).join("")}</svg>`;

  const modeIcon = (k) => ({
    plusmal: `<text x="24" y="31" text-anchor="middle" font-size="22" font-weight="700" fill="#7A2455" ${FONT}>+ ·</text>`,
    raster: `${Array.from({ length: 16 }, (_, i) => `<rect x="${8 + (i % 4) * 8}" y="${8 + Math.floor(i / 4) * 8}" width="7" height="7" fill="${i % 4 < 3 && i < 12 ? "#5FA450" : "#fff"}" stroke="#2F6B2E" stroke-width=".8"/>`).join("")}`,
    zehner: `<rect x="10" y="8" width="7" height="32" rx="1.5" fill="#3D7BD9"/><rect x="19" y="8" width="7" height="32" rx="1.5" fill="#3D7BD9"/><rect x="29" y="26" width="6" height="6" rx="1" fill="#3D7BD9"/><rect x="29" y="34" width="6" height="6" rx="1" fill="#3D7BD9"/><rect x="37" y="34" width="6" height="6" rx="1" fill="#F29AC1"/>`,
    folgen: `<text x="24" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#7A2455" ${FONT}>2 4 6</text><path d="M10 36q6 5 12 0q6 5 12 0" stroke="#B8326F" stroke-width="1.6" fill="none"/>`,
  })[k];

  /* ---------- Menü ---------- */
  G.screens.bonus = () => ({
    html: `${G.top("Bonus · Rechen-Training")}
<div class="bonus-menu">${Object.entries(MODES).map(([k, m]) => { const b = best()[k]; return `<button class="mode" data-mode="${k}" style="--c:${m.color}"><span class="mode-ico"><svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">${modeIcon(k)}</svg></span><span class="mode-t"><b>${m.title}</b><small>${m.sub}</small></span><span class="mode-best">${b ? miniStars(starsFor(b)) : "<small>neu</small>"}</span></button>`; }).join("")}</div>
${G.minaRow("Hier kannst du so oft üben, wie du willst! Such dir eine Übung aus. Jede Runde hat 10 Aufgaben.")}
<div class="actions"><button class="btn ghost" id="back">Zur Karte</button></div>`,
    mount(el) {
      el.querySelectorAll(".mode").forEach((b) => (b.onclick = () => { G.sfx("tap"); G.go("bdrill", { mode: b.dataset.mode }); }));
      $("#back", el).onclick = () => { G.sfx("tap"); G.go("map"); };
    },
  });

  /* ---------- Aufgaben erzeugen ---------- */
  const FACT = [2, 3, 4, 5, 6, 7, 8, 10];
  const longForm = (n, k) => Array(n).fill(k).join(" + ");
  const gen = {
    plusmal: () => {
      const kind = pick(["pic", "pic", "long", "short"]);
      const n = kind === "pic" ? rnd(2, 6) : rnd(2, 8);
      const k = kind === "pic" ? rnd(2, 8) : pick(FACT);
      const short = `${n} · ${k}`, long = longForm(n, k);
      let opts;
      if (kind === "short") opts = [long, longForm(Math.max(2, n - 1), k), `${n} + ${k}`];
      else opts = [short, `${n} + ${k}`, `${n + 1} · ${k}`];
      return { kind, n, k, short, long, ans: n * k, choice: kind === "short" ? long : short, opts: shuffle([...new Set(opts)]), style: pick(["stack", "cluster", "beads"]) };
    },
    raster: () => { const a = rnd(2, 9), b = pick([2, 3, 4, 5, 6, 7, 8, 10]); return { a, b, ans: a * b }; },
    zehner: () => {
      if (Math.random() < 0.7) { const t = rnd(1, 8), u = rnd(5, 9), b = rnd(11 - u, 9), a = t * 10 + u; return { q: `${a} + ${b}`, ans: a + b, hint: `Zuerst bis zum Zehner: ${a} + ${10 - u} = ${a + 10 - u}. Dann noch ${b - (10 - u)} dazu.` }; }
      const t = rnd(2, 9), u = rnd(1, 4), b = rnd(u + 2, 9), a = t * 10 + u;
      return { q: `${a} ${MINUS} ${b}`, ans: a - b, hint: `Zuerst zurück zum Zehner: ${a} ${MINUS} ${u} = ${a - u}. Dann noch ${b - u} weg.` };
    },
    folgen: () => {
      const step = pick([2, 2, 3, 5, 10, -2, -5, -10, 4]);
      const start = step > 0 ? rnd(step === 10 ? 1 : 10, 100 - step * 5) : rnd(-step * 5 + 4, 99);
      const seq = Array.from({ length: 6 }, (_, i) => start + i * step);
      return { seq, step, gaps: [3, 4, 5], ans: seq[3] };
    },
  };

  /* Bilder für Plus und Mal, wie im Heft: Stapel, Blüten, Perlenreihen */
  const groupPic = (n, k, style) => {
    const W = 340, H = 150;
    let s = "";
    if (style === "stack") {
      const gap = Math.min(40, W / (n + 1));
      const x0 = W / 2 - ((n - 1) * gap) / 2;
      for (let i = 0; i < n; i++) for (let j = 0; j < k; j++) s += `<rect x="${(x0 + i * gap - 11).toFixed(1)}" y="${132 - j * 15}" width="22" height="12" rx="3" fill="#D9A35B" stroke="#8A5A33" stroke-width="1.4"/><rect x="${(x0 + i * gap - 7).toFixed(1)}" y="${134 - j * 15}" width="14" height="3" rx="1.5" fill="#F3D3A0"/>`;
    } else if (style === "cluster") {
      const cols = ["#D93B36", "#3D7BD9", "#5FA450", "#FFC93C", "#9B7BD4", "#F28C28"];
      const gap = W / n;
      for (let i = 0; i < n; i++) {
        const cx = gap / 2 + i * gap, cy = i % 2 ? 92 : 62, r = 6.5 + (k > 6 ? 0 : 1);
        for (let j = 0; j < k; j++) { const a = (j / k) * Math.PI * 2 - Math.PI / 2; const d = k === 1 ? 0 : 12 + (k > 6 ? 4 : 0); s += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${r}" fill="${cols[i % 6]}" stroke="#fff" stroke-width="1.2"/>`; }
        s += `<circle cx="${cx.toFixed(1)}" cy="${cy}" r="3" fill="#FFF1DC"/>`;
      }
    } else {
      const rowH = Math.min(26, 140 / n);
      const y0 = H / 2 - ((n - 1) * rowH) / 2;
      for (let i = 0; i < n; i++) {
        s += `<path d="M${W / 2 - k * 11 - 8} ${(y0 + i * rowH).toFixed(1)}H${W / 2 + k * 11 + 8}" stroke="#C9B8C2" stroke-width="1.5"/>`;
        for (let j = 0; j < k; j++) s += `<circle cx="${W / 2 - (k - 1) * 11 + j * 22}" cy="${(y0 + i * rowH).toFixed(1)}" r="${Math.min(9, rowH / 2 - 1)}" fill="#9B7BD4" stroke="#6B4FA0" stroke-width="1.2"/>`;
      }
    }
    return `<svg viewBox="0 0 ${W} ${H}" class="gpic" aria-label="${n} Gruppen mit je ${k}">${s}</svg>`;
  };

  /* ---------- Ziffernblock ---------- */
  const pad = () => `<div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => `<button class="key" data-d="${d}">${d}</button>`).join("")}<button class="key del" data-d="del" aria-label="Löschen">⌫</button><button class="key" data-d="0">0</button><button class="key ok" data-d="ok" aria-label="Fertig">✓</button></div>`;

  /* ---------- Übungsrunde ---------- */
  G.screens.bdrill = ({ mode }) => {
    const M = MODES[mode];
    return {
      html: `${G.top("Bonus · " + M.title)}
<div class="drill-head"><div class="dots-prog" id="prog">${Array.from({ length: ROUND }, () => "<i></i>").join("")}</div><span id="score"></span></div>
<div class="drill" id="drill"></div>
${G.minaRow("")}
<div class="pad-area" id="padarea"></div>`,
      mount(el) {
        let queue = Array.from({ length: ROUND }, () => gen[mode]());
        let idx = 0, firstOk = 0, tries = 0, input = "", phase = "", t = null, retried = new Set(), done = 0;
        const prog = [...el.querySelectorAll("#prog i")];
        const drill = $("#drill", el);
        const padArea = $("#padarea", el);
        const box = () => $("#ans", el);
        const setBox = () => { if (box()) box().textContent = input || "?"; if (box()) box().classList.toggle("empty", !input); };

        const showPad = () => {
          padArea.innerHTML = pad();
          padArea.querySelectorAll(".key").forEach((k) => (k.onclick = () => {
            const d = k.dataset.d;
            if (d === "del") input = input.slice(0, -1);
            else if (d === "ok") { if (input) check(+input); return; }
            else if (input.length < 3) input += d;
            G.sfx("tap");
            setBox();
          }));
        };
        const showChoices = (opts, onPick) => {
          padArea.innerHTML = `<div class="choices">${opts.map((o) => `<button class="choice" data-v="${o}">${o}</button>`).join("")}</div>`;
          padArea.querySelectorAll(".choice").forEach((b) => (b.onclick = () => onPick(b)));
        };

        const render = () => {
          t = queue[idx];
          input = ""; tries = 0; t.miss = false;
          if (mode === "plusmal") renderPlusMal();
          if (mode === "raster") renderRaster();
          if (mode === "zehner") renderZehner();
          if (mode === "folgen") renderFolgen();
        };

        /* Plus und Mal */
        const renderPlusMal = () => {
          phase = "choose";
          const head = t.kind === "pic" ? groupPic(t.n, t.k, t.style) : `<div class="big-task">${t.kind === "long" ? t.long : t.short}</div>`;
          drill.innerHTML = `${head}<div class="lines"><div class="line"><span class="snail">lang</span><b id="l1">${t.kind === "long" ? t.long : "…"}</b></div><div class="line"><span class="snail">kurz</span><b id="l2">${t.kind === "short" ? t.short : "…"}</b></div></div>`;
          G.say(t.kind === "pic" ? `Wie viele Gruppen siehst du, und wie viele sind in jeder Gruppe? Wie schreibt man das kurz?` : t.kind === "long" ? "Wie schreibt man diese Plus-Rechnung kurz als Mal-Rechnung?" : "Wie schreibt man diese Mal-Rechnung lang als Plus-Rechnung?");
          showChoices(t.opts, (b) => {
            if (b.dataset.v === t.choice) {
              G.sfx("find");
              $("#l1", el).textContent = `${t.long} = `;
              $("#l2", el).innerHTML = `${t.short} = <span class="ans empty" id="ans">?</span>`;
              phase = "result";
              G.say(`Genau! ${t.n} mal ${t.k}. Und wie viel ist das? Tippe das Ergebnis ein.`);
              showPad(); setBox();
            } else {
              G.sfx("miss"); b.classList.add("nope"); b.disabled = true; t.miss = true;
              G.say(t.kind === "short" ? `${t.short} heißt: ${t.n} mal die ${t.k}. Also ${t.n}-mal ${t.k} zusammenzählen.` : `Zähle zuerst, wie oft dieselbe Zahl vorkommt. Das ist die erste Zahl bei der Mal-Rechnung.`);
            }
          });
        };

        /* Raster bemalen */
        const renderRaster = () => {
          phase = "paint";
          const N = 10, c = 26, o = 8;
          let cells = "";
          for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) cells += `<rect class="cell" data-r="${r}" data-c="${q}" x="${o + q * c}" y="${o + r * c}" width="${c}" height="${c}"/>`;
          drill.innerHTML = `<div class="big-task small">Bemale: ${t.a} · ${t.b} = <span class="ans empty" id="ans">?</span></div>
<svg viewBox="0 0 ${o * 2 + N * c + 30} ${o * 2 + N * c}" class="grid" id="grid">${cells}<g id="sel"></g><g id="rowlab"></g>
<rect x="${o}" y="${o}" width="${N * c}" height="${N * c}" fill="none" stroke="#2F6B2E" stroke-width="2"/></svg>`;
          G.say(`Male ${t.a} Reihen mit je ${t.b} Kästchen an. Fang links oben an und zieh mit dem Finger.`);
          padArea.innerHTML = `<div class="actions"><button class="btn ghost" id="clear">Löschen</button><button class="btn" id="paintok">Fertig gemalt</button></div>`;
          const grid = $("#grid", el);
          let R = 0, C = 0, down = false;
          const draw = () => {
            grid.querySelectorAll(".cell").forEach((x) => x.classList.toggle("on", +x.dataset.r < R && +x.dataset.c < C));
            $("#rowlab", el).innerHTML = R && C ? Array.from({ length: R }, (_, i) => `<text x="${o + N * c + 5}" y="${o + i * c + 18}" font-size="12" fill="#2F6B2E" ${FONT} font-weight="600">${phase === "result" ? (i + 1) * C : ""}</text>`).join("") : "";
          };
          const at = (e) => { const p = G.svgPoint(grid, e); return [Math.max(1, Math.min(N, Math.floor((p.y - o) / c) + 1)), Math.max(1, Math.min(N, Math.floor((p.x - o) / c) + 1))]; };
          grid.addEventListener("pointerdown", (e) => { if (phase !== "paint") return; down = true; grid.setPointerCapture(e.pointerId); [R, C] = at(e); draw(); });
          grid.addEventListener("pointermove", (e) => { if (!down || phase !== "paint") return; [R, C] = at(e); draw(); });
          grid.addEventListener("pointerup", () => { down = false; if (phase === "paint" && R && C) G.say(`Du hast ${R} Reihen mit je ${C} Kästchen bemalt.`); });
          $("#clear", el).onclick = () => { R = 0; C = 0; draw(); G.sfx("tap"); };
          $("#paintok", el).onclick = () => {
            if (R === t.a && C === t.b) {
              G.sfx("find"); phase = "result"; draw();
              G.say(`Super gemalt! Wie viele Kästchen sind es? Die Zahlen rechts helfen beim Zählen.`);
              showPad(); setBox();
            } else if (R === t.b && C === t.a) {
              G.sfx("miss"); t.miss = true;
              G.say(`Fast! ${t.a} · ${t.b} heißt ${t.a} Reihen mit je ${t.b} Kästchen. Du hast es quer gemalt.`);
            } else { G.sfx("miss"); t.miss = true; G.say(`Schau nochmal: ${t.a} Reihen nach unten und ${t.b} Kästchen nach rechts.`); }
          };
        };

        /* Zehnerübergang */
        const renderZehner = () => {
          phase = "result";
          drill.innerHTML = `<div class="big-task">${t.q} = <span class="ans empty" id="ans">?</span></div>`;
          G.say(["Rechne im Kopf und tippe das Ergebnis ein.", "Los geht's! Denk an den Zehner.", "Du schaffst das!"][idx % 3]);
          showPad(); setBox();
        };

        /* Zahlenfolgen */
        let gapI = 0;
        const renderFolgen = () => {
          phase = "result"; gapI = 0;
          const draw = () => {
            drill.innerHTML = `<div class="seq">${t.seq.map((v, i) => i < 3 + gapI ? `<span class="sv">${v}</span>` : i === 3 + gapI ? `<span class="sv now"><span class="ans empty" id="ans">?</span></span>` : `<span class="sv gap">…</span>`).join("")}</div>`;
            setBox();
          };
          t.redraw = draw;
          draw();
          G.say("Wie geht die Zahlenfolge weiter? Schau, wie viel immer dazukommt oder wegkommt.");
          showPad();
        };

        const hintText = () => {
          if (mode === "plusmal") return `Zähl in ${t.k}er-Schritten: ${t.k}, ${2 * t.k}, ${3 * t.k} und so weiter. ${t.n} Schritte.`;
          if (mode === "raster") return `Zähl Reihe für Reihe: ${t.b}, ${2 * t.b}, ${3 * t.b} und so weiter.`;
          if (mode === "zehner") return t.hint;
          return `Von einer Zahl zur nächsten ${t.step > 0 ? `kommen immer ${t.step} dazu` : `gehen immer ${-t.step} weg`}.`;
        };

        const check = (v) => {
          const want = mode === "folgen" ? t.seq[3 + gapI] : t.ans;
          if (v === want) {
            G.sfx("ok");
            if (mode === "folgen" && gapI < 2) { gapI++; input = ""; t.redraw(); G.say(["Richtig! Und die nächste?", "Genau! Noch eine Zahl."][gapI - 1]); return; }
            if (box()) { box().textContent = v; box().classList.remove("empty"); box().classList.add("right"); }
            if (mode === "raster") { el.querySelectorAll("#rowlab text").forEach((x, i) => (x.textContent = (i + 1) * t.b)); }
            next(true);
          } else {
            G.sfx("miss"); tries++; t.miss = true; input = ""; setBox();
            if (box()) { box().classList.add("wrong"); setTimeout(() => box() && box().classList.remove("wrong"), 400); }
            if (tries < 2) G.say(`Noch nicht ganz. ${hintText()}`);
            else {
              G.say(`Das Ergebnis ist ${want}. Diese Aufgabe kommt später nochmal!`);
              if (box()) { box().textContent = want; box().classList.remove("empty"); box().classList.add("shown"); }
              if (mode === "folgen" && gapI < 2) { setTimeout(() => { gapI++; tries = 0; t.redraw(); }, 1400); return; }
              next(false);
            }
          }
        };

        const next = (ok) => {
          padArea.querySelectorAll("button").forEach((b) => (b.disabled = true));
          const clean = ok && !t.miss;
          if (idx < ROUND) { prog[idx].className = clean ? "ok" : "meh"; if (clean) firstOk++; }
          if (!ok && !retried.has(idx) && idx < ROUND) { retried.add(idx); queue.push(Object.assign({}, t)); }
          if (ok) G.say(pick(["Richtig!", "Super gerechnet!", "Genau so!", "Toll, Hannah!", "Stimmt!"]) + (idx >= ROUND ? " Diesmal hat es geklappt!" : ""));
          done++;
          $("#score", el).textContent = `${Math.min(done, ROUND)} von ${ROUND}`;
          setTimeout(() => {
            idx++;
            if (idx < queue.length) render();
            else finish();
          }, ok ? 1100 : 2200);
        };

        const finish = () => {
          const b = best();
          const prev = b[mode] || 0;
          if (firstOk > prev) { b[mode] = firstOk; G.save(); }
          G.go("bdone", { mode, ok: firstOk, rec: firstOk > prev && prev > 0 });
        };

        $("#score", el).textContent = `0 von ${ROUND}`;
        render();
      },
    };
  };

  /* ---------- Auswertung ---------- */
  G.screens.bdone = ({ mode, ok, rec }) => {
    const n = starsFor(ok);
    const msg = n === 3 ? "Wow, fast alles auf Anhieb richtig! Du bist ein Rechen-Profi." : n === 2 ? "Sehr gut gemacht! Mit ein bisschen Übung schaffst du drei Sterne." : n === 1 ? "Gut geübt! Jede Runde macht dich schneller." : "Super, dass du geübt hast! Probier es gleich nochmal.";
    return {
      cls: "win",
      html: `<h1>${MODES[mode].title}</h1>
<div class="bdone"><div class="bd-stars">${miniStars(n, 48)}</div><p class="bd-num"><b>${ok}</b> von ${ROUND}</p><p>beim ersten Versuch richtig</p>${rec ? `<p class="bd-rec">Neuer Rekord!</p>` : ""}</div>
${G.minaRow(msg)}
<div class="actions col"><button class="btn" id="again">Nochmal üben</button><button class="btn ghost" id="menu">Andere Übung</button></div>`,
      mount(el) {
        if (n >= 2) { G.sfx("win"); G.confetti(el); } else G.sfx("ok");
        $("#again", el).onclick = () => { G.sfx("tap"); G.go("bdrill", { mode }); };
        $("#menu", el).onclick = () => { G.sfx("tap"); G.go("bonus"); };
      },
    };
  };
})();
