"use strict";
/* Level 1: Bauernhof. Suchbild, Stall ausmisten, Cheyenne nachzeichnen und ausmalen. */
(() => {
  const G = Game;
  const $ = G.$;
  const LABEL = "Level 1 · Bauernhof";

  /* ---------- 1) Suchbild ---------- */
  const FINDS = [
    ["shoe", "Hufeisen", "Das Hufeisen liegt links unten im Gras."],
    ["apple", "Apfel", "Der Apfel liegt vor dem Zaun."],
    ["brush", "Bürste", "Die Bürste liegt ganz rechts unten im Gras."],
    ["cat", "Katze", "Die Katze schaut aus dem Fenster der Scheune."],
    ["star", "Stern", "Der Stern funkelt oben im Baum."],
  ];
  const CHEERS = ["Super gefunden!", "Toll, Hannah!", "Genau das ist es!", "Wow, du bist schnell!", "Prima, weiter so!"];

  G.screens.l1search = () => ({
    html: `${G.top(LABEL)}${G.steps(0, 3, "Suchen")}
<div class="stage">${Art.farm(G.state.horse)}</div>
${G.minaRow("Hilf mir, Hannah! Finde die fünf Dinge aus der Liste. Tippe sie im Bild an.")}
<ul class="finds">${FINDS.map(([id, name]) => `<li data-li="${id}"><div class="slot">${Art.icon(id, false)}<span class="badge"><svg aria-hidden="true" viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10.5 L8.5 14 L15 6.5"/></svg></span></div><span>${name}</span></li>`).join("")}</ul>
<div class="actions"><button class="btn ghost" id="hint">Tipp von Mina</button><button class="btn" id="next" hidden>Weiter</button></div>`,
    mount(el) {
      const svg = $("#scene", el);
      const found = new Set();
      let misses = 0;
      let cheer = 0;

      const hint = () => {
        const left = FINDS.find(([id]) => !found.has(id));
        if (!left) return;
        G.hintEl(svg, svg.querySelector(`[data-find="${left[0]}"]`));
        G.say(left[2]);
        G.speak(left[2]);
      };

      svg.addEventListener("pointerdown", (e) => {
        const f = e.target.closest(".find");
        if (f) {
          const id = f.dataset.find;
          if (found.has(id)) return;
          found.add(id);
          f.classList.add("found");
          f.classList.remove("pulse");
          G.markEl(svg, f);
          const li = $(`[data-li="${id}"]`, el);
          li.classList.add("got");
          $(".slot", li).firstElementChild.outerHTML = Art.icon(id, true);
          G.sfx("find");
          if (found.size === FINDS.length) {
            G.say("Alles gefunden! Jetzt geht es in Cheyennes Stall.");
            G.sfx("ok");
            $("#hint", el).hidden = true;
            $("#next", el).hidden = false;
          } else {
            G.say(CHEERS[cheer++ % CHEERS.length] + ` Noch ${FINDS.length - found.size}.`);
          }
        } else {
          const p = G.svgPoint(svg, e);
          G.ripple(svg, p.x, p.y);
          misses++;
          if (misses % 4 === 0) G.say("Schau genau hin! Mit dem Tipp zeige ich dir eine Stelle.");
        }
      });
      $("#hint", el).onclick = () => { G.sfx("tap"); hint(); };
      $("#next", el).onclick = () => { G.sfx("tap"); G.go("l1muck"); };
    },
  });

  /* ---------- 2) Stall ausmisten ---------- */
  const PILES = [[52, 314], [118, 350], [64, 378], [188, 336], [252, 376], [312, 344], [302, 308]];
  const ZONES = [[12, 280], [128, 280], [244, 280], [12, 340], [128, 340], [244, 340]].map(([x, y]) => [x, y, 104, 54]);

  G.screens.l1muck = () => ({
    html: `${G.top(LABEL)}${G.steps(1, 3, "Ausmisten")}
<div class="stage">${Art.stable(G.state.horse)}</div>
<div class="meter-row"><span id="phase">Mist wegwischen</span><div class="meter"><i id="bar"></i></div></div>
${G.minaRow("Cheyennes Stall ist schmutzig! Wische mit dem Finger über den Mist.")}
<button class="btn" id="next" hidden>Weiter</button>`,
    mount(el) {
      const svg = $("#scene", el);
      $("#piles", svg).innerHTML = PILES.map(([x, y], i) => Art.pileShape(x, y, i)).join("");
      $("#zones", svg).innerHTML = ZONES.map(([x, y, w, h], i) => Art.zoneShape(x, y, w, h, i)).join("");
      const piles = PILES.map(([x, y], i) => ({ x, y, wear: 0, gone: false, el: svg.querySelector(`[data-pile="${i}"] .pile-in`) }));
      const zones = ZONES.map(([x, y, w, h], i) => ({ x, y, w, h, wear: 0, el: svg.querySelector(`[data-zone="${i}"]`) }));
      let phase = 1;
      let last = null;
      let down = false;
      const bar = $("#bar", el);

      const progress = () => {
        if (phase === 1) bar.style.width = (piles.filter((p) => p.gone).length / piles.length) * 50 + "%";
        else bar.style.width = 50 + (zones.reduce((s, z) => s + Math.min(1, z.wear / 150), 0) / zones.length) * 50 + "%";
      };

      const move = (p) => {
        if (!last) { last = p; return; }
        const d = Math.hypot(p.x - last.x, p.y - last.y);
        last = p;
        if (d < 0.3) return;
        if (phase === 1) {
          piles.forEach((pl) => {
            if (pl.gone || Math.hypot(p.x - pl.x, p.y - pl.y) > 36) return;
            pl.wear += d;
            const left = Math.max(0, 1 - pl.wear / 110);
            pl.el.style.opacity = left;
            pl.el.style.transform = `scale(${0.5 + left * 0.5})`;
            pl.el.style.transformBox = "fill-box";
            pl.el.style.transformOrigin = "center";
            if (pl.wear >= 110) { pl.gone = true; pl.el.style.opacity = 0; G.sfx("find"); }
          });
          progress();
          if (piles.every((pl) => pl.gone)) {
            phase = 2;
            $("#phase", el).textContent = "Stroh verteilen";
            G.say("Sauber! Jetzt braucht Cheyenne frisches Stroh. Wische über den Boden.");
            G.sfx("ok");
          }
        } else {
          zones.forEach((z) => {
            if (p.x < z.x - 6 || p.x > z.x + z.w + 6 || p.y < z.y - 6 || p.y > z.y + z.h + 6) return;
            z.wear += d;
            z.el.style.opacity = Math.min(1, z.wear / 150);
          });
          progress();
          if (zones.every((z) => z.wear >= 150)) {
            phase = 3;
            bar.style.width = "100%";
            zones.forEach((z) => (z.el.style.opacity = 1));
            G.say("Fertig! Cheyenne liegt weich. Jetzt zeichnen wir sie nach.");
            G.sfx("win");
            $("#next", el).hidden = false;
          }
        }
      };

      svg.addEventListener("pointerdown", (e) => { down = true; svg.setPointerCapture(e.pointerId); last = G.svgPoint(svg, e); });
      svg.addEventListener("pointermove", (e) => { if (down && phase < 3) move(G.svgPoint(svg, e)); });
      const up = () => { down = false; last = null; };
      svg.addEventListener("pointerup", up);
      svg.addEventListener("pointercancel", up);
      $("#next", el).onclick = () => { G.sfx("tap"); G.go("l1trace"); };
    },
  });

  /* ---------- 3) Cheyenne nachzeichnen und ausmalen ---------- */
  const COLORS = [["#8A552B", "Braun"], ["#C4632D", "Fuchsrot"], ["#3B2314", "Dunkelbraun"], ["#2B2B2B", "Schwarz"], ["#9AA1A8", "Grau"], ["#FFFFFF", "Weiß"], ["#F3E3C3", "Creme"],
    ["#FFD23F", "Gelb"], ["#F28C28", "Orange"], ["#D93B36", "Rot"], ["#F29AC1", "Rosa"], ["#9B7BD4", "Lila"], ["#3D7BD9", "Blau"], ["#9ED3F1", "Hellblau"], ["#5FA450", "Grün"], ["#B9DE92", "Hellgrün"]];
  const HORSE_PARTS = ["body", "mane", "tail", "hooves", "blaze", "socks", "halter", "pad", "saddle"];
  const WHITE = Object.fromEntries(HORSE_PARTS.map((k) => [k, "#FFFFFF"]));

  G.screens.l1trace = () => ({
    html: `${G.top(LABEL)}${G.steps(2, 3, "Zeichnen")}
<div class="stage paper"><svg id="tsvg" viewBox="0 0 400 320" role="img" aria-label="Umriss von Cheyenne zum Nachzeichnen">
<g id="bg" style="display:none" stroke="#6B5560" stroke-width="2"><rect data-part="sky" class="f" width="400" height="320" fill="#FFFFFF" stroke="none"/>
<g data-part="sun"><circle class="f" cx="346" cy="44" r="24" fill="#FFFFFF"/></g>
<g data-part="cloud"><path class="f" d="M30 52a14 14 0 0 1 22-12a18 18 0 0 1 32 4a12 12 0 0 1 2 22H34a12 12 0 0 1-4-14zM150 30a10 10 0 0 1 16-8a14 14 0 0 1 24 4a9 9 0 0 1 0 17h-36a9 9 0 0 1-4-13z" fill="#FFFFFF"/></g>
<g data-part="hill"><path class="f" d="M0 240Q100 206 200 236T400 222V320H0z" fill="#FFFFFF"/></g>
<g data-part="grass"><path class="f" d="M0 286Q120 262 260 282T400 272V320H0z" fill="#FFFFFF"/></g>
<g data-part="flower">${[[30, 300], [180, 296], [366, 296], [60, 254]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle class="f" cx="0" cy="-7" r="5" fill="#FFFFFF"/><circle class="f" cx="7" cy="0" r="5" fill="#FFFFFF"/><circle class="f" cx="0" cy="7" r="5" fill="#FFFFFF"/><circle class="f" cx="-7" cy="0" r="5" fill="#FFFFFF"/><circle cx="0" cy="0" r="3.5" fill="#FFC93C" pointer-events="none"/></g>`).join("")}</g></g>
<g id="paint" style="display:none">${Art.horseG(Object.assign({ stroke: "#6B5560" }, WHITE))}</g>
<path id="outline" d="${Art.HORSE_BODY}" fill="none" stroke="#C9B8C2" stroke-width="3" stroke-dasharray="7 6"/>
<g id="dots"></g>
<path id="stroke" d="" fill="none" stroke="#B8326F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
</svg></div>
<div class="hint-line" id="hintline"><span>Fahre die rosa Punkte nach: <b id="pct">0 %</b></span></div>
<div class="palette grid" id="palette" hidden>${COLORS.map(([c, n], i) => `<button class="sw" data-c="${c}" aria-label="${n}" aria-pressed="${i === 0}" style="background:${c}"></button>`).join("")}</div>
${G.minaRow("Das ist Cheyenne! Fahre ihren Umriss mit dem Finger nach.")}
<div class="actions"><button class="btn ghost" id="again">Nochmal</button><button class="btn" id="next" hidden>Weiter</button></div>`,
    mount(el) {
      const svg = $("#tsvg", el);
      const outline = $("#outline", el);
      const strokeEl = $("#stroke", el);
      const dotsG = $("#dots", el);
      const N = 90;
      const len = outline.getTotalLength();
      const samples = Array.from({ length: N }, (_, i) => {
        const pt = outline.getPointAtLength((i / N) * len);
        return { x: pt.x, y: pt.y, hit: false };
      });
      dotsG.innerHTML = samples.map((s) => `<circle class="trace-dot" cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="3.4"/>`).join("");
      const dotEls = [...dotsG.children];
      let d = "";
      let last = null;
      let down = false;
      let phase = 1;
      let said = 0;
      const pct = $("#pct", el);

      const mark = (p) => {
        samples.forEach((s, i) => {
          if (!s.hit && Math.hypot(s.x - p.x, s.y - p.y) < 20) { s.hit = true; dotEls[i].classList.add("hit"); }
        });
      };
      const update = () => {
        const v = Math.round((samples.filter((s) => s.hit).length / N) * 100);
        pct.textContent = v + " %";
        if (v >= 30 && said < 1) { said = 1; G.say("Das sieht schon gut aus, Hannah! Weiter so."); }
        if (v >= 65 && said < 2) { said = 2; G.say("Fast geschafft! Nur noch ein Stück."); }
        if (v >= 88 && phase === 1) toColoring();
      };

      const toColoring = () => {
        phase = 2;
        G.sfx("win");
        svg.removeEventListener("pointerdown", onDown);
        $("#outline", el).style.display = "none";
        dotsG.style.display = "none";
        strokeEl.style.display = "none";
        const paint = $("#paint", el);
        const bg = $("#bg", el);
        bg.style.display = "";
        paint.style.display = "";
        const hs = G.state.horse;
        const colored = new Set();
        const setPart = (root, part, color) => {
          root.querySelectorAll(`[data-part="${part}"].f, [data-part="${part}"] .f`).forEach((p) => p.setAttribute("fill", color));
          root.querySelectorAll(`[data-part="${part}"] .s`).forEach((p) => p.setAttribute("stroke", color));
        };
        $("#hintline", el).innerHTML = `<span>Farbe wählen, Bereich antippen: <b id="cnt">0 von 15</b></span>`;
        $("#palette", el).hidden = false;
        $("#again", el).hidden = true;
        $("#next", el).hidden = false;
        $("#next", el).textContent = "Fertig";
        G.say("Geschafft! Jetzt mal Cheyenne an: Fell, Mähne, Hufe, Sattel und mehr. Auch der Himmel will Farbe!");
        let color = COLORS[0][0];
        el.querySelectorAll(".sw").forEach((b, i) => {
          b.setAttribute("aria-pressed", i === 0);
          b.onclick = () => {
            color = b.dataset.c;
            el.querySelectorAll(".sw").forEach((o) => o.setAttribute("aria-pressed", o === b));
            G.sfx("tap");
          };
        });
        const total = 15;
        svg.addEventListener("pointerdown", (e) => {
          const part = e.target.closest("[data-part]");
          if (!part) return;
          const name = part.dataset.part;
          const root = HORSE_PARTS.includes(name) ? paint : bg;
          setPart(root, name, color);
          if (HORSE_PARTS.includes(name)) { hs[name] = color; G.save(); }
          if (!colored.has(name)) {
            colored.add(name);
            $("#cnt", el).textContent = `${colored.size} von ${total}`;
            if (colored.size === 5) G.say("Wunderschön! Hast du schon die Hufe und die Blesse im Gesicht entdeckt?");
            if (colored.size === 10) G.say("So bunt! Fehlen noch Wolken, Blumen oder die Strümpfe an den Beinen?");
            if (colored.size === total) { G.say("Alles ausgemalt! Cheyenne ist jetzt ein echtes Kunstwerk."); G.sfx("ok"); }
          }
          G.sfx("find");
        });
      };

      const onDown = (e) => {
        down = true;
        svg.setPointerCapture(e.pointerId);
        const p = G.svgPoint(svg, e);
        last = p;
        d += `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        strokeEl.setAttribute("d", d);
        mark(p);
      };
      svg.addEventListener("pointerdown", onDown);
      svg.addEventListener("pointermove", (e) => {
        if (!down || phase !== 1) return;
        const p = G.svgPoint(svg, e);
        const dist = Math.hypot(p.x - last.x, p.y - last.y);
        const steps = Math.max(1, Math.ceil(dist / 6));
        for (let i = 1; i <= steps; i++) mark({ x: last.x + ((p.x - last.x) * i) / steps, y: last.y + ((p.y - last.y) * i) / steps });
        d += `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        strokeEl.setAttribute("d", d);
        last = p;
        update();
      });
      const up = () => { down = false; };
      svg.addEventListener("pointerup", up);
      svg.addEventListener("pointercancel", up);

      $("#again", el).onclick = () => {
        d = ""; strokeEl.setAttribute("d", "");
        samples.forEach((s, i) => { s.hit = false; dotEls[i].classList.remove("hit"); });
        said = 0; pct.textContent = "0 %"; G.sfx("tap");
        G.say("Kein Problem, versuch es nochmal. Du schaffst das!");
      };
      $("#next", el).onclick = () => { G.sfx("tap"); G.go("win", { level: 0 }); };
    },
  });
})();
