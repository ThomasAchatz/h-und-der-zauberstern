"use strict";
/* Level 2: Europapark. Mama und Michael wiederfinden, Achterbahn nachzeichnen und fahren, Unterschiede finden. */
(() => {
  const G = Game;
  const $ = G.$;
  const LABEL = "Level 2 · Europapark";

  /* ---------- Figuren für das Gewimmel ---------- */
  const SKIN = ["#F6D2B8", "#E9B48E", "#C98E66", "#8D5A3B"];
  const person = (o) => {
    const s = SKIN[o.skin || 0];
    const hair = o.hair || "#6B4423";
    const kid = o.kid;
    const k = kid ? 0.78 : 1;
    const hand = 11;
    let item = "";
    if (o.item === "balloon") item = `<path d="M${hand} -22Q18 -42 16 -62" stroke="#777" stroke-width=".9" fill="none"/><ellipse cx="16" cy="-71" rx="7.5" ry="9" fill="${o.itemColor}"/><ellipse cx="13.5" cy="-74" rx="2" ry="3" fill="#fff" opacity=".45"/><path d="M15 -62l1-2 1 2z" fill="${o.itemColor}"/>`;
    if (o.item === "pretzel") item = `<g transform="translate(14 -24)"><path d="M-5 2C-9 -2 -6 -8 -1 -5L1 -2L3 -5C8 -8 10 -2 6 2C3 5 -2 5 -5 2Z" fill="none" stroke="#A8662E" stroke-width="2.6"/><circle cx="-3" cy="0" r=".6" fill="#fff"/><circle cx="3" cy="-1" r=".6" fill="#fff"/></g>`;
    if (o.item === "ice") item = `<g transform="translate(13 -24)"><path d="M-3 0L0 8L3 0z" fill="#D9A35B"/><circle cx="0" cy="-2" r="3.6" fill="${o.itemColor || "#F7B6D2"}"/></g>`;
    let hat = "";
    if (o.hat === "sun") hat = `<ellipse cx="0" cy="-53" rx="13" ry="3.4" fill="${o.hatColor}"/><path d="M-7 -53Q-7 -63 0 -63Q7 -63 7 -53z" fill="${o.hatColor}"/><path d="M-7 -55H7" stroke="#000" stroke-opacity=".25" stroke-width="1.6"/>`;
    if (o.hat === "cap") hat = `<path d="M-8.5 -51Q-8 -60 0 -60Q8 -60 8.5 -51z" fill="${o.hatColor}"/><path d="M5 -51.5H15Q14 -49 6 -49z" fill="${o.hatColor}"/><path d="M-8 -51.5H8" stroke="#000" stroke-opacity=".2" stroke-width="1"/>`;
    const longHair = o.long ? `<path d="M-9 -50Q-11 -36 -7 -32H7Q11 -36 9 -50z" fill="${hair}"/>` : "";
    const topHair = o.hat ? "" : `<path d="M-8.5 -49Q-9 -58 0 -58Q9 -58 8.5 -49Q4 -54 0 -53Q-4 -54 -8.5 -49z" fill="${hair}"/>`;
    return `<g transform="scale(${k})">
<ellipse cx="0" cy="0" rx="11" ry="2.6" fill="#000" opacity=".18"/>
${longHair}
<path d="M-5.2 -20V-1M5.2 -20V-1" stroke="${o.pants || "#3D5A80"}" stroke-width="4.6" stroke-linecap="round"/>
<path d="M-7.5 -1h5M2.5 -1h5" stroke="#333" stroke-width="2.6" stroke-linecap="round"/>
<path d="M-9 -38Q-9 -41 -5 -41H5Q9 -41 9 -38L${o.dress ? "12 -14H-12" : "9 -19H-9"}z" fill="${o.shirt}"/>
<path d="M-8.5 -38L-12 -23M8.5 -38L${hand} -23" stroke="${o.shirt}" stroke-width="4.2" stroke-linecap="round"/>
<circle cx="-12" cy="-22" r="2.2" fill="${s}"/><circle cx="${hand}" cy="-22" r="2.2" fill="${s}"/>
<rect x="-2.2" y="-44" width="4.4" height="4" fill="${s}"/>
<circle cx="0" cy="-49" r="8.2" fill="${s}"/>
${topHair}
<circle cx="-2.8" cy="-48.5" r="1.05" fill="#2B1C12"/><circle cx="2.8" cy="-48.5" r="1.05" fill="#2B1C12"/>
<path d="M-2.2 -45.2Q0 -43.6 2.2 -45.2" stroke="#A24F4F" stroke-width=".9" fill="none" stroke-linecap="round"/>
${hat}${item}</g>`;
  };

  /* who: Ziel (mama, michael) oder Ablenkung mit Grund, warum es nicht passt */
  const CROWD = [
    { x: 34, y: 268, sc: 0.85, who: "x", why: "mama-hat", o: { long: 1, hair: "#3B2314", shirt: "#6BB7E8", pants: "#2F4858", hat: "sun", hatColor: "#FFD23F", item: "ice", dress: 1 } },
    { x: 104, y: 264, sc: 0.85, who: "x", why: "michael-cap", o: { skin: 1, shirt: "#F28C28", pants: "#3D5A80", hat: "cap", hatColor: "#4E9A3E", item: "balloon", itemColor: "#3D7BD9" } },
    { x: 262, y: 266, sc: 0.85, who: "michael", o: { hair: "#5A3A22", shirt: "#FFFFFF", pants: "#3D5A80", hat: "cap", hatColor: "#4E9A3E", item: "pretzel" } },
    { x: 332, y: 262, sc: 0.85, who: "x", why: "mama-ballon", o: { long: 1, skin: 2, hair: "#1F120C", shirt: "#9B7BD4", pants: "#4B3B6B", hat: "sun", hatColor: "#3D7BD9", item: "balloon", itemColor: "#D93B36", dress: 1 } },
    { x: 48, y: 330, sc: 1, who: "x", why: "michael-brezel", o: { skin: 0, hair: "#C99660", shirt: "#5FA450", pants: "#5A4632", hat: "cap", hatColor: "#D93B36", item: "pretzel" } },
    { x: 118, y: 326, sc: 1, who: "x", why: "kind", o: { kid: 1, hair: "#E0BC90", shirt: "#FFD23F", pants: "#3D7BD9", item: "balloon", itemColor: "#D93B36" } },
    { x: 252, y: 330, sc: 1, who: "x", why: "mama-ohne", o: { long: 1, skin: 1, hair: "#8A552B", shirt: "#F29AC1", pants: "#3D5A80", item: "balloon", itemColor: "#FFD23F", dress: 1 } },
    { x: 322, y: 334, sc: 1, who: "mama", o: { long: 1, hair: "#6B4423", shirt: "#B8326F", pants: "#2F4858", hat: "sun", hatColor: "#FFD23F", item: "balloon", itemColor: "#D93B36", dress: 1 } },
    { x: 36, y: 392, sc: 1.12, who: "x", why: "michael-ohne", o: { skin: 3, hair: "#1F120C", shirt: "#3D7BD9", pants: "#2F2F2F", item: "ice", itemColor: "#FFF3C4" } },
    { x: 140, y: 396, sc: 1.12, who: "x", why: "kind-kappe", o: { kid: 1, skin: 1, hair: "#3B2314", shirt: "#D93B36", pants: "#3D5A80", hat: "cap", hatColor: "#4E9A3E" } },
    { x: 330, y: 396, sc: 1.12, who: "x", why: "mama-weiss", o: { long: 1, skin: 0, hair: "#E0BC90", shirt: "#5FA450", pants: "#3D5A80", hat: "sun", hatColor: "#FFFFFF", item: "pretzel", dress: 1 } },
  ];
  const WHY = {
    "mama-hat": "Gelber Hut, aber kein roter Ballon. Das ist nicht Mama!",
    "mama-ballon": "Roter Ballon, aber der Hut ist blau. Das ist nicht Mama!",
    "mama-ohne": "Diese Frau hat keinen Hut. Mama trägt einen gelben Sonnenhut.",
    "mama-weiss": "Der Hut ist weiß, nicht gelb. Schau weiter!",
    "michael-cap": "Grüne Kappe, aber keine Brezel. Das ist nicht Michael!",
    "michael-brezel": "Eine Brezel, aber die Kappe ist rot. Das ist nicht Michael!",
    "michael-ohne": "Dieser Mann hat gar keine Kappe auf. Such weiter!",
    kind: "Das ist ein Kind mit Ballon. Mama ist größer und hat einen gelben Hut.",
    "kind-kappe": "Grüne Kappe, aber das ist ein Kind. Michael ist erwachsen und hat eine Brezel.",
  };

  const findG = (id, x, y, sc, inner, r = 30, ry = 42, mark = "") => `<g class="find" data-find="${id}"${mark ? ` data-mark="${mark}"` : ""} transform="translate(${x} ${y}) scale(${sc})">
<ellipse cx="0" cy="${-ry + 8}" rx="${r - 8}" ry="${ry}" fill="transparent"/><g class="item">${inner}</g>
</g>`;

  const ticket = `<g transform="rotate(-14)"><rect x="-13" y="-8" width="26" height="16" rx="2.5" fill="#FFD23F" stroke="#C9A23A" stroke-width="1.4"/><path d="M5 -8V8" stroke="#C9A23A" stroke-width="1.2" stroke-dasharray="2 2"/><polygon points="${Art.starPts(4.5)}" transform="translate(-4 0)" fill="#B8326F"/></g>`;
  const teddy = `<circle cx="-6" cy="-14" r="3.6" fill="#B07A45"/><circle cx="6" cy="-14" r="3.6" fill="#B07A45"/><ellipse cx="0" cy="0" rx="8" ry="9" fill="#B07A45"/><circle cx="0" cy="-10" r="7" fill="#C38B53"/><circle cx="-2.4" cy="-11" r="1" fill="#2B1C12"/><circle cx="2.4" cy="-11" r="1" fill="#2B1C12"/><ellipse cx="0" cy="-8" rx="2.6" ry="1.8" fill="#E8C9A0"/><ellipse cx="0" cy="2" rx="4.5" ry="5" fill="#E8C9A0"/>`;
  const glasses = `<g transform="rotate(8)"><circle cx="-6" cy="0" r="5" fill="#2B2B2B"/><circle cx="6" cy="0" r="5" fill="#2B2B2B"/><path d="M-1 -1Q0 -2.5 1 -1M-11 -1L-14 -4M11 -1L14 -4" stroke="#B8326F" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="-7.5" cy="-1.5" r="1.4" fill="#fff" opacity=".5"/><circle cx="4.5" cy="-1.5" r="1.4" fill="#fff" opacity=".5"/></g>`;

  const ferrisWheel = (cx, cy, r) => {
    const n = 8;
    const spokes = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `M${cx} ${cy}L${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`; }).join("");
    const cols = ["#D93B36", "#FFD23F", "#3D7BD9", "#5FA450", "#F29AC1", "#F28C28", "#9B7BD4", "#6BB7E8"];
    const gondolas = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + 0.2; const x = cx + Math.cos(a) * r; const y = cy + Math.sin(a) * r; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)}v4" stroke="#6F757B" stroke-width="1.4"/><rect x="${(x - 7).toFixed(1)}" y="${(y + 4).toFixed(1)}" width="14" height="11" rx="4" fill="${cols[i]}"/>`; }).join("");
    return `<path d="M${cx - 34} ${cy + r + 34}L${cx} ${cy}L${cx + 34} ${cy + r + 34}" stroke="#8A9199" stroke-width="5" fill="none"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#C9CED3" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="#DDE1E5" stroke-width="1.5"/>
<path d="${spokes}" stroke="#C9CED3" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="6" fill="#8A9199"/>${gondolas}`;
  };

  const house = (x, w, h, wall, roof, flag) => `<g transform="translate(${x} 236)">
<rect x="0" y="${-h}" width="${w}" height="${h}" fill="${wall}"/><rect x="0" y="${-h}" width="${w}" height="${h}" fill="#000" opacity=".05"/>
<polygon points="-5,${-h} ${w / 2},${-h - w * 0.55} ${w + 5},${-h}" fill="${roof}"/>
${Array.from({ length: Math.floor(w / 18) }, (_, i) => `<rect x="${7 + i * 18}" y="${-h + 10}" width="9" height="11" rx="1.5" fill="#CFEAF5" stroke="#fff" stroke-width="1.5"/>`).join("")}
<rect x="${w / 2 - 7}" y="-18" width="14" height="18" rx="6" fill="#7A4B2E"/>
${flag ? `<path d="M${w / 2} ${-h - w * 0.55}v-16" stroke="#6F757B" stroke-width="1.6"/><path d="M${w / 2} ${-h - w * 0.55 - 16}l14 4-14 4z" fill="${flag}"/>` : ""}</g>`;

  const park = () => {
    const coaster = "M180 200C200 200 206 96 236 96C266 96 262 170 290 170C318 170 318 70 352 70L380 70";
    const supports = [190, 214, 236, 258, 280, 300, 322, 344, 366].map((x) => `M${x} 236V${x < 230 ? 150 : x < 260 ? 110 : x < 300 ? 168 : 86}`).join("");
    return `<svg id="scene" class="scene" viewBox="0 -40 360 440" role="img" aria-label="Wimmelbild im Freizeitpark. Mama und Michael und drei Sachen verstecken sich.">
<rect y="-40" width="360" height="440" fill="url(#g-sky)"/>${Art.sunAndClouds()}
${ferrisWheel(80, 104, 74)}
<path d="${supports}" stroke="#B9BEC4" stroke-width="3"/>
<path d="${coaster}" fill="none" stroke="#B8326F" stroke-width="6" stroke-linecap="round"/><path d="${coaster}" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 5"/>
${house(150, 50, 60, "#F6E7D4", "#B8326F", "#3D7BD9")}${house(206, 44, 46, "#FFE3A3", "#3D7BD9", "")}${house(258, 56, 70, "#D6ECF7", "#D93B36", "#FFD23F")}${house(320, 44, 50, "#F7D3E3", "#5FA450", "")}
${Art.treeG(14, 128).replace('transform="translate(14 128)"', 'transform="translate(14 150) scale(.75)"')}
<path d="M0 236H360V400H0z" fill="#EADCC4"/>
<path d="M0 236H360" stroke="#CDBB9C" stroke-width="3"/>
<g stroke="#DCCBAE" stroke-width="1.2" opacity=".8"><path d="M0 270H360M0 310H360M0 352H360"/><path d="M40 236L20 400M120 236L110 400M240 236L250 400M320 236L340 400"/></g>
<ellipse cx="184" cy="312" rx="44" ry="16" fill="#9AA1A8"/><ellipse cx="184" cy="308" rx="38" ry="12" fill="#6BB7E8"/><ellipse cx="176" cy="305" rx="14" ry="3" fill="#fff" opacity=".5"/>
<path d="M184 306V284" stroke="#9AA1A8" stroke-width="5"/><path d="M184 284Q170 288 168 300M184 284Q198 288 200 300" stroke="#9ED3F1" stroke-width="2.4" fill="none"/>
<g><rect x="196" y="370" width="56" height="7" rx="3" fill="#A5733F"/><rect x="196" y="360" width="56" height="6" rx="3" fill="#C99660"/><path d="M202 377v12M246 377v12" stroke="#6B4423" stroke-width="3"/></g>
${findG("glasses", 222, 362, 1, glasses, 22, 18)}
${findG("teddy", 70, 236, 1, `<g transform="translate(0 -4)">${teddy}</g>`, 22, 22)}
${findG("ticket", 86, 356, 1, ticket, 22, 18)}
${CROWD.map((c, i) => c.who === "x" ? `<g class="person" data-i="${i}" transform="translate(${c.x} ${c.y}) scale(${c.sc})"><ellipse cx="0" cy="-34" rx="20" ry="40" fill="transparent"/><g class="wob">${person(c.o)}</g></g>` : findG(c.who, c.x, c.y, c.sc, person(c.o), 26, 44, `${c.x},${(c.y - 30 * c.sc).toFixed(1)},${(25 * c.sc + 3).toFixed(1)}`)).join("")}
</svg>`;
  };

  const faceIcon = (hatColor, hat, found) => {
    const c = found ? null : "#A8978C";
    const f = (v) => (found ? v : "none");
    return `<svg aria-hidden="true" viewBox="0 0 32 32" width="30" height="30"><circle cx="16" cy="19" r="9" fill="${f("#F6D2B8")}" stroke="${c || "none"}" stroke-width="2.5"/>${hat === "sun" ? `<ellipse cx="16" cy="11" rx="14" ry="3.5" fill="${f(hatColor)}" stroke="${c || "none"}" stroke-width="2.2"/><path d="M8.5 11Q8.5 2 16 2Q23.5 2 23.5 11" fill="${f(hatColor)}" stroke="${c || "none"}" stroke-width="2.2"/>` : `<path d="M7 13Q7 4 16 4Q25 4 25 13z" fill="${f(hatColor)}" stroke="${c || "none"}" stroke-width="2.2"/><path d="M22 13h8" stroke="${found ? hatColor : c}" stroke-width="3" stroke-linecap="round"/>`}${found ? `<circle cx="13" cy="19" r="1.3" fill="#2B1C12"/><circle cx="19" cy="19" r="1.3" fill="#2B1C12"/>` : ""}</svg>`;
  };
  const objIcon = (inner, found) => `<svg aria-hidden="true" viewBox="-16 -16 32 32" width="30" height="30"><g style="${found ? "" : "filter:grayscale(1);opacity:.45"}">${inner}</g></svg>`;
  const FINDS = [
    ["mama", "Mama", (f) => faceIcon("#FFD23F", "sun", f), "Mama trägt einen gelben Sonnenhut und hält einen roten Luftballon."],
    ["michael", "Michael", (f) => faceIcon("#4E9A3E", "cap", f), "Michael hat eine grüne Kappe auf und isst eine Brezel."],
    ["ticket", "Karte", (f) => objIcon(ticket, f), "Die Eintrittskarte liegt links auf dem Boden."],
    ["teddy", "Teddy", (f) => objIcon(`<g transform="translate(0 4)">${teddy}</g>`, f), "Der Teddy sitzt ganz hinten bei den Bäumen."],
    ["glasses", "Brille", (f) => objIcon(glasses, f), "Die Sonnenbrille liegt auf der Bank."],
  ];

  G.screens.l2find = () => ({
    html: `${G.top(LABEL)}${G.steps(0, 3, "Wiederfinden")}
<div class="stage">${park()}</div>
${G.minaRow("Oje, wir haben Mama und Michael verloren! Tippe unten auf Mama, dann sag ich dir, wie sie aussieht.")}
<ul class="finds">${FINDS.map(([id, name, ic]) => `<li data-li="${id}"><button class="slot" aria-label="${name}">${ic(false)}<span class="badge"><svg aria-hidden="true" viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10.5 L8.5 14 L15 6.5"/></svg></span></button><span>${name}</span></li>`).join("")}</ul>
<div class="actions"><button class="btn ghost" id="hint">Tipp von Mina</button><button class="btn" id="next" hidden>Weiter</button></div>`,
    mount(el) {
      const svg = $("#scene", el);
      const found = new Set();
      let hints = 0;
      el.querySelectorAll(".finds .slot").forEach((b) => {
        b.onclick = () => {
          const f = FINDS.find(([id]) => id === b.parentElement.dataset.li);
          G.say(f[3]); G.speak(f[3]); G.sfx("tap");
        };
      });
      const done = (id, g) => {
        found.add(id);
        g.classList.add("found"); g.classList.remove("pulse");
        G.markEl(svg, g);
        const li = $(`[data-li="${id}"]`, el);
        li.classList.add("got");
        const f = FINDS.find(([k]) => k === id);
        $(".slot", li).firstElementChild.outerHTML = f[2](true);
        G.sfx("find");
        const msg = { mama: "Da ist ja Mama! Sie winkt dir zu.", michael: "Michael! Er hat sogar eine Brezel für dich.", ticket: "Die Eintrittskarte! Gut aufheben.", teddy: "Der Teddy ist wieder da.", glasses: "Die Sonnenbrille! Die Sonne scheint heute so hell." }[id];
        if (found.size === FINDS.length) {
          G.say("Alle wieder da! Jetzt fahren wir Achterbahn. Juhu!");
          G.sfx("ok");
          $("#hint", el).hidden = true;
          $("#next", el).hidden = false;
        } else {
          const nextPerson = !found.has("mama") ? 0 : !found.has("michael") ? 1 : -1;
          G.say(msg + (id === "mama" && nextPerson === 1 ? " Und jetzt Michael: grüne Kappe und Brezel!" : ` Noch ${FINDS.length - found.size}.`));
        }
      };
      svg.addEventListener("pointerdown", (e) => {
        const f = e.target.closest(".find");
        if (f) { if (!found.has(f.dataset.find)) done(f.dataset.find, f); return; }
        const p = e.target.closest(".person");
        if (p) {
          const c = CROWD[+p.dataset.i];
          G.sfx("miss");
          G.say(WHY[c.why]);
          p.classList.remove("nope"); void p.getBBox(); p.classList.add("nope");
          return;
        }
        const pt = G.svgPoint(svg, e);
        G.ripple(svg, pt.x, pt.y);
      });
      $("#hint", el).onclick = () => {
        G.sfx("tap");
        const left = FINDS.find(([id]) => !found.has(id));
        if (!left) return;
        hints++;
        G.say(left[3]); G.speak(left[3]);
        if (hints >= 2 || !["mama", "michael"].includes(left[0])) {
          G.hintEl(svg, svg.querySelector(`[data-find="${left[0]}"]`));
        }
      };
      $("#next", el).onclick = () => { G.sfx("tap"); G.go("l2coaster", { round: 0 }); };
    },
  });

  /* ---------- 2) Achterbahn nachzeichnen und fahren ---------- */
  const TRACKS = [
    { d: "M20 250C60 250 72 120 120 120C168 120 168 226 210 226C252 226 252 88 300 88C348 88 352 250 384 250", name: "Sternenblitz" },
    { d: "M16 264C80 264 120 262 168 256C236 248 252 148 204 140C156 132 150 226 214 246C268 262 300 122 384 112", name: "Feen-Looping" },
  ];
  const wagon = () => `<g id="wagon"><g transform="translate(0 -6)">
<circle cx="-6" cy="-15" r="6.2" fill="url(#g-skin)"/><path d="M-12 -15Q-13 -23 -6 -23Q1 -23 0 -15Q-3 -19 -6 -19Q-9 -19 -12 -15z" fill="#C99660"/><path d="M-12.5 -14Q-14 -6 -10 -5" stroke="#C99660" stroke-width="2.4" fill="none"/>
<circle cx="8" cy="-13" r="4.6" fill="url(#g-skin)"/><path d="M3.6 -13Q3 -19 8 -19Q13 -19 12.4 -13Q10 -16 8 -16Q6 -16 3.6 -13z" fill="#C46A3A"/><path d="M12 -12l7 -5" stroke="#E8DCF7" stroke-width="3" stroke-linecap="round"/>
<rect x="-18" y="-10" width="34" height="13" rx="4" fill="#D93B36"/><rect x="-18" y="-10" width="34" height="4" rx="2" fill="#fff" opacity=".35"/>
<polygon points="${Art.starPts(3.6)}" transform="translate(-1 -3)" fill="#FFD23F"/>
<circle cx="-10" cy="5" r="3.6" fill="#3A2330"/><circle cx="8" cy="5" r="3.6" fill="#3A2330"/></g></g>`;

  G.screens.l2coaster = ({ round = 0 }) => {
    const t = TRACKS[round];
    return {
      html: `${G.top(LABEL)}${G.steps(1, 3, `Achterbahn ${round + 1}/2`)}
<div class="stage paper"><svg id="tsvg" viewBox="0 0 400 320" role="img" aria-label="Achterbahn ${t.name} zum Nachzeichnen">
<rect width="400" height="320" fill="#fff"/>
<g id="ride" style="display:none"><rect width="400" height="320" fill="url(#g-sky)"/><path d="M0 290Q120 276 260 290T400 284V320H0z" fill="url(#g-grass)"/><g id="supports" stroke="#B9BEC4" stroke-width="3"></g>
<path d="${t.d}" fill="none" stroke="#7A2455" stroke-width="9" stroke-linecap="round"/><path d="${t.d}" fill="none" stroke="#F29AC1" stroke-width="3" stroke-dasharray="2 6"/>
<g transform="translate(12 ${round ? 262 : 248})"><rect x="-8" y="-20" width="20" height="22" fill="#B8326F"/><path d="M-10 -20L2 -30L14 -20z" fill="#7A2455"/></g>
${wagon()}</g>
<path id="outline" d="${t.d}" fill="none" stroke="#C9B8C2" stroke-width="3" stroke-dasharray="7 6"/>
<g id="dots"></g>
<path id="stroke" d="" fill="none" stroke="#B8326F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
<g id="flags"><circle cx="${t.d.match(/M(\d+) (\d+)/)[1]}" cy="${t.d.match(/M(\d+) (\d+)/)[2]}" r="9" fill="#2F8F46"/><text x="${t.d.match(/M(\d+) (\d+)/)[1]}" y="${+t.d.match(/M(\d+) (\d+)/)[2] - 14}" text-anchor="middle" font-size="13" font-weight="600" fill="#2F8F46">Start</text></g>
</svg></div>
<div class="hint-line" id="hintline"><span>Zeichne die Schienen ab Start: <b id="pct">0 %</b></span></div>
${G.minaRow(round === 0 ? `Die Achterbahn ${t.name}! Die Schienen fehlen noch. Zeichne sie mit dem Finger nach.` : `Jetzt der ${t.name} mit Überschlag! Zeichne ihn nach.`)}
<div class="actions"><button class="btn ghost" id="again">Nochmal</button><button class="btn" id="next" hidden>Weiter</button></div>`,
      mount(el) {
        const svg = $("#tsvg", el);
        const outline = $("#outline", el);
        const strokeEl = $("#stroke", el);
        const dotsG = $("#dots", el);
        const N = 80;
        const len = outline.getTotalLength();
        const samples = Array.from({ length: N + 1 }, (_, i) => { const p = outline.getPointAtLength((i / N) * len); return { x: p.x, y: p.y, hit: false }; });
        dotsG.innerHTML = samples.map((s) => `<circle class="trace-dot" cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="3.4"/>`).join("");
        const dotEls = [...dotsG.children];
        let d = "", last = null, down = false, phase = 1, riding = false;
        const pct = $("#pct", el);
        const mark = (p) => samples.forEach((s, i) => { if (!s.hit && Math.hypot(s.x - p.x, s.y - p.y) < 20) { s.hit = true; dotEls[i].classList.add("hit"); } });

        const ride = () => {
          if (riding) return;
          riding = true;
          const wag = $("#wagon", el);
          const path = svg.querySelector("#ride path:nth-of-type(2)");
          const L = path.getTotalLength();
          const t0 = performance.now();
          const dur = 4200;
          G.sfx("ok");
          const step = (now) => {
            const k = Math.min(1, (now - t0) / dur);
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            const a = path.getPointAtLength(e * L);
            const b = path.getPointAtLength(Math.min(L, e * L + 1));
            const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
            wag.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
            if (k < 1) requestAnimationFrame(step);
            else { riding = false; G.sfx("win"); G.say(round === 0 ? "Juhuuu! Das war toll! Noch eine Achterbahn wartet." : "Wow, ein Überschlag! Mir ist ganz schwindelig. Weiter geht's!"); $("#again", el).hidden = false; }
          };
          requestAnimationFrame(step);
        };

        const toRide = () => {
          phase = 2;
          G.sfx("win");
          ["#outline", "#dots", "#stroke", "#flags"].forEach((q) => ($(q, el).style.display = "none"));
          const sup = $("#supports", el);
          const path = svg.querySelector("#ride path:nth-of-type(2)");
          const L = path.getTotalLength();
          let s = "";
          for (let i = 1; i < 28; i++) { const p = path.getPointAtLength((i / 28) * L); s += `M${p.x.toFixed(1)} ${(p.y + 4).toFixed(1)}V300`; }
          sup.innerHTML = `<path d="${s}"/>`;
          $("#ride", el).style.display = "";
          $("#hintline", el).innerHTML = "<span>Toll gezeichnet! Los geht's!</span>";
          G.say("Super, die Schienen sind fertig! Hannah und ich steigen ein. Festhalten!");
          $("#again", el).textContent = "Nochmal fahren";
          $("#again", el).hidden = true;
          $("#next", el).hidden = false;
          setTimeout(ride, 700);
        };

        const update = () => {
          const v = Math.round((samples.filter((s) => s.hit).length / samples.length) * 100);
          pct.textContent = v + " %";
          if (v >= 88 && phase === 1) toRide();
        };
        const onDown = (e) => {
          if (phase !== 1) return;
          down = true; svg.setPointerCapture(e.pointerId);
          const p = G.svgPoint(svg, e); last = p;
          d += `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`; strokeEl.setAttribute("d", d); mark(p);
        };
        svg.addEventListener("pointerdown", onDown);
        svg.addEventListener("pointermove", (e) => {
          if (!down || phase !== 1) return;
          const p = G.svgPoint(svg, e);
          const steps = Math.max(1, Math.ceil(Math.hypot(p.x - last.x, p.y - last.y) / 6));
          for (let i = 1; i <= steps; i++) mark({ x: last.x + ((p.x - last.x) * i) / steps, y: last.y + ((p.y - last.y) * i) / steps });
          d += `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`; strokeEl.setAttribute("d", d); last = p; update();
        });
        const up = () => { down = false; };
        svg.addEventListener("pointerup", up);
        svg.addEventListener("pointercancel", up);
        $("#again", el).onclick = () => {
          G.sfx("tap");
          if (phase === 2) { $("#again", el).hidden = true; ride(); return; }
          d = ""; strokeEl.setAttribute("d", "");
          samples.forEach((s, i) => { s.hit = false; dotEls[i].classList.remove("hit"); });
          pct.textContent = "0 %";
          G.say("Kein Problem, nochmal von vorne. Du schaffst das!");
        };
        $("#next", el).onclick = () => { G.sfx("tap"); round === 0 ? G.go("l2coaster", { round: 1 }) : G.go("l2diff"); };
      },
    };
  };

  /* ---------- 3) Unterschiede finden ---------- */
  const DIFFS = [
    { id: "balloon", x: 64, y: 128, r: 22 },
    { id: "flag", x: 180, y: 22, r: 22 },
    { id: "horse", x: 232, y: 136, r: 26 },
    { id: "bird", x: 300, y: 40, r: 22 },
    { id: "cone", x: 320, y: 170, r: 24 },
  ];
  const carousel = (b) => {
    const horseAt = (x, y, col, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -0.14 : 0.14} .14) translate(-200 -170)">${Art.horseG({ body: col, mane: "#FFFFFF", tail: "#FFFFFF", tack: false, hooves: "#FFD23F" })}</g>`;
    return `<svg viewBox="0 0 360 220" class="diff" role="img" aria-label="Karussell im Freizeitpark">
<rect width="360" height="220" fill="url(#g-sky)"/>
<circle cx="40" cy="30" r="16" fill="url(#g-sun)"/>
<g fill="#fff" opacity=".9"><ellipse cx="110" cy="34" rx="22" ry="8"/><ellipse cx="124" cy="28" rx="14" ry="8"/></g>
${b ? "" : `<path d="M292 40q5-6 9 0q4-6 9 0" stroke="#3A2330" stroke-width="2" fill="none" stroke-linecap="round"/>`}
<path d="M0 184H360V220H0z" fill="#EADCC4"/><path d="M0 184H360" stroke="#CDBB9C" stroke-width="2"/>
<path d="M180 30V40" stroke="#6F757B" stroke-width="2"/>${b ? "" : `<path d="M180 14V30" stroke="#6F757B" stroke-width="2"/><path d="M180 14l16 5-16 5z" fill="#D93B36"/>`}
<path d="M110 74L180 36L250 74z" fill="#B8326F"/><path d="M180 36L158 74H180zM180 36L216 74H202z" fill="#fff" opacity=".85"/>
<path d="M106 74H254" stroke="#FFD23F" stroke-width="6" stroke-linecap="round"/>
<path d="M110 80q10 8 20 0q10 8 20 0q10 8 20 0q10 8 20 0q10 8 20 0q10 8 20 0q10 8 20 0" fill="#FFF1DC" stroke="#B8326F" stroke-width="1.5"/>
<path d="M128 84V164M180 84V164M232 84V164" stroke="#C9A23A" stroke-width="3"/>
<ellipse cx="180" cy="168" rx="80" ry="12" fill="#7A2455"/><ellipse cx="180" cy="164" rx="80" ry="10" fill="#B8326F"/>
${horseAt(128, 128, "#FFFFFF")}${horseAt(180, 132, "#6BB7E8")}${horseAt(232, 128, b ? "#F29AC1" : "#FFD23F", true)}
<g transform="translate(52 184)">${person({ kid: 1, hair: "#C99660", shirt: "#5FA450", pants: "#3D5A80", item: "balloon", itemColor: b ? "#3D7BD9" : "#D93B36" })}</g>
<g transform="translate(320 184)"><rect x="-16" y="-44" width="32" height="44" rx="4" fill="#F6E7D4"/><path d="M-20 -44H20L14 -54H-14z" fill="#3D7BD9"/>${b ? `<path d="M-6 -14L0 0L6 -14z" fill="#D9A35B"/><circle cx="0" cy="-17" r="5" fill="#9ED3F1"/>` : `<path d="M-6 -14L0 0L6 -14z" fill="#D9A35B"/><circle cx="0" cy="-17" r="5" fill="#F7B6D2"/><circle cx="0" cy="-24" r="4.5" fill="#FFF3C4"/>`}</g>
<g class="marks"></g></svg>`;
  };

  G.screens.l2diff = () => ({
    html: `${G.top(LABEL)}${G.steps(2, 3, "Unterschiede")}
<div class="stage twin">${carousel(false)}${carousel(true)}</div>
<div class="hint-line"><span>Gefunden: <b id="cnt">0 von 5</b></span></div>
${G.minaRow("Die zwei Bilder sehen gleich aus. Aber es gibt 5 Unterschiede! Tippe sie an.")}
<div class="actions"><button class="btn ghost" id="hint">Tipp von Mina</button><button class="btn" id="next" hidden>Weiter</button></div>`,
    mount(el) {
      const svgs = [...el.querySelectorAll("svg.diff")];
      const found = new Set();
      const HINTS = { balloon: "Schau dir den Luftballon von dem Kind an.", flag: "Schau ganz oben auf das Karussell-Dach.", horse: "Vergleiche die Pferde im Karussell.", bird: "Schau in den Himmel rechts oben.", cone: "Schau zum Eisstand. Wie viele Kugeln hat das Eis?" };
      const markAll = (df) => svgs.forEach((s) => G.markFound(s, df.x, df.y, df.r));
      svgs.forEach((s) => s.addEventListener("pointerdown", (e) => {
        const p = G.svgPoint(s, e);
        const df = DIFFS.find((d) => !found.has(d.id) && Math.hypot(d.x - p.x, d.y - p.y) < d.r + 8);
        if (df) {
          found.add(df.id); markAll(df); G.sfx("find");
          $("#cnt", el).textContent = `${found.size} von 5`;
          if (found.size === 5) { G.say("Alle 5 Unterschiede gefunden! Du hast Adleraugen."); G.sfx("ok"); $("#hint", el).hidden = true; $("#next", el).hidden = false; }
          else G.say(["Gut gesehen!", "Genau, da ist was anders!", "Super, weiter so!", "Noch einer, du schaffst das!"][found.size - 1]);
        } else {
          G.ripple(s, p.x, p.y);
        }
      }));
      $("#hint", el).onclick = () => { G.sfx("tap"); const d = DIFFS.find((x) => !found.has(x.id)); if (d) { G.say(HINTS[d.id]); G.speak(HINTS[d.id]); } };
      $("#next", el).onclick = () => { G.sfx("tap"); G.go("win", { level: 1 }); };
    },
  });
})();
