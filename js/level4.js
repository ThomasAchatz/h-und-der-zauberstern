"use strict";
/* Level 4: Backwelt. Teig nach Rezept, Ofenuhr (volle und halbe Stunden), Torte nach Muster und frei verzieren. */
(() => {
  const G = Game;
  const $ = G.$;
  const LABEL = "Level 4 · Backwelt";
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const FONT = 'font-family="Fredoka, system-ui, sans-serif"';
  const localPt = (node, e) => new DOMPoint(e.clientX, e.clientY).matrixTransform(node.getScreenCTM().inverse());

  /* Backstube als Hintergrund */
  const kitchen = (inner, h = 300) => `<svg id="scene" class="scene" viewBox="0 0 360 ${h}" role="img" aria-label="Hannahs Backstube">
<defs><pattern id="p-tile" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#FFF6EC"/><path d="M0 0H30V30" fill="none" stroke="#F1DCC6" stroke-width="2"/><circle cx="15" cy="15" r="2.2" fill="#F7C9D9"/></pattern>
<linearGradient id="g-counter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C99660"/><stop offset="1" stop-color="#9C6B3C"/></linearGradient></defs>
<rect width="360" height="${h}" fill="url(#p-tile)"/>
<path d="M0 0H360V22Q330 34 300 22T240 22T180 22T120 22T60 22T0 22Z" fill="#F29AC1"/><path d="M0 22Q30 34 60 22T120 22T180 22T240 22T300 22T360 22" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 5"/>
<rect y="${h - 58}" width="360" height="58" fill="url(#g-counter)"/><rect y="${h - 58}" width="360" height="8" fill="#E2B98A"/>
${inner}</svg>`;

  /* Zutaten */
  const ING = {
    egg: { name: "Ei", plural: "Eier", art: `<ellipse cx="0" cy="2" rx="11" ry="14" fill="#FFF8EC" stroke="#D9C2A0" stroke-width="1.6"/><ellipse cx="-4" cy="-4" rx="3" ry="5" fill="#fff"/>` },
    flour: { name: "Becher Mehl", plural: "Becher Mehl", art: `<path d="M-12 -12H12L10 16H-10Z" fill="#E8F1F8" stroke="#8AA6BD" stroke-width="1.6"/><ellipse cx="0" cy="-12" rx="12" ry="4" fill="#fff" stroke="#8AA6BD" stroke-width="1.4"/><text y="7" text-anchor="middle" font-size="8" fill="#5B7A93" ${FONT} font-weight="600">Mehl</text>` },
    butter: { name: "Stück Butter", plural: "Stück Butter", art: `<path d="M-15 -4L-7 -12H15L7 -4Z" fill="#FFE98A"/><rect x="-15" y="-4" width="22" height="14" fill="#FFD84A"/><path d="M7 -4L15 -12V2L7 10Z" fill="#E9BE2E"/><rect x="-15" y="0" width="22" height="5" fill="#fff" opacity=".7"/>` },
    sugar: { name: "Löffel Zucker", plural: "Löffel Zucker", art: `<path d="M-16 6L6 -2" stroke="#B9BEC4" stroke-width="4" stroke-linecap="round"/><ellipse cx="9" cy="-4" rx="9" ry="6" fill="#B9BEC4"/><path d="M1 -5Q9 -14 17 -5Z" fill="#fff" stroke="#DDE1E5" stroke-width="1"/>` },
    cucumber: { name: "Gurke", art: `<rect x="-16" y="-6" width="32" height="12" rx="6" fill="#5FA450" transform="rotate(-20)"/><g fill="#B9DE92" transform="rotate(-20)"><circle cx="-8" cy="-1" r="1.3"/><circle cx="0" cy="1" r="1.3"/><circle cx="8" cy="-1" r="1.3"/></g>` },
    onion: { name: "Zwiebel", art: `<path d="M0 -15Q4 -8 12 0Q14 13 0 14Q-14 13 -12 0Q-4 -8 0 -15Z" fill="#D9A35B" stroke="#A86F2E" stroke-width="1.4"/><path d="M0 -12V12M-6 -3Q-4 8 0 12M6 -3Q4 8 0 12" stroke="#A86F2E" stroke-width=".9" fill="none"/>` },
  };
  const icon = (k, size = 40) => `<svg viewBox="-20 -20 40 40" width="${size}" height="${size}" aria-hidden="true">${ING[k].art}</svg>`;

  /* ---------- 1) Teig nach Rezept ---------- */
  G.screens.l4dough = () => {
    const need = { egg: rnd(2, 4), flour: rnd(2, 3), butter: rnd(1, 2), sugar: rnd(3, 5) };
    const keys = Object.keys(need);
    const shelf = shuffle([...keys, "cucumber", "onion"]);
    return {
      html: `${G.top(LABEL)}${G.steps(0, 3, "Teig")}
<div class="stage">${kitchen(`
<g transform="translate(12 40)"><rect width="164" height="186" rx="10" fill="#fff" stroke="#E9C9A8" stroke-width="2.5"/><rect width="164" height="34" rx="10" fill="#F7D3E3"/><rect y="24" width="164" height="10" fill="#F7D3E3"/>
<text x="82" y="23" text-anchor="middle" font-size="15" font-weight="600" fill="#7A2455" ${FONT}>Rezept</text>
${keys.map((k, i) => `<g transform="translate(0 ${54 + i * 36})"><g transform="translate(22 0) scale(.8)">${ING[k].art}</g>
<text x="44" y="6" font-size="17" font-weight="700" fill="#3A2330" ${FONT}>${need[k]}</text><text x="58" y="6" font-size="11" fill="#3A2330" ${FONT}>${need[k] === 1 ? ING[k].name : ING[k].plural}</text>
<g class="tick" data-tick="${k}" opacity="0"><circle cx="148" cy="0" r="8" fill="#2F8F46"/><path d="M144 0l3 3 5-5.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>
<text class="cnt" data-cnt="${k}" x="148" y="4" text-anchor="middle" font-size="11" fill="#A8978C" ${FONT}>0/${need[k]}</text></g>`).join("")}</g>
<g id="bowlg" transform="translate(270 196)">
<ellipse cx="0" cy="46" rx="74" ry="9" fill="#000" opacity=".15"/>
<path d="M-80 -6Q-76 52 0 52Q76 52 80 -6Z" fill="#9ED3F1"/><path d="M-80 -6Q-76 52 0 52Q76 52 80 -6Z" fill="url(#p-motif)" opacity=".35"/>
<ellipse cx="0" cy="-6" rx="80" ry="16" fill="#CFEAF5"/><ellipse id="batter" cx="0" cy="-4" rx="70" ry="11" fill="#F6E7C8" opacity="0"/>
<g id="inbowl"></g>
<path d="M-60 6Q-50 30 -24 38" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/>
<g id="spoon" style="display:none"><path d="M0 0L36 -60" stroke="#C99660" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="9" ry="13" fill="#B07A45" transform="rotate(30)"/></g>
</g>`)}</div>
<div class="shelf" id="shelf">${shelf.map((k) => `<button class="ing" data-k="${k}" aria-label="${ING[k].name}">${icon(k, 38)}<span>${ING[k].name.replace("Becher ", "").replace("Stück ", "").replace("Löffel ", "")}</span></button>`).join("")}</div>
<div class="meter-row" id="stirrow" style="visibility:hidden"><span>Rühren</span><div class="meter"><i id="stirbar"></i></div></div>
${G.minaRow("Wir backen einen Sternkuchen! Lies das Rezept und tippe die Zutaten so oft an, wie da steht.")}
<div class="actions"><button class="btn" id="next" hidden>Ab in den Ofen</button></div>`,
      mount(el) {
        const have = { egg: 0, flour: 0, butter: 0, sugar: 0 };
        const svg = $("#scene", el);
        let stirring = false;
        const inbowl = $("#inbowl", el);
        el.querySelectorAll(".ing").forEach((b) => (b.onclick = () => {
          if (stirring) return;
          const k = b.dataset.k;
          if (!(k in need)) { G.sfx("miss"); G.say(k === "cucumber" ? "Eine Gurke im Kuchen? Igitt! Die lassen wir weg." : "Eine Zwiebel? Da müssten wir ja weinen! Die gehört nicht hinein."); b.classList.add("nope"); setTimeout(() => b.classList.remove("nope"), 400); return; }
          if (have[k] >= need[k]) { G.sfx("miss"); G.say(`Stopp! Im Rezept steht ${need[k]} ${need[k] === 1 ? ING[k].name : ING[k].plural}. Das haben wir schon.`); return; }
          have[k]++;
          G.sfx("find");
          const n = Object.values(have).reduce((a, c) => a + c, 0);
          inbowl.insertAdjacentHTML("beforeend", `<g class="drop" transform="translate(${rnd(-50, 50)} ${rnd(-14, 0)}) scale(.7)">${ING[k].art}</g>`);
          $(`[data-cnt="${k}"]`, el).textContent = `${have[k]}/${need[k]}`;
          if (have[k] === need[k]) { $(`[data-tick="${k}"]`, el).setAttribute("opacity", 1); $(`[data-cnt="${k}"]`, el).setAttribute("opacity", 0); }
          if (keys.every((q) => have[q] === need[q])) startStir();
          else G.say(["Plumps!", "Sehr gut!", "Weiter so!", "Genau!", "Mmh!"][n % 5]);
        }));
        const startStir = () => {
          stirring = true;
          G.sfx("ok");
          G.say("Alles drin! Jetzt rühren: Fahre mit dem Finger im Kreis über die Schüssel.");
          $("#stirrow", el).style.visibility = "visible";
          $("#shelf", el).classList.add("dim");
          $("#spoon", el).style.display = "";
          let total = 0, lastA = null, down = false, done = false;
          const bowl = $("#bowlg", el);
          const center = () => { const r = bowl.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.4 }; };
          const NEED = Math.PI * 2 * 4;
          svg.addEventListener("pointerdown", (e) => { if (done) return; down = true; svg.setPointerCapture(e.pointerId); const c = center(); lastA = Math.atan2(e.clientY - c.y, e.clientX - c.x); });
          svg.addEventListener("pointermove", (e) => {
            if (!down || done) return;
            const c = center();
            const a = Math.atan2(e.clientY - c.y, e.clientX - c.x);
            let d = a - lastA;
            if (d > Math.PI) d -= Math.PI * 2;
            if (d < -Math.PI) d += Math.PI * 2;
            lastA = a;
            total += Math.abs(d);
            const k = Math.min(1, total / NEED);
            $("#stirbar", el).style.width = k * 100 + "%";
            const p = localPt(bowl, e);
            $("#spoon", el).setAttribute("transform", `translate(${Math.max(-60, Math.min(60, p.x)).toFixed(1)} ${Math.max(-14, Math.min(4, p.y * 0.3)).toFixed(1)})`);
            $("#batter", el).setAttribute("opacity", Math.min(1, k * 1.3));
            inbowl.setAttribute("opacity", Math.max(0, 1 - k * 1.4));
            if (k >= 1) {
              done = true;
              G.sfx("win");
              G.say("Was für ein feiner, glatter Teig! Jetzt kommt er in den Ofen.");
              $("#next", el).hidden = false;
            }
          });
          const up = () => { down = false; };
          svg.addEventListener("pointerup", up);
          svg.addEventListener("pointercancel", up);
        };
        $("#next", el).onclick = () => { G.sfx("tap"); G.go("l4clock"); };
      },
    };
  };

  /* ---------- 2) Ofenuhr: volle und halbe Stunden ---------- */
  const tName = (h, m) => (m === 0 ? `${h} Uhr` : `halb ${(h % 12) + 1}`);
  const clockFace = () => `<g id="clock" transform="translate(180 152)">
<circle r="100" fill="#fff" stroke="#B8326F" stroke-width="8"/><circle r="92" fill="none" stroke="#F7D3E3" stroke-width="2"/>
${Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 2; const r1 = i % 5 ? 86 : 80; return `<path d="M${(Math.sin(a) * r1).toFixed(1)} ${(-Math.cos(a) * r1).toFixed(1)}L${(Math.sin(a) * 90).toFixed(1)} ${(-Math.cos(a) * 90).toFixed(1)}" stroke="#7A2455" stroke-width="${i % 5 ? 1 : 2.6}"/>`; }).join("")}
${Array.from({ length: 12 }, (_, i) => { const n = i + 1; const a = (n / 12) * Math.PI * 2; return `<g class="hour" data-h="${n}"><circle cx="${(Math.sin(a) * 64).toFixed(1)}" cy="${(-Math.cos(a) * 64).toFixed(1)}" r="15" fill="transparent"/><text x="${(Math.sin(a) * 64).toFixed(1)}" y="${(-Math.cos(a) * 64 + 7).toFixed(1)}" text-anchor="middle" font-size="20" font-weight="600" fill="#3A2330" ${FONT}>${n}</text></g>`; }).join("")}
<g id="hh"><path d="M0 8V-46" stroke="#3A2330" stroke-width="8" stroke-linecap="round"/></g>
<g id="mh"><path d="M0 10V-74" stroke="#B8326F" stroke-width="5" stroke-linecap="round"/></g>
<circle r="7" fill="#FFC93C" stroke="#3A2330" stroke-width="2"/></g>`;
  const setHands = (el, h, m) => {
    $("#hh", el).setAttribute("transform", `rotate(${((h % 12) + m / 60) * 30})`);
    $("#mh", el).setAttribute("transform", `rotate(${m * 6})`);
  };
  const CLOCK = () => {
    const h1 = rnd(2, 5), h2 = rnd(4, 9), h3 = rnd(1, 4), h4 = rnd(6, 10), h5 = rnd(3, 8);
    return [
      { type: "read", h: h1, m: 0, q: "Wie spät ist es auf der Ofenuhr?", opts: [tName(h1, 0), tName(h1 + 1, 0), "12 Uhr"] },
      { type: "read", h: h2, m: 30, q: "Und jetzt? Der lange Zeiger steht unten.", opts: [tName(h2, 30), `halb ${h2}`, tName(h2 + 1, 0)] },
      { type: "set", h: h3, m: 0, q: `Der Kuchen kommt um ${h3} Uhr in den Ofen. Tippe auf die richtige Zahl.` },
      { type: "span", h: h4, m: 0, q: `Jetzt ist es ${h4} Uhr. Der Kuchen bäckt eine Stunde. Wann ist er fertig?`, ans: tName(h4 + 1, 0), opts: [tName(h4 + 1, 0), tName(h4 - 1, 0), tName(h4, 30)] },
      { type: "set", h: h5, m: 30, q: `Stelle die Uhr auf halb ${h5 + 1}. Tipp: Zuerst „halbe Stunde“ wählen.` },
    ];
  };

  G.screens.l4clock = () => {
    const tasks = CLOCK();
    return {
      html: `${G.top(LABEL)}${G.steps(1, 3, "Ofenuhr")}
<div class="stage">${kitchen(`<g transform="translate(0 0)">${clockFace()}</g>
<text id="cnum" x="340" y="48" text-anchor="end" font-size="13" fill="#7A2455" ${FONT}></text>`)}</div>
<div class="bottles" id="opts"></div>
${G.minaRow("")}
<div class="actions"><button class="btn ghost" id="hint">Tipp von Mina</button></div>`,
      mount(el) {
        let i = 0, busy = false, setH = 12, setM = 0, wrong = 0;
        const svg = $("#scene", el);
        const show = () => {
          const t = tasks[i];
          busy = false; wrong = 0;
          $("#cnum", el).textContent = `Uhr ${i + 1} von ${tasks.length}`;
          G.say(t.q);
          if (t.type === "set") {
            setH = 12; setM = 0; setHands(el, 12, 0);
            svg.classList.add("pick");
            $("#opts", el).innerHTML = `<div class="seg"><button class="segb" data-m="0" aria-pressed="true">volle Stunde</button><button class="segb" data-m="30" aria-pressed="false">halbe Stunde</button></div><button class="btn" id="check">Fertig</button>`;
            el.querySelectorAll(".segb").forEach((b) => (b.onclick = () => { setM = +b.dataset.m; el.querySelectorAll(".segb").forEach((o) => o.setAttribute("aria-pressed", o === b)); setHands(el, setH, setM); G.sfx("tap"); }));
            $("#check", el).onclick = () => {
              if (busy) return;
              if (setH % 12 === t.h % 12 && setM === t.m) ok(`Genau! ${tName(t.h, t.m)}.`);
              else { G.sfx("miss"); wrong++; G.say(t.m === 30 ? `Fast! Bei halb ${t.h + 1} zeigt der kurze Zeiger zwischen ${t.h} und ${t.h + 1}. Tippe auf die ${t.h} und wähle „halbe Stunde“.` : `Noch nicht ganz. Der kurze Zeiger muss genau auf die ${t.h} zeigen.`); }
            };
          } else {
            svg.classList.remove("pick");
            setHands(el, t.h, t.m);
            const ans = t.ans || tName(t.h, t.m);
            $("#opts", el).innerHTML = shuffle(t.opts).map((o) => `<button class="bottle round wide" data-v="${o}"><b>${o}</b></button>`).join("");
            el.querySelectorAll("#opts .bottle").forEach((b) => (b.onclick = () => {
              if (busy) return;
              if (b.dataset.v === ans) { b.classList.add("pour"); ok(t.type === "span" ? `Richtig! Eine Stunde nach ${t.h} Uhr ist es ${ans}.` : `Richtig, es ist ${ans}!`); }
              else { G.sfx("miss"); b.classList.add("nope"); b.disabled = true; wrong++; G.say(hintFor(t)); }
            }));
          }
        };
        const hintFor = (t) => {
          if (t.type === "span") return `Der kurze Zeiger wandert in einer Stunde eine Zahl weiter: von ${t.h} auf ${t.h + 1}.`;
          if (t.m === 30) return `Der lange Zeiger unten heißt: eine halbe Stunde ist vorbei. Der kurze Zeiger ist schon auf dem Weg zur ${(t.h % 12) + 1}. Darum sagt man halb ${(t.h % 12) + 1}.`;
          if (t.type === "set") return t.m === 30 ? `Wähle „halbe Stunde“ und tippe auf die ${t.h}. Dann steht der kurze Zeiger zwischen ${t.h} und ${t.h + 1}.` : `Tippe auf die ${t.h}. Der kurze Zeiger zeigt die Stunde.`;
          return "Schau auf den kurzen Zeiger. Er zeigt die Stunde. Der lange Zeiger oben heißt: volle Stunde.";
        };
        const ok = (msg) => {
          busy = true;
          G.sfx("ok");
          G.say(msg);
          setTimeout(() => {
            i++;
            if (i < tasks.length) show();
            else {
              svg.classList.remove("pick");
              setHands(el, 0, 0);
              $("#opts", el).innerHTML = `<button class="btn" id="next">Kuchen holen</button>`;
              $("#hint", el).hidden = true;
              G.sfx("win");
              G.say("Ding! Der Kuchen ist fertig und duftet herrlich. Jetzt verzieren wir ihn!");
              $("#next", el).onclick = () => { G.sfx("tap"); G.go("l4cake"); };
            }
          }, 1500);
        };
        svg.addEventListener("click", (e) => {
          const h = e.target.closest(".hour");
          if (!h || tasks[i].type !== "set" || busy) return;
          setH = +h.dataset.h; setHands(el, setH, setM); G.sfx("tap");
        });
        $("#hint", el).onclick = () => { G.sfx("tap"); const t = hintFor(tasks[i]); G.say(t); G.speak(t); };
        show();
      },
    };
  };

  /* ---------- 3) Torte: Muster fortsetzen und frei verzieren ---------- */
  const FRUIT = {
    straw: { name: "Erdbeere", art: `<path d="M0 12Q-11 4 -10 -4Q-8 -10 0 -9Q8 -10 10 -4Q11 4 0 12Z" fill="#D93B36"/><path d="M-6 -9L0 -5L6 -9L3 -12L0 -9L-3 -12Z" fill="#4E9A3E"/><g fill="#FFE278"><circle cx="-4" cy="-2" r=".9"/><circle cx="3" cy="-1" r=".9"/><circle cx="0" cy="4" r=".9"/><circle cx="-2" cy="1" r=".9"/></g>` },
    blue: { name: "Heidelbeere", art: `<circle r="8.5" fill="#3D4FA8"/><circle cx="-3" cy="-3" r="2.4" fill="#fff" opacity=".35"/><path d="M-2 -8L0 -5L2 -8" stroke="#24306B" stroke-width="1.4" fill="none"/>` },
    kiwi: { name: "Kiwi", art: `<circle r="10" fill="#8A6A3B"/><circle r="8.5" fill="#7CC05A"/><circle r="3" fill="#F3F8D8"/><g fill="#2B2B2B">${Array.from({ length: 8 }, (_, i) => `<circle cx="${(Math.cos(i * 0.785) * 5.3).toFixed(1)}" cy="${(Math.sin(i * 0.785) * 5.3).toFixed(1)}" r=".9"/>`).join("")}</g>` },
    banana: { name: "Banane", art: `<circle r="9.5" fill="#FFF3C4" stroke="#E9C94A" stroke-width="2"/><g fill="#C9A23A"><circle cx="0" cy="-3" r="1"/><circle cx="-3" cy="2" r="1"/><circle cx="3" cy="2" r="1"/></g>` },
  };
  const PATTERNS = [
    { seq: ["straw", "blue", "straw", "blue", "straw", "blue", "straw", "blue"], gaps: [4, 5, 7] },
    { seq: ["kiwi", "kiwi", "banana", "kiwi", "kiwi", "banana", "kiwi", "kiwi"], gaps: [5, 6, 7] },
    { seq: ["straw", "blue", "kiwi", "straw", "blue", "kiwi", "straw", "blue"], gaps: [4, 6, 7] },
  ];
  const TOPS = [
    { k: "sprinkle", name: "Streusel" }, { k: "heart", name: "Herz" }, { k: "star", name: "Stern" }, { k: "candle", name: "Kerze" }, { k: "straw", name: "Erdbeere" }, { k: "blue", name: "Beere" },
  ];
  const topArt = (k, rot = 0) => {
    if (k === "sprinkle") return ["#D93B36", "#3D7BD9", "#FFD23F", "#5FA450", "#F29AC1", "#9B7BD4"].map((c, i) => `<rect x="${(Math.cos(i * 1.1) * 9).toFixed(1)}" y="${(Math.sin(i * 1.7) * 7).toFixed(1)}" width="7" height="2.6" rx="1.3" fill="${c}" transform="rotate(${(i * 47 + rot) % 180} ${(Math.cos(i * 1.1) * 9).toFixed(1)} ${(Math.sin(i * 1.7) * 7).toFixed(1)})"/>`).join("");
    if (k === "heart") return `<path d="M0 8C-12 0 -10 -10 -4 -10C-1 -10 0 -7 0 -6C0 -7 1 -10 4 -10C10 -10 12 0 0 8Z" fill="#E8457A" stroke="#B8326F" stroke-width="1.2"/>`;
    if (k === "star") return `<polygon points="${Art.starPts(10)}" fill="url(#g-star)" stroke="#D99A1E" stroke-width="1.2"/>`;
    if (k === "candle") return `<rect x="-3.5" y="-22" width="7" height="22" rx="2" fill="#9ED3F1"/><path d="M-3.5 -18l7 4M-3.5 -10l7 4" stroke="#fff" stroke-width="2"/><path d="M0 -24Q-5 -30 0 -38Q5 -30 0 -24Z" fill="#FFC93C"/><path d="M0 -26Q-2 -29 0 -33Q2 -29 0 -26Z" fill="#fff"/>`;
    return FRUIT[k].art;
  };
  const cakeArt = () => `<g transform="translate(180 196)">
<ellipse cx="0" cy="62" rx="150" ry="16" fill="#E8DCF7"/><ellipse cx="0" cy="58" rx="140" ry="13" fill="#fff" stroke="#D3C2F5" stroke-width="2"/>
<path d="M-118 -6V46Q-118 64 0 64Q118 64 118 46V-6Z" fill="#E7B98A"/><path d="M-118 18Q0 34 118 18V30Q0 46 -118 30Z" fill="#F29AC1"/>
<ellipse cx="0" cy="-6" rx="118" ry="30" fill="#FFF1F6"/>
<path d="M-118 -6Q-112 14 -100 6Q-90 20 -78 10Q-64 26 -50 14Q-34 30 -18 16Q0 32 18 16Q34 30 50 14Q64 26 78 10Q90 20 100 6Q112 14 118 -6" fill="#FFF1F6"/>
<g id="ring"></g><g id="deco"></g></g>`;
  const ringPos = (i, n) => { const x = -102 + (i / (n - 1)) * 204; return [x, -6 + 19 * Math.sqrt(1 - (x / 118) ** 2)]; };

  G.screens.l4cake = () => {
    const pats = [PATTERNS[0], PATTERNS[Math.random() < 0.5 ? 1 : 2]];
    return {
      html: `${G.top(LABEL)}${G.steps(2, 3, "Torte")}
<div class="stage">${kitchen(cakeArt())}</div>
<div class="bottles" id="opts"></div>
${G.minaRow("Zuerst legen wir Obst im Muster auf die Torte. Welche Frucht kommt in die leere Lücke?")}
<div class="actions"><button class="btn ghost" id="hint">Tipp von Mina</button><button class="btn" id="next" hidden>Fertig</button></div>`,
      mount(el) {
        const svg = $("#scene", el);
        let p = 0, gap = 0, phase = 1, placed = 0, tool = "sprinkle";
        const drawRing = () => {
          const P = pats[p];
          const n = P.seq.length;
          $("#ring", el).innerHTML = P.seq.map((k, i) => {
            const [x, y] = ringPos(i, n);
            const g = P.gaps.indexOf(i);
            if (g >= gap) return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="12" fill="#fff" stroke="#B8326F" stroke-width="2" stroke-dasharray="3 3" class="${g === gap ? "gap-now" : ""}"/>${g === gap ? `<text y="5" text-anchor="middle" font-size="14" font-weight="700" fill="#B8326F" ${FONT}>?</text>` : ""}</g>`;
            return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.25)">${FRUIT[k].art}</g>`;
          }).join("");
          const opts = shuffle(Object.keys(FRUIT).filter((k) => P.seq.includes(k)).concat(Object.keys(FRUIT).filter((k) => !P.seq.includes(k)).slice(0, 1)));
          $("#opts", el).innerHTML = opts.map((k) => `<button class="bottle fruit" data-k="${k}" aria-label="${FRUIT[k].name}"><svg viewBox="-14 -14 28 28" width="40" height="40" aria-hidden="true">${FRUIT[k].art}</svg><span>${FRUIT[k].name}</span></button>`).join("");
          el.querySelectorAll("#opts .bottle").forEach((b) => (b.onclick = () => pickFruit(b)));
        };
        const pickFruit = (b) => {
          const P = pats[p];
          const want = P.seq[P.gaps[gap]];
          if (b.dataset.k === want) {
            G.sfx("find"); gap++;
            if (gap >= P.gaps.length) {
              gap = 0; p++;
              if (p >= pats.length) { drawDone(); return; }
              G.sfx("ok"); G.say("Super, das Muster stimmt! Hier ist noch ein schwierigeres Muster.");
            } else G.say(["Genau!", "Richtig, weiter so!", "Passt!"][gap % 3]);
            drawRing();
          } else {
            G.sfx("miss"); b.classList.add("nope"); setTimeout(() => b.classList.remove("nope"), 400);
            G.say("Hmm, das passt nicht ins Muster. Sprich das Muster laut vor dich hin, dann hörst du es!");
          }
        };
        const drawDone = () => {
          G.sfx("ok");
          const P = pats[pats.length - 1];
          $("#ring", el).innerHTML = P.seq.map((k, i) => { const [x, y] = ringPos(i, P.seq.length); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.25)">${FRUIT[k].art}</g>`; }).join("");
          phase = 2;
          G.say("Wunderschön! Jetzt darfst du die Torte ganz frei verzieren. Wähle unten etwas und tippe auf die Torte.");
          $("#hint", el).hidden = true;
          $("#opts", el).innerHTML = `<div class="tops">${TOPS.map((t, i) => `<button class="top-b" data-k="${t.k}" aria-pressed="${i === 0}" aria-label="${t.name}"><svg viewBox="-16 -26 32 36" width="36" height="36" aria-hidden="true">${topArt(t.k)}</svg></button>`).join("")}</div>`;
          el.querySelectorAll(".top-b").forEach((b) => (b.onclick = () => { tool = b.dataset.k; el.querySelectorAll(".top-b").forEach((o) => o.setAttribute("aria-pressed", o === b)); G.sfx("tap"); }));
        };
        svg.addEventListener("pointerdown", (e) => {
          if (phase !== 2) return;
          const deco = $("#deco", el);
          const pt = localPt(deco, e);
          const inTop = (pt.x * pt.x) / (116 * 116) + ((pt.y + 6) * (pt.y + 6)) / (30 * 30) <= 1;
          const inSide = pt.x > -116 && pt.x < 116 && pt.y > -6 && pt.y < 60;
          if (!inTop && !inSide) return;
          deco.insertAdjacentHTML("beforeend", `<g class="placed" transform="translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})">${topArt(tool, rnd(0, 180))}</g>`);
          placed++;
          G.sfx("find");
          if (placed === 5) { G.say("Die Torte sieht schon toll aus! Mach weiter oder tippe auf Fertig."); $("#next", el).hidden = false; }
          if (placed === 15) G.say("Wow, so eine schöne Torte habe ich noch nie gesehen!");
        });
        $("#hint", el).onclick = () => {
          G.sfx("tap");
          const P = pats[p];
          let per = 1;
          while (!P.seq.every((k, j) => k === P.seq[j % per])) per++;
          const t = `Schau, was immer wieder kommt: ${P.seq.slice(0, per).map((k) => FRUIT[k].name).join(", ")}. Und dann geht es wieder von vorne los.`;
          G.say(t); G.speak(t);
        };
        $("#next", el).onclick = () => { G.sfx("tap"); G.go("win", { level: 3 }); };
        drawRing();
      },
    };
  };
})();
