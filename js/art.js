"use strict";
/* Alle Grafiken als SVG-Strings: Hanna, Mina, Cheyenne und die Szenen. */
const Art = (() => {
  const starPts = (r) => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 === 0 ? r : r * 0.46;
      p.push((Math.cos(a) * rr).toFixed(1) + "," + (Math.sin(a) * rr).toFixed(1));
    }
    return p.join(" ");
  };
  const star = (r, extra = "") =>
    `<polygon points="${starPts(r)}" fill="url(#g-star)" stroke="#D99A1E" stroke-width="${Math.max(1.2, r / 9).toFixed(1)}" stroke-linejoin="round" ${extra}/>`;

  /* Gemeinsame Verläufe und Muster, einmal im Dokument */
  const defs = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="g-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCDFC9"/><stop offset="1" stop-color="#EDB594"/></linearGradient>
<linearGradient id="g-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E0BC90"/><stop offset="1" stop-color="#B2824F"/></linearGradient>
<linearGradient id="g-pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DB4C92"/><stop offset="1" stop-color="#AE2C6B"/></linearGradient>
<linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED3F1"/><stop offset="1" stop-color="#E6F5FC"/></linearGradient>
<linearGradient id="g-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2A6E"/><stop offset="1" stop-color="#7B5DB5"/></linearGradient>
<linearGradient id="g-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9DE92"/><stop offset="1" stop-color="#86BC63"/></linearGradient>
<linearGradient id="g-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A5D184"/><stop offset="1" stop-color="#8DC26C"/></linearGradient>
<linearGradient id="g-barn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6745E"/><stop offset="1" stop-color="#BC4533"/></linearGradient>
<linearGradient id="g-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9B4C3F"/><stop offset="1" stop-color="#6C2E27"/></linearGradient>
<linearGradient id="g-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C99660"/><stop offset="1" stop-color="#A57240"/></linearGradient>
<linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8B6239"/><stop offset="1" stop-color="#6B4724"/></linearGradient>
<linearGradient id="g-horse" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BE814B"/><stop offset="1" stop-color="#8A552B"/></linearGradient>
<linearGradient id="g-straw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D67E"/><stop offset="1" stop-color="#DDB351"/></linearGradient>
<linearGradient id="g-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset="1" stop-color="#D5C8F7" stop-opacity=".85"/></linearGradient>
<linearGradient id="g-minadress" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8AFD4"/><stop offset="1" stop-color="#E27CB3"/></linearGradient>
<linearGradient id="g-star" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0A0"/><stop offset="1" stop-color="#FFC93C"/></linearGradient>
<radialGradient id="g-sun"><stop offset="0" stop-color="#FFF6BF"/><stop offset=".6" stop-color="#FFE278"/><stop offset="1" stop-color="#FFD25C"/></radialGradient>
<radialGradient id="g-glow"><stop offset="0" stop-color="#FFF6BF" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6BF" stop-opacity="0"/></radialGradient>
<pattern id="p-lace" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.4" fill="none" stroke="#D3CABD" stroke-width="1"/><circle cx="0" cy="0" r="1.2" fill="#D3CABD"/><circle cx="8" cy="8" r="1.2" fill="#D3CABD"/></pattern>
<pattern id="p-ging" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#BADF9E"/><rect width="6" height="12" fill="#8FC46B" opacity=".55"/><rect width="12" height="6" fill="#8FC46B" opacity=".55"/></pattern>
<pattern id="p-motif" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0 0V18" stroke="#F7B3D4" stroke-opacity=".5" stroke-width="2"/><circle cx="9" cy="9" r="2.6" fill="#B5DB97"/><circle cx="9" cy="3" r="1.2" fill="#B5DB97"/></pattern>
<pattern id="p-planks" width="30" height="40" patternUnits="userSpaceOnUse"><rect width="30" height="40" fill="url(#g-wood)"/><path d="M0 0V40" stroke="#7B4F28" stroke-opacity=".5" stroke-width="2"/><path d="M8 6c2 8 2 16 0 26M20 10c-2 6-2 14 0 22" stroke="#8A5A2E" stroke-opacity=".3" stroke-width="1.2" fill="none"/></pattern>
<clipPath id="c-horse"><path d="${HORSE_BODY}"/></clipPath>
</defs></svg>`;

  /* ---------- Hanna ---------- */
  const hannaG = () => `
<ellipse cx="100" cy="402" rx="54" ry="7" fill="#000" opacity=".16"/>
<path d="M64 92C58 48 80 28 100 28s42 20 36 64l10 112c2 20-8 34-18 26V150H72v82c-10 8-20-6-18-26z" fill="url(#g-hair)"/>
<path d="M88 340v52M112 340v52" stroke="url(#g-skin)" stroke-width="13" stroke-linecap="round"/>
<path d="M82 372h12v22H82zM106 372h12v22h-12z" fill="#fff"/>
<ellipse cx="88" cy="398" rx="14" ry="7" fill="#7A4B2E"/><ellipse cx="112" cy="398" rx="14" ry="7" fill="#7A4B2E"/>
<path d="M70 236h60c18 46 32 90 44 126H26c12-36 26-80 44-126z" fill="url(#g-pink)"/>
<path d="M70 236h60c18 46 32 90 44 126H26c12-36 26-80 44-126z" fill="url(#p-motif)"/>
<path d="M86 240C80 290 70 330 58 362M114 240c6 50 16 90 28 122" stroke="#7E1745" stroke-opacity=".22" stroke-width="3" fill="none"/>
<path d="M76 152c8 10 40 10 48 0l7 84H69z" fill="url(#p-ging)" stroke="#C2478A" stroke-width="2.2" stroke-linejoin="round"/>
<g stroke="#B22E6E" stroke-width="3" stroke-linecap="round"><path d="M89 178l22 14M111 178l-22 14M89 196l22 14M111 196l-22 14M89 214l22 14M111 214l-22 14"/></g>
<g fill="#A9AFB5" stroke="#6F757B" stroke-width=".8"><circle cx="87" cy="178" r="3"/><circle cx="113" cy="178" r="3"/><circle cx="87" cy="196" r="3"/><circle cx="113" cy="196" r="3"/><circle cx="87" cy="214" r="3"/><circle cx="113" cy="214" r="3"/></g>
<rect x="68" y="230" width="64" height="10" rx="3" fill="#8E1F55"/>
<path d="M76 142l24 24 24-24 6 10-30 30-30-30z" fill="#fff" stroke="#E4DDD3" stroke-width="1.5"/>
<path d="M70 150C46 154 36 184 40 212l34-2 6-52z" fill="#fff" stroke="#E4DDD3" stroke-width="1.5"/>
<path d="M70 150C46 154 36 184 40 212l34-2 6-52z" fill="url(#p-lace)"/>
<path d="M130 150c24 4 34 34 30 62l-34-2-6-52z" fill="#fff" stroke="#E4DDD3" stroke-width="1.5"/>
<path d="M130 150c24 4 34 34 30 62l-34-2-6-52z" fill="url(#p-lace)"/>
<path d="M48 210c-4 20-2 36 6 50M152 210c4 20 2 36-6 50" stroke="url(#g-skin)" stroke-width="12" stroke-linecap="round" fill="none"/>
<circle cx="56" cy="264" r="7" fill="#EFB997"/><circle cx="144" cy="264" r="7" fill="#EFB997"/>
<path d="M66 96c-8 32-10 62-4 94 9-5 14-16 14-32V120z" fill="url(#g-hair)"/>
<path d="M134 96c8 32 10 62 4 94-9-5-14-16-14-32V120z" fill="url(#g-hair)"/>
<rect x="90" y="112" width="20" height="34" rx="9" fill="#EBB594"/>
<ellipse cx="68" cy="90" rx="5" ry="8" fill="url(#g-skin)"/><ellipse cx="132" cy="90" rx="5" ry="8" fill="url(#g-skin)"/>
<circle cx="68" cy="99" r="2" fill="#E8E8E8"/><circle cx="132" cy="99" r="2" fill="#E8E8E8"/>
<ellipse cx="100" cy="86" rx="32" ry="38" fill="url(#g-skin)"/>
<path d="M67 74C68 46 94 40 112 46c14 5 21 16 21 30-14-14-42-18-66-2z" fill="url(#g-hair)"/>
<path d="M80 52c-4 8-6 14-6 20M92 48c-4 8-6 16-6 24M104 48c-2 8-2 14-2 20" stroke="#A47848" stroke-opacity=".45" stroke-width="1.5" fill="none"/>
<path d="M68 72C76 34 124 34 132 72" stroke="#000" stroke-opacity=".14" stroke-width="13" fill="none" stroke-linecap="round" transform="translate(0 2)"/>
<path d="M68 72C76 34 124 34 132 72" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M72 66C82 42 118 42 128 66" stroke="#E6DFD4" stroke-width="2" fill="none"/>
<ellipse cx="86" cy="88" rx="6.5" ry="5" fill="#fff"/><circle cx="86" cy="88" r="3.8" fill="#6B4A32"/><circle cx="86" cy="88" r="1.8" fill="#1F120C"/><circle cx="87.6" cy="86.5" r="1.1" fill="#fff"/>
<ellipse cx="114" cy="88" rx="6.5" ry="5" fill="#fff"/><circle cx="114" cy="88" r="3.8" fill="#6B4A32"/><circle cx="114" cy="88" r="1.8" fill="#1F120C"/><circle cx="115.6" cy="86.5" r="1.1" fill="#fff"/>
<path d="M78 79q8-5 16-1M106 78q8-4 16 1" stroke="#9C7448" stroke-width="2" stroke-linecap="round" fill="none"/>
<path d="M79.5 87q-2-1-3-3M120.5 87q2-1 3-3" stroke="#4A2F26" stroke-width="1.4" stroke-linecap="round" fill="none"/>
<path d="M100 92c-2 8-3 10 1 12" stroke="#D49B7C" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<ellipse cx="80" cy="102" rx="8" ry="5" fill="#F2A0A0" opacity=".32"/><ellipse cx="120" cy="102" rx="8" ry="5" fill="#F2A0A0" opacity=".32"/>
<circle cx="90" cy="98" r="1" fill="#C98F6E" opacity=".4"/><circle cx="94" cy="101" r="1" fill="#C98F6E" opacity=".4"/><circle cx="110" cy="98" r="1" fill="#C98F6E" opacity=".4"/><circle cx="106" cy="101" r="1" fill="#C98F6E" opacity=".4"/>
<path d="M90 112q10 8 20 0" stroke="#C0606C" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M92 113q8 3 16 0" fill="#D98089" opacity=".45"/>`;
  const hanna = (cls = "") => `<svg class="${cls}" viewBox="0 0 200 410" role="img" aria-label="Hanna">${hannaG()}</svg>`;

  /* ---------- Mina, die Fee ---------- */
  const minaG = (noStar) => `
<ellipse cx="50" cy="60" rx="46" ry="46" fill="url(#g-glow)" opacity=".35"/>
<path d="M48 62C20 30 6 40 10 62c4 20 22 22 38 6z" fill="url(#g-wing)" stroke="#B7A7E8" stroke-width="1.5"/>
<path d="M52 62c28-32 42-22 38 0-4 20-22 22-38 6z" fill="url(#g-wing)" stroke="#B7A7E8" stroke-width="1.5"/>
<path d="M48 70C30 76 22 96 34 98c10 0 16-14 14-28z" fill="url(#g-wing)" stroke="#B7A7E8" stroke-width="1.2"/>
<path d="M52 70c18 6 26 26 14 28-10 0-16-14-14-28z" fill="url(#g-wing)" stroke="#B7A7E8" stroke-width="1.2"/>
<path d="M50 66c-8 0-12 6-14 14l-6 22c10 6 30 6 40 0l-6-22c-2-8-6-14-14-14z" fill="url(#g-minadress)"/>
<path d="M36 100c8 4 20 4 28 0" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M58 74l22-16" stroke="url(#g-skin)" stroke-width="5" stroke-linecap="round"/>
<path d="M80 58l8-12" stroke="#8B5A3C" stroke-width="2.5" stroke-linecap="round"/>
${noStar ? "" : `<circle cx="90" cy="42" r="15" fill="url(#g-glow)"/><g transform="translate(90 42)">${star(9)}</g>`}
<circle cx="50" cy="48" r="17" fill="url(#g-skin)"/>
<path d="M32 48c-3-19 9-28 20-28s23 9 18 29c-4-10-10-15-18-15s-14 4-20 14z" fill="#C46A3A"/>
<circle cx="66" cy="26" r="6.5" fill="#C46A3A"/>
<circle cx="44" cy="51" r="2.3" fill="#3A2330"/><circle cx="56" cy="51" r="2.3" fill="#3A2330"/>
<circle cx="44.7" cy="50.2" r=".8" fill="#fff"/><circle cx="56.7" cy="50.2" r=".8" fill="#fff"/>
<ellipse cx="39" cy="57" rx="3.6" ry="2.4" fill="#F2A0A0" opacity=".45"/><ellipse cx="61" cy="57" rx="3.6" ry="2.4" fill="#F2A0A0" opacity=".45"/>
<path d="M45 58q5 4 10 0" stroke="#B0505A" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  const mina = (cls = "") => `<svg class="${cls}" viewBox="0 0 100 112" role="img" aria-label="Die Fee Mina">${minaG()}</svg>`;
  const minaFace = () => `<svg viewBox="22 8 56 56" aria-hidden="true"><circle cx="50" cy="48" r="17" fill="url(#g-skin)"/><path d="M32 48c-3-19 9-28 20-28s23 9 18 29c-4-10-10-15-18-15s-14 4-20 14z" fill="#C46A3A"/><circle cx="66" cy="26" r="6.5" fill="#C46A3A"/><circle cx="44" cy="51" r="2.3" fill="#3A2330"/><circle cx="56" cy="51" r="2.3" fill="#3A2330"/><ellipse cx="39" cy="57" rx="3.6" ry="2.4" fill="#F2A0A0" opacity=".45"/><ellipse cx="61" cy="57" rx="3.6" ry="2.4" fill="#F2A0A0" opacity=".45"/><path d="M45 58q5 4 10 0" stroke="#B0505A" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;

  /* ---------- Cheyenne (Koordinaten 0..400 x 0..320, Blick nach rechts) ---------- */
  const HORSE_BODY = "M352 112C358 119 358 131 350 137C343 143 333 142 327 137C318 134 309 130 301 127C297 152 289 178 280 198C275 210 270 222 266 232L265 262L265 290L272 306L248 306L250 290L249 262L248 238C247 230 243 226 240 234L240 262L241 290L246 306L222 306L224 290L224 262L226 228C210 232 176 232 146 220L142 250L140 290L146 306L122 306L124 290L124 262L120 234C118 226 112 224 108 234L108 262L108 290L112 306L88 306L90 290L90 262L84 238C80 226 70 202 62 178C56 158 56 136 62 120C66 108 76 100 92 98C130 104 170 102 214 92C240 84 262 62 282 48L288 26L297 46L300 50C312 62 330 90 352 112Z";
  const horseG = (o = {}) => {
    const body = o.body || "url(#g-horse)";
    const mane = o.mane || "#3B2314";
    const st = o.stroke ? ` stroke="${o.stroke}" stroke-width="3" stroke-linejoin="round"` : "";
    return `
<g data-part="tail"><path d="M64 112C40 120 28 160 36 214C40 230 48 238 52 224C50 190 56 150 70 132Z" fill="${mane}"${st}/></g>
<g data-part="body">
 <path class="horse-body" d="${HORSE_BODY}" fill="${body}"${st}/>
 <g clip-path="url(#c-horse)" pointer-events="none">
  <ellipse cx="170" cy="240" rx="130" ry="34" fill="#000" opacity=".16"/>
  <ellipse cx="170" cy="104" rx="110" ry="14" fill="#fff" opacity=".16"/>
  <rect x="222" y="226" width="20" height="90" fill="#000" opacity=".18"/>
  <rect x="120" y="216" width="22" height="100" fill="#000" opacity=".18"/>
  <ellipse cx="330" cy="116" rx="26" ry="18" fill="#fff" opacity=".1"/>
  <path d="M0 296H400V320H0z" fill="#2B1C12" opacity=".0"/>
  <g fill="#2B1C12"><path d="M247 294H273V310H247z"/><path d="M221 294H247V310H221z"/><path d="M121 294H147V310H121z"/><path d="M87 294H113V310H87z"/></g>
 </g>
</g>
<g data-part="mane"><path d="M286 46C264 62 242 86 214 96C226 110 250 98 268 80C280 68 290 58 298 50Z" fill="${mane}"${st}/><path d="M296 48C301 62 305 71 301 82C292 73 290 60 296 48Z" fill="${mane}"${st}/></g>
<circle cx="322" cy="92" r="4.2" fill="#1B110B"/><circle cx="323.4" cy="90.8" r="1.3" fill="#fff"/>
<ellipse cx="346" cy="124" rx="3" ry="2" fill="#1B110B" opacity=".6" pointer-events="none"/>
`;
  };
  const horse = (o, cls = "") => `<svg class="${cls}" viewBox="0 0 400 320" role="img" aria-label="Cheyenne">${horseG(o)}</svg>`;

  /* ---------- Szenen ---------- */
  const sunAndClouds = () => `
<circle cx="300" cy="56" r="44" fill="url(#g-glow)"/><circle cx="300" cy="56" r="28" fill="url(#g-sun)"/>
<g fill="#fff" opacity=".92"><ellipse cx="66" cy="52" rx="34" ry="12"/><ellipse cx="92" cy="42" rx="24" ry="13"/><ellipse cx="46" cy="44" rx="20" ry="10"/>
<ellipse cx="206" cy="86" rx="26" ry="9"/><ellipse cx="224" cy="78" rx="18" ry="10"/></g>`;

  const meadow = () => `
<path d="M0 232Q70 190 150 224T300 214T360 226V420H0z" fill="url(#g-hill)"/>
<path d="M0 300Q120 270 250 296T360 288V420H0z" fill="url(#g-grass)"/>`;

  const flowers = () => `<g>
<circle cx="24" cy="318" r="3" fill="#fff"/><circle cx="24" cy="318" r="1.2" fill="#FFC93C"/>
<circle cx="150" cy="352" r="3" fill="#F7A8C8"/><circle cx="150" cy="352" r="1.2" fill="#FFC93C"/>
<circle cx="268" cy="330" r="3" fill="#fff"/><circle cx="268" cy="330" r="1.2" fill="#FFC93C"/>
<circle cx="340" cy="372" r="3" fill="#F7A8C8"/><circle cx="340" cy="372" r="1.2" fill="#FFC93C"/>
<circle cx="102" cy="384" r="3" fill="#fff"/><circle cx="102" cy="384" r="1.2" fill="#FFC93C"/></g>`;

  const treeG = (x, y) => `<g transform="translate(${x} ${y})">
<path d="M-8 120V40h16v80z" fill="#8A5A33"/>
<circle cx="0" cy="22" r="38" fill="#5FA450"/><circle cx="-24" cy="40" r="26" fill="#6BB05A"/><circle cx="24" cy="38" r="26" fill="#6BB05A"/><circle cx="-8" cy="10" r="20" fill="#7CC068" opacity=".7"/></g>`;

  const barnG = () => `
<ellipse cx="96" cy="276" rx="92" ry="9" fill="#000" opacity=".14"/>
<rect x="22" y="150" width="148" height="124" fill="url(#g-barn)"/>
<path d="M22 150H170" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>
<polygon points="10,154 96,92 182,154" fill="url(#g-roof)"/>
<path d="M10 154L96 92L182 154" fill="none" stroke="#F6E7D4" stroke-width="4" stroke-linejoin="round"/>
<rect x="62" y="204" width="68" height="70" fill="#F6E7D4"/>
<path d="M62 204L130 274M130 204L62 274" stroke="#C9553F" stroke-width="4"/>
<rect x="62" y="204" width="68" height="70" fill="none" stroke="#fff" stroke-width="3"/>
<circle cx="96" cy="128" r="16" fill="#F6E7D4" stroke="#fff" stroke-width="3"/>`;

  const catItem = () => `<circle r="12" fill="#F6E7D4"/>
<polygon points="-9,-4 -8,-14 -1,-8" fill="#E3A857"/><polygon points="9,-4 8,-14 1,-8" fill="#E3A857"/>
<circle cx="0" cy="2" r="9" fill="#E3A857"/><circle cx="-3.4" cy="0" r="1.5" fill="#2B1C12"/><circle cx="3.4" cy="0" r="1.5" fill="#2B1C12"/>
<path d="M-1.5 4.5L0 6L1.5 4.5" stroke="#B0505A" stroke-width="1" fill="none"/>`;

  const findItem = (id, cx, cy, inner) => `<g class="find" data-find="${id}" transform="translate(${cx} ${cy})">
<circle r="26" fill="transparent"/>${inner}
<g class="mark"><circle r="22" fill="none" stroke="#2F8F46" stroke-width="3.5"/><circle cx="17" cy="-17" r="9.5" fill="#2F8F46"/><path d="M12.5 -17l3.4 3.4 6-6.6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;

  const farm = (hs) => `<svg id="scene" class="scene" viewBox="0 -40 360 440" role="img" aria-label="Bauernhof mit Scheune und Weide. Im Bild verstecken sich fünf Dinge.">
<rect y="-40" width="360" height="440" fill="url(#g-sky)"/>${sunAndClouds()}${meadow()}
${treeG(324, 118)}${barnG()}
${findItem("cat", 96, 128, catItem())}
<g transform="translate(176 192) scale(.37)">${horseG(hs)}</g>
<path d="M170 288H338M170 308H338" stroke="#B98550" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M176 276V318M208 276V318M240 276V318M272 276V318M304 276V318M336 276V318" stroke="#A5733F" stroke-width="7" stroke-linecap="round"/>
<g><rect x="26" y="300" width="62" height="40" rx="10" fill="#E8C45A" stroke="#C9A23A" stroke-width="2"/><path d="M42 302V338M57 302V338M72 302V338" stroke="#C9A23A" stroke-width="2"/></g>
${flowers()}
${findItem("shoe", 46, 366, `<path d="M-12 -12Q-14 12 0 12Q14 12 12 -12" stroke="#8A9199" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="-12" cy="-5" r="1.4" fill="#5C636A"/><circle cx="12" cy="-5" r="1.4" fill="#5C636A"/><circle cx="-10" cy="4" r="1.4" fill="#5C636A"/><circle cx="10" cy="4" r="1.4" fill="#5C636A"/>`)}
${findItem("apple", 216, 346, `<circle r="10" fill="#D93B36"/><ellipse cx="-3" cy="-3" rx="3" ry="4" fill="#fff" opacity=".35"/><path d="M0 -9Q1 -14 3 -16" stroke="#6B4423" stroke-width="2" fill="none"/><path d="M2 -12Q8 -18 13 -15Q9 -9 2 -12Z" fill="#4E9A3E"/>`)}
${findItem("brush", 304, 360, `<rect x="-17" y="-6" width="26" height="11" rx="4" fill="#8B5A3C"/><rect x="7" y="-5" width="10" height="10" rx="2" fill="#E8C45A"/><path d="M10 -5V5M13 -5V5" stroke="#B5922E" stroke-width="1"/>`)}
${findItem("star", 324, 112, star(10))}
</svg>`;

  const stable = (hs) => `<svg id="scene" class="scene" viewBox="0 -40 360 440" role="img" aria-label="Cheyennes Stall">
<rect y="-40" width="360" height="316" fill="url(#p-planks)"/>
<rect x="0" y="-40" width="360" height="316" fill="#000" opacity=".06"/>
<rect x="24" y="36" width="64" height="64" rx="6" fill="#CFEAF5" stroke="#8A5A2E" stroke-width="6"/>
<path d="M56 36V100M24 68H88" stroke="#8A5A2E" stroke-width="4"/>
<path d="M0 268H360" stroke="#5A3A1C" stroke-width="8"/>
<rect y="272" width="360" height="128" fill="url(#g-floor)"/>
<path d="M0 272H360" stroke="#000" stroke-opacity=".2" stroke-width="3"/>
<g id="zones"></g>
<g transform="translate(184 158) scale(.42)">${horseG(hs)}</g>
<g id="piles"></g>
</svg>`;

  const zoneShape = (x, y, w, h, i) => `<g class="zone" data-zone="${i}" opacity="0"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="url(#g-straw)"/>
<path d="M${x + 12} ${y + 14}l20 -6M${x + 44} ${y + 26}l22 4M${x + 74} ${y + 12}l18 8M${x + 22} ${y + 38}l24 -4M${x + 60} ${y + 42}l26 -2" stroke="#C99A33" stroke-width="2.2" stroke-linecap="round" fill="none"/></g>`;

  const pileShape = (x, y, i) => `<g class="pile" data-pile="${i}" transform="translate(${x} ${y})"><g class="pile-in">
<path d="M-26 10C-30 -6 -12 -18 0 -16C14 -22 28 -8 26 10C16 16 -16 16 -26 10Z" fill="#6B4423"/>
<path d="M-14 0C-12 -8 -2 -12 6 -10C14 -8 18 -2 16 4C8 8 -8 8 -14 0Z" fill="#8A5E34"/>
<path d="M-6 -6l12 -2M-12 4l10 2M4 4l10 -2" stroke="#E0C070" stroke-width="2" stroke-linecap="round"/></g></g>`;

  /* ---------- Titel-, Einleitungs- und Siegesbilder ---------- */
  const titleScene = (hs) => `<svg class="scene" viewBox="0 -40 360 440" role="img" aria-label="Hanna mit der Fee Mina und ihrem Pferd Cheyenne auf der Wiese">
<rect y="-40" width="360" height="440" fill="url(#g-sky)"/>${sunAndClouds()}${meadow()}${flowers()}
<g transform="translate(176 232) scale(.46)">${horseG(hs)}</g>
<g transform="translate(36 98) scale(.74)">${hannaG()}</g>
<g transform="translate(236 66) scale(.84)">${minaG()}</g>
<g transform="translate(46 84) scale(.9)">${star(7)}</g>
<g transform="translate(332 170) scale(.9)">${star(6)}</g>
</svg>`;

  const brokenStar = () => `<svg class="scene" viewBox="0 -40 360 440" role="img" aria-label="Mina ist traurig, ihr Zauberstern ist in fünf Stücke zerbrochen und überall verstreut.">
<rect y="-40" width="360" height="440" fill="url(#g-night)"/>
<g fill="#fff"><circle cx="40" cy="50" r="1.8"/><circle cx="120" cy="30" r="1.4"/><circle cx="300" cy="44" r="2"/><circle cx="330" cy="120" r="1.4"/><circle cx="24" cy="160" r="1.6"/><circle cx="200" cy="22" r="1.5"/><circle cx="250" cy="90" r="1.3"/></g>
<path d="M0 330Q100 300 200 326T360 316V400H0z" fill="#3B3380"/>
<g transform="translate(112 120) scale(1.5)">${minaG(true)}</g>
<g transform="translate(60 100) rotate(-18)"><path d="M0 -26L8 -8L-8 -8z" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2" stroke-linejoin="round"/></g>
<g transform="translate(290 150) rotate(24)"><path d="M0 -24L9 -6L-9 -6z" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2" stroke-linejoin="round"/></g>
<g transform="translate(50 250) rotate(-40)"><path d="M0 -22L8 -6L-8 -6z" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2" stroke-linejoin="round"/></g>
<g transform="translate(306 266) rotate(12)"><path d="M0 -24L9 -6L-9 -6z" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2" stroke-linejoin="round"/></g>
<g transform="translate(180 340) rotate(160)"><path d="M0 -22L8 -6L-8 -6z" fill="url(#g-star)" stroke="#D99A1E" stroke-width="2" stroke-linejoin="round"/></g>
</svg>`;

  const winScene = (hs) => `<svg class="scene" viewBox="0 -40 360 440" role="img" aria-label="Hanna und Mina freuen sich über das Sternstück">
<rect y="-40" width="360" height="440" fill="url(#g-sky)"/>${sunAndClouds()}${meadow()}
<g transform="translate(180 120)"><circle r="96" fill="url(#g-glow)"/><g class="win-star">${star(58)}</g></g>
<g transform="translate(34 128) scale(.68)">${hannaG()}</g>
<g transform="translate(236 190) scale(.9)">${minaG()}</g>
<g transform="translate(206 250) scale(.38)">${horseG(hs)}</g>
</svg>`;

  const icon = (id, found) => {
    const c = (a, b) => (found ? a : b);
    const m = {
      shoe: `<path d="M7 5Q5 27 16 27Q27 27 25 5" stroke="${c("#8A9199", "#A8978C")}" stroke-width="3.8" stroke-linecap="round" fill="none"/>`,
      apple: `<circle cx="16" cy="19" r="10" fill="${c("#D93B36", "none")}" stroke="${c("none", "#A8978C")}" stroke-width="3"/><path d="M16 10Q21 3 27 6Q23 13 16 10Z" fill="${c("#4E9A3E", "none")}" stroke="${c("none", "#A8978C")}" stroke-width="2"/>`,
      brush: `<rect x="3" y="12" width="18" height="9" rx="3" fill="${c("#8B5A3C", "none")}" stroke="${c("none", "#A8978C")}" stroke-width="3"/><rect x="21" y="12" width="8" height="9" rx="2" fill="${c("#E8C45A", "none")}" stroke="${c("none", "#A8978C")}" stroke-width="3"/>`,
      cat: `<polygon points="6,14 7,4 14,9" fill="${c("#E3A857", "none")}" stroke="${c("none", "#A8978C")}" stroke-width="2.5" stroke-linejoin="round"/><polygon points="26,14 25,4 18,9" fill="${c("#E3A857", "none")}" stroke="${c("none", "#A8978C")}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="16" cy="18" r="10" fill="${c("#E3A857", "none")}" stroke="${c("none", "#A8978C")}" stroke-width="3"/>`,
      star: `<polygon points="16,3 19.5,12 29,12.5 21.5,18.5 24,28 16,22.5 8,28 10.5,18.5 3,12.5 12.5,12" fill="${c("#FFC93C", "none")}" stroke="${c("#D99A1E", "#A8978C")}" stroke-width="3" stroke-linejoin="round"/>`,
    };
    return `<svg aria-hidden="true" viewBox="0 0 32 32" width="30" height="30">${m[id]}</svg>`;
  };

  return { defs, star, starPts, hanna, hannaG, mina, minaG, minaFace, horse, horseG, HORSE_BODY, farm, stable, zoneShape, pileShape, titleScene, brokenStar, winScene, icon };
})();
