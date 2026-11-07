"use strict";
/* Level 5: Fee-Schloss. Labyrinth zum Schloss, Memory mit Erinnerungen an die Reise, Zauberstern-Puzzle, großes Finale mit Urkunde. */
(() => {
  const G = Game;
  const $ = G.$;
  const LABEL = "Level 5 · Fee-Schloss";
  const FONT = 'font-family="Fredoka, system-ui, sans-serif"';
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const localPt = (node, e) => new DOMPoint(e.clientX, e.clientY).matrixTransform(node.getScreenCTM().inverse());

  const castleG = (s = 1) => `<g transform="scale(${s})">
<rect x="-46" y="-60" width="92" height="60" fill="#F7D3E3"/><rect x="-46" y="-60" width="92" height="60" fill="#000" opacity=".04"/>
<rect x="-62" y="-84" width="26" height="84" fill="#F2B8D2"/><rect x="36" y="-84" width="26" height="84" fill="#F2B8D2"/><rect x="-14" y="-104" width="28" height="50" fill="#F2B8D2"/>
<path d="M-66 -84L-49 -118L-32 -84Z M32 -84L49 -118L66 -84Z M-18 -104L0 -142L18 -104Z" fill="#9B7BD4"/>
<path d="M-49 -118v-10M49 -118v-10M0 -142v-12" stroke="#6F757B" stroke-width="1.6"/><path d="M0 -154l12 4-12 4zM-49 -128l9 3-9 3zM49 -128l9 3-9 3z" fill="#FFC93C"/>
<path d="M-14 0V-26Q0 -40 14 -26V0Z" fill="#7A4B2E"/><circle cx="8" cy="-12" r="1.6" fill="#FFC93C"/>
<g fill="#FFF6BF"><rect x="-55" y="-66" width="10" height="14" rx="5"/><rect x="45" y="-66" width="10" height="14" rx="5"/><rect x="-5" y="-90" width="10" height="14" rx="5"/><rect x="-34" y="-46" width="10" height="12" rx="5"/><rect x="24" y="-46" width="10" height="12" rx="5"/></g>
<path d="M-46 -60h92" stroke="#E7A3C3" stroke-width="3"/></g>`;
  const hannahFace = () => `<svg viewBox="52 18 96 104" aria-hidden="true">${Art.hannaG()}</svg>`;

  /* ---------- 1) Labyrinth ---------- */
  const makeMaze = (cols, rows) => {
    const cells = Array.from({ length: cols * rows }, () => ({ n: 1, e: 1, s: 1, w: 1, v: 0 }));
    const at = (x, y) => cells[y * cols + x];
    const stack = [[0, rows - 1]];
    at(0, rows - 1).v = 1;
    while (stack.length) {
      const [x, y] = stack[stack.length - 1];
      const nb = [[0, -1, "n", "s"], [1, 0, "e", "w"], [0, 1, "s", "n"], [-1, 0, "w", "e"]]
        .map(([dx, dy, a, b]) => [x + dx, y + dy, a, b])
        .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cols && ny < rows && !at(nx, ny).v);
      if (!nb.length) { stack.pop(); continue; }
      const [nx, ny, a, b] = nb[Math.floor(Math.random() * nb.length)];
      at(x, y)[a] = 0; at(nx, ny)[b] = 0; at(nx, ny).v = 1;
      stack.push([nx, ny]);
    }
    return { cols, rows, at };
  };
  const MAZES = [[5, 6], [6, 8]];

  G.screens.l5maze = ({ round = 0 }) => {
    const [cols, rows] = MAZES[round];
    const m = makeMaze(cols, rows);
    const W = 320, cs = W / cols, H = cs * rows, ox = 20, oy = 70;
    let walls = "";
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const c = m.at(x, y), X = ox + x * cs, Y = oy + y * cs;
      if (c.n && !(x === cols - 1 && y === 0)) walls += `M${X} ${Y}h${cs}`;
      if (c.w) walls += `M${X} ${Y}v${cs}`;
      if (y === rows - 1 && c.s) walls += `M${X} ${Y + cs}h${cs}`;
      if (x === cols - 1 && c.e) walls += `M${X + cs} ${Y}v${cs}`;
    }
    const vbH = oy + H + 20;
    return {
      html: `${G.top(LABEL)}${G.steps(0, 3, `Labyrinth ${round + 1}/2`)}
<div class="stage"><svg id="scene" class="scene" viewBox="0 0 360 ${vbH}" role="img" aria-label="Heckenlabyrinth zum Fee-Schloss">
<rect width="360" height="${vbH}" fill="url(#g-night)"/>
<g fill="#fff" opacity=".8"><circle cx="30" cy="24" r="1.6"/><circle cx="120" cy="14" r="1.2"/><circle cx="210" cy="30" r="1.4"/><circle cx="90" cy="48" r="1"/></g>
<rect x="${ox - 8}" y="${oy - 8}" width="${W + 16}" height="${H + 16}" rx="14" fill="#3E7A3A"/>
<rect x="${ox}" y="${oy}" width="${W}" height="${H}" fill="#E9DCC0"/>
<g transform="translate(${ox + W - cs / 2} ${oy + 4})">${castleG(0.42)}</g>
<path id="trail" d="" fill="none" stroke="#F29AC1" stroke-width="${cs * 0.28}" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
<path d="${walls}" stroke="#2F6B2E" stroke-width="${round ? 9 : 11}" stroke-linecap="round" fill="none"/>
<path d="${walls}" stroke="#5FA450" stroke-width="${round ? 5 : 6}" stroke-linecap="round" fill="none"/>
<g id="goal" transform="translate(${ox + W - cs / 2} ${oy + cs / 2})"><circle r="${cs * 0.3}" fill="url(#g-glow)"/><polygon points="${Art.starPts(cs * 0.22)}" fill="url(#g-star)" stroke="#D99A1E" stroke-width="1.5"/></g>
<g id="tok"><circle r="${cs * 0.36}" fill="#fff" stroke="#B8326F" stroke-width="3"/><g transform="translate(${-cs * 0.3} ${-cs * 0.31}) scale(${(cs * 0.6) / 96})"><svg width="96" height="104" viewBox="52 18 96 104" overflow="hidden">${Art.hannaG()}</svg></g></g>
<rect id="hit" width="360" height="${vbH}" fill="transparent"/>
</svg></div>
${G.minaRow(round === 0 ? "Das Fee-Schloss ist hinter dem Heckenlabyrinth! Zieh Hannah mit dem Finger den Weg entlang bis zum Stern." : "Puh, ein noch größeres Labyrinth! Findest du auch hier den Weg zum Stern?")}
<div class="actions"><button class="btn ghost" id="again">Von vorne</button><button class="btn" id="next" hidden>Weiter</button></div>`,
      mount(el) {
        const svg = $("#scene", el);
        svg._maze = { m, cols, rows, ox, oy, cs };
        let cur = [0, rows - 1], path = [cur.slice()], down = false, done = false, bumps = 0;
        const center = ([x, y]) => [ox + x * cs + cs / 2, oy + y * cs + cs / 2];
        const draw = () => {
          const [cx, cy] = center(cur);
          $("#tok", el).setAttribute("transform", `translate(${cx} ${cy})`);
          $("#trail", el).setAttribute("d", path.map((p, i) => { const [x, y] = center(p); return `${i ? "L" : "M"}${x} ${y}`; }).join(""));
        };
        const open = ([x, y], dx, dy) => {
          const c = m.at(x, y);
          if (dx === 1) return !c.e && x < cols - 1;
          if (dx === -1) return !c.w && x > 0;
          if (dy === 1) return !c.s && y < rows - 1;
          if (dy === -1) return !c.n && y > 0;
          return false;
        };
        const stepTo = (tx, ty) => {
          let guard = 0;
          while ((cur[0] !== tx || cur[1] !== ty) && guard++ < 12) {
            const dx = Math.sign(tx - cur[0]), dy = Math.sign(ty - cur[1]);
            const tries = Math.abs(tx - cur[0]) >= Math.abs(ty - cur[1]) ? [[dx, 0], [0, dy]] : [[0, dy], [dx, 0]];
            const ok = tries.find(([ax, ay]) => (ax || ay) && open(cur, ax, ay));
            if (!ok) { if (++bumps % 6 === 1) G.sfx("miss"); return; }
            const nx = [cur[0] + ok[0], cur[1] + ok[1]];
            const prev = path[path.length - 2];
            if (prev && prev[0] === nx[0] && prev[1] === nx[1]) path.pop(); else path.push(nx);
            cur = nx;
          }
        };
        const cellAt = (e) => { const p = localPt(svg, e); return [Math.floor((p.x - ox) / cs), Math.floor((p.y - oy) / cs)]; };
        const move = (e) => {
          if (done) return;
          const [tx, ty] = cellAt(e);
          if (tx < 0 || ty < 0 || tx >= cols || ty >= rows) return;
          stepTo(tx, ty);
          draw();
          if (cur[0] === cols - 1 && cur[1] === 0) finish();
        };
        const finish = () => {
          done = true;
          G.sfx("win");
          G.say(round === 0 ? "Geschafft! Aber oh, da ist noch ein zweites Labyrinth." : "Du hast den Weg gefunden! Das Schloss-Tor ist direkt vor uns.");
          $("#next", el).hidden = false;
          $("#again", el).hidden = true;
        };
        svg.addEventListener("pointerdown", (e) => {
          if (done) return;
          const [tx, ty] = cellAt(e);
          if (Math.abs(tx - cur[0]) + Math.abs(ty - cur[1]) > 1) { G.say("Leg den Finger auf Hannah und zieh sie den Weg entlang."); return; }
          down = true; svg.setPointerCapture(e.pointerId); move(e);
        });
        svg.addEventListener("pointermove", (e) => { if (down) move(e); });
        const up = () => { down = false; };
        svg.addEventListener("pointerup", up);
        svg.addEventListener("pointercancel", up);
        $("#again", el).onclick = () => { G.sfx("tap"); cur = [0, rows - 1]; path = [cur.slice()]; draw(); G.say("Nochmal von unten. Tipp: Sackgassen sind nicht schlimm, geh einfach zurück!"); };
        $("#next", el).onclick = () => { G.sfx("tap"); round === 0 ? G.go("l5maze", { round: 1 }) : G.go("l5memory"); };
        draw();
      },
    };
  };

  /* ---------- 2) Memory: Erinnerungen an die Reise ---------- */
  const CARDS = {
    cheyenne: { svg: () => `<svg viewBox="200 20 190 190" aria-hidden="true">${Art.horseG(G.state.horse)}</svg>`, say: "Cheyenne! Weißt du noch, wie du ihren Stall ausgemistet hast?" },
    mina: { svg: () => Art.minaFace(), say: "Das bin ja ich! Danke, dass du mich auf der ganzen Reise begleitet hast." },
    hannah: { svg: () => hannahFace(), say: "Das bist du, Hannah! Die mutigste Sternsucherin der Welt." },
    balloon: { svg: () => `<svg viewBox="-20 -24 40 48" aria-hidden="true"><path d="M0 12Q4 20 -2 24" stroke="#777" stroke-width="1.2" fill="none"/><ellipse cy="-4" rx="13" ry="16" fill="#D93B36"/><ellipse cx="-5" cy="-10" rx="3.5" ry="5.5" fill="#fff" opacity=".45"/><path d="M-2 12h4l-2-3z" fill="#D93B36"/></svg>`, say: "Der rote Ballon von Mama! So haben wir sie im Europapark gefunden." },
    potion: { svg: () => `<svg viewBox="0 0 60 80" aria-hidden="true"><rect x="22" y="2" width="16" height="10" rx="3" fill="#C99660"/><path d="M24 12h12v12c12 4 18 14 18 26 0 16-11 28-24 28S6 66 6 50c0-12 6-22 18-26z" fill="#F3ECF7" stroke="#B9A6C6" stroke-width="2"/><path d="M9 48c6 3 36 3 42 0 1 14-9 26-21 26S8 62 9 48z" fill="#7CC05A"/></svg>`, say: "Ein Zaubertrank! In der Zauber-Schule hast du so toll gerechnet." },
    cake: { svg: () => `<svg viewBox="-24 -26 48 46" aria-hidden="true"><path d="M-20 -2V12Q0 18 20 12V-2Z" fill="#E7B98A"/><path d="M-20 4Q0 10 20 4V8Q0 14 -20 8Z" fill="#F29AC1"/><ellipse cy="-2" rx="20" ry="7" fill="#FFF1F6"/><rect x="-2" y="-18" width="4" height="12" rx="1" fill="#9ED3F1"/><path d="M0 -20Q-3 -24 0 -28Q3 -24 0 -20Z" fill="#FFC93C"/><path d="M-12 -2Q-12 -7 -8 -6Q-4 -7 -4 -3Q-8 2 -12 -2Z" fill="#D93B36"/></svg>`, say: "Der Sternkuchen aus der Backwelt. Mmh, lecker!" },
  };

  G.screens.l5memory = () => {
    const deck = shuffle(Object.keys(CARDS).flatMap((k) => [k, k]));
    return {
      html: `${G.top(LABEL)}${G.steps(1, 3, "Schloss-Tor")}
<div class="memory" id="mem">${deck.map((k, i) => `<button class="card" data-k="${k}" data-i="${i}" aria-label="Karte ${i + 1}"><span class="back"><svg viewBox="-20 -20 40 40" aria-hidden="true"><polygon points="${Art.starPts(12)}" fill="#FFE278" opacity=".9"/></svg></span><span class="face">${CARDS[k].svg()}</span></button>`).join("")}</div>
<div class="hint-line"><span>Paare: <b id="pairs">0 von 6</b> · Züge: <b id="moves">0</b></span></div>
${G.minaRow("Das Schloss-Tor öffnet sich nur mit einem Memory-Zauber! Finde immer zwei gleiche Karten.")}
<div class="actions"><button class="btn" id="next" hidden>Ins Schloss</button></div>`,
      mount(el) {
        let first = null, lock = false, pairs = 0, moves = 0;
        el.querySelectorAll(".card").forEach((c) => (c.onclick = () => {
          if (lock || c.classList.contains("open") || c.classList.contains("done")) return;
          c.classList.add("open"); G.sfx("tap");
          if (!first) { first = c; return; }
          moves++; $("#moves", el).textContent = moves;
          if (first.dataset.k === c.dataset.k) {
            first.classList.add("done"); c.classList.add("done");
            pairs++; $("#pairs", el).textContent = `${pairs} von 6`;
            G.sfx("find"); G.say(CARDS[c.dataset.k].say);
            first = null;
            if (pairs === 6) {
              G.sfx("win");
              setTimeout(() => { G.say(`Alle Paare in ${moves} Zügen! Das Schloss-Tor geht auf. Und schau: Dort liegt das letzte Sternstück!`); $("#next", el).hidden = false; }, 1200);
            }
          } else {
            lock = true;
            const a = first; first = null;
            setTimeout(() => { a.classList.remove("open"); c.classList.remove("open"); lock = false; }, 950);
          }
        }));
        $("#next", el).onclick = () => { G.sfx("tap"); G.go("l5star"); };
      },
    };
  };

  /* ---------- 3) Zauberstern zusammensetzen ---------- */
  const CX = 180, CY = 150, RO = 118, RI = 47;
  const pt = (a, r) => [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
  const deg = (d) => (d * Math.PI) / 180;
  const PIECES = Array.from({ length: 5 }, (_, k) => {
    const a = deg(-90 + k * 72);
    const tip = pt(a, RO), l = pt(a - deg(36), RI), r = pt(a + deg(36), RI);
    const c = [(tip[0] + l[0] + r[0]) / 3, (tip[1] + l[1] + r[1]) / 3];
    return { k, tip, l, r, c, d: `M${(tip[0] - c[0]).toFixed(1)} ${(tip[1] - c[1]).toFixed(1)}L${(l[0] - c[0]).toFixed(1)} ${(l[1] - c[1]).toFixed(1)}L${(r[0] - c[0]).toFixed(1)} ${(r[1] - c[1]).toFixed(1)}Z` };
  });
  const EMBLEM = [
    `<path d="M-6 -6Q-7 8 0 8Q7 8 6 -6" stroke="#8A9199" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    `<ellipse cy="-2" rx="5.5" ry="7" fill="#D93B36"/><path d="M0 5Q2 8 0 10" stroke="#777" stroke-width="1" fill="none"/>`,
    `<path d="M-2 -8h4v4c4 1 6 4 6 8 0 4-3 6-8 6s-8-2-8-6c0-4 2-7 6-8z" fill="#7CC05A" stroke="#fff" stroke-width="1"/>`,
    `<path d="M-8 0V5Q0 8 8 5V0Z" fill="#E7B98A"/><ellipse rx="8" ry="3" fill="#FFF1F6"/><circle cx="-2" cy="-2" r="2" fill="#D93B36"/>`,
    `<path d="M-8 4L-8 -5L-4 -1L0 -7L4 -1L8 -5L8 4Z" fill="#9B7BD4" stroke="#fff" stroke-width="1"/>`,
  ];
  const TRAY = [[62, 318], [180, 318], [298, 318], [120, 392], [240, 392]];
  const TRAY_S = 0.62;

  G.screens.l5star = () => {
    const order = shuffle([0, 1, 2, 3, 4]);
    const pent = PIECES.map((p) => p.l).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    return {
      html: `${G.top(LABEL)}${G.steps(2, 3, "Zauberstern")}
<div class="stage"><svg id="scene" class="scene" viewBox="0 0 360 430" role="img" aria-label="Zauberstern-Puzzle">
<rect width="360" height="430" fill="url(#g-night)"/>
<g fill="#fff" opacity=".8"><circle cx="30" cy="30" r="1.6"/><circle cx="320" cy="40" r="1.4"/><circle cx="300" cy="200" r="1.2"/><circle cx="50" cy="210" r="1.4"/></g>
<circle id="halo" cx="${CX}" cy="${CY}" r="150" fill="url(#g-glow)" opacity=".25"/>
${PIECES.map((p) => `<path d="M${p.tip.join(" ")}L${p.l.join(" ")}L${p.r.join(" ")}Z" fill="#fff" fill-opacity=".08" stroke="#FFE278" stroke-width="2" stroke-dasharray="6 5" stroke-linejoin="round"/>`).join("")}
<polygon points="${pent}" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2" stroke-linejoin="round"/>
<g transform="translate(${CX} ${CY})"><circle r="12" fill="#fff" opacity=".5"/></g>
<rect x="10" y="276" width="340" height="146" rx="18" fill="#fff" fill-opacity=".1" stroke="#E8DCF7" stroke-opacity=".5" stroke-width="2"/>
${order.map((k, j) => { const p = PIECES[k]; return `<g class="piece" data-k="${k}" data-x="${TRAY[j][0]}" data-y="${TRAY[j][1]}" data-s="${TRAY_S}" transform="translate(${TRAY[j][0]} ${TRAY[j][1]}) scale(${TRAY_S})"><path d="${p.d}" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2.5" stroke-linejoin="round"/><circle r="28" fill="transparent"/><g transform="translate(0 2)">${EMBLEM[k]}</g></g>`; }).join("")}
</svg></div>
${G.minaRow("Jetzt setzen wir meinen Zauberstern wieder zusammen! Zieh jede Spitze an die richtige Stelle.")}
<div class="actions"><button class="btn" id="next" hidden>Der Stern leuchtet!</button></div>`,
      mount(el) {
        const svg = $("#scene", el);
        svg._pieces = PIECES;
        let drag = null, placed = 0;
        const place = (g, x, y, s) => { g.dataset.x = x; g.dataset.y = y; g.setAttribute("transform", `translate(${(+x).toFixed(1)} ${(+y).toFixed(1)}) scale(${s})`); };
        svg.addEventListener("pointerdown", (e) => {
          const g = e.target.closest(".piece");
          if (!g || g.classList.contains("set")) return;
          const p = localPt(svg, e);
          const tx = +g.dataset.x, ty = +g.dataset.y;
          drag = { g, dx: tx - p.x, dy: ty - p.y };
          place(g, tx, ty, 1);
          svg.appendChild(g);
          g.classList.add("lift");
          svg.setPointerCapture(e.pointerId);
          G.sfx("tap");
        });
        svg.addEventListener("pointermove", (e) => {
          if (!drag) return;
          const p = localPt(svg, e);
          const x = Math.max(20, Math.min(340, p.x + drag.dx)), y = Math.max(20, Math.min(410, p.y + drag.dy));
          place(drag.g, x, y, 1);
        });
        const drop = () => {
          if (!drag) return;
          const g = drag.g; drag = null;
          g.classList.remove("lift");
          const k = +g.dataset.k;
          const x = +g.dataset.x, y = +g.dataset.y;
          const own = PIECES[k].c;
          if (Math.hypot(x - own[0], y - own[1]) < 40) {
            place(g, own[0], own[1], 1);
            g.classList.add("set");
            placed++;
            G.sfx("find");
            G.say(["Klick! Das erste Stück sitzt.", "Noch eins! Der Stern wird schon heller.", "Super, schon drei Stück!", "Nur noch eine Spitze fehlt!", ""][placed - 1] || "");
            $("#halo", el).setAttribute("opacity", 0.25 + placed * 0.15);
            if (placed === 5) {
              G.sfx("win");
              G.say("Mein Zauberstern ist wieder ganz! Hannah, du hast es geschafft!");
              svg.classList.add("shine");
              $("#next", el).hidden = false;
            }
          } else {
            const near = PIECES.find((q) => Math.hypot(x - q.c[0], y - q.c[1]) < 40);
            if (near) { G.sfx("miss"); G.say("Die Spitze zeigt in eine andere Richtung. Schau genau, wohin sie zeigt!"); }
            if (y > 270) place(g, x, y, TRAY_S);
          }
        };
        svg.addEventListener("pointerup", drop);
        svg.addEventListener("pointercancel", drop);
        $("#next", el).onclick = () => { G.sfx("tap"); G.go("finale"); };
      },
    };
  };

  /* ---------- Finale und Urkunde ---------- */
  const firework = (x, y, c, delay) => `<g class="fw" style="animation-delay:${delay}s;transform-origin:${x}px ${y}px">${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${x + Math.cos(a) * 8} ${y + Math.sin(a) * 8}L${(x + Math.cos(a) * 30).toFixed(1)} ${(y + Math.sin(a) * 30).toFixed(1)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`; }).join("")}</g>`;

  G.screens.finale = () => ({
    cls: "win",
    html: `<h1>Der Zauberstern leuchtet!</h1>
<div class="art"><svg class="scene" viewBox="0 -40 360 440" role="img" aria-label="Hannah, Mina und Cheyenne vor dem Fee-Schloss, der Zauberstern leuchtet">
<rect y="-40" width="360" height="440" fill="url(#g-night)"/>
${firework(70, 40, "#F29AC1", 0)}${firework(290, 20, "#FFE278", 0.6)}${firework(200, 70, "#9ED3F1", 1.2)}${firework(40, 140, "#7CC05A", 1.8)}
<g transform="translate(250 250)">${castleG(1.1)}</g>
<path d="M0 300Q100 280 200 300T360 292V400H0z" fill="#3B3380"/>
<g transform="translate(150 80)"><circle r="80" fill="url(#g-glow)"/><g class="win-star">${Art.star(46)}</g></g>
<g transform="translate(26 140) scale(.6)">${Art.hannaG()}</g>
<g transform="translate(236 20) scale(.72)">${Art.minaG(true)}</g>
<g transform="translate(160 260) scale(.4)">${Art.horseG(G.state.horse)}</g>
</svg></div>
${G.minaRow("Danke, Hannah! Du hast alle fünf Sternstücke gefunden. Jetzt leuchtet mein Zauberstern für immer.")}
<button class="btn big" id="cert">Meine Urkunde</button>`,
    mount(el) {
      G.state.stars[4] = true; G.save();
      G.sfx("win"); G.confetti(el);
      setTimeout(() => G.confetti(el), 1800);
      $("#cert", el).onclick = () => { G.sfx("tap"); G.go("urkunde"); };
    },
  });

  G.screens.urkunde = () => {
    const date = new Date().toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });
    return {
      cls: "cert-screen",
      html: `<div class="cert">
<svg viewBox="0 0 300 70" aria-hidden="true" class="cert-stars">${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${50 + i * 50} 36)">${Art.star(i === 2 ? 26 : 19)}</g>`).join("")}</svg>
<h1>Urkunde</h1>
<p class="cert-name">Hannah</p>
<p>hat mit der Fee Mina und ihrem Pferd Cheyenne alle fünf Sternstücke gefunden und den Zauberstern gerettet.</p>
<ul class="cert-list"><li>Bauernhof</li><li>Europapark</li><li>Zauber-Schule</li><li>Backwelt</li><li>Fee-Schloss</li></ul>
<div class="cert-foot"><span>${date}</span><span class="sig">Mina, die Fee<svg viewBox="0 0 120 20" aria-hidden="true"><path d="M4 14C20 2 30 18 44 8S70 4 80 12S104 6 116 10" stroke="#B8326F" stroke-width="2" fill="none" stroke-linecap="round"/></svg></span></div>
</div>
<div class="actions col"><button class="btn" id="map">Zur Karte</button></div>`,
      mount(el) {
        G.confetti(el);
        $("#map", el).onclick = () => { G.sfx("tap"); G.go("map"); };
      },
    };
  };
})();
