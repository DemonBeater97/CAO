/* © 2026 MrMaik240 – CAO (Competitive Audio Optimizer). Alle Rechte vorbehalten / All rights reserved. Keine Nutzung für KI-Training / No AI training. Siehe LICENSE. */
/* CAO Konsole – Handy-App für PS5- und Xbox-Spieler ohne PC */
(function () {
'use strict';
const VERSION = '1.2.1';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const val = x => typeof x === 'function' ? x() : x;
const KEY = 'cao-konsole-v1';
let st = { tab: 'start', game: 'mw4', plat: 'ps', dev: 'nova-pro-w', prof: 'tmw4', variant: false, done: {} };
try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} };
function toast(m, ms = 3000) { const t = $('#toast'); t.innerHTML = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), ms); }

const dev = () => C_DEVICES.find(d => d.id === st.dev && d.plat.includes(st.plat)) || C_DEVICES.find(d => d.plat.includes(st.plat));
const CGAMES = () => GAMES.filter(g => g.plat && g.plat.includes(st.plat));
const cgame = () => CGAMES().find(g => g.id === st.game) || CGAMES()[0];
const prof = () => { const own = profilesFor(cgame().id).own; return own.find(p => p.id === st.prof) || own[0] || PROFILES.find(p => p.id === st.prof) || PROFILES[0]; };
const devName = d => `${val(d.brand)} ${val(d.name)}`.replace(/^(Andere|Other) /, '');

// ---------- Kopfhörer-Messung (AutoEQ) ----------
const MEAS_KEY = 'cao-konsole-meas';
let measCache = {}; try { measCache = JSON.parse(localStorage.getItem(MEAS_KEY) || '{}'); } catch {}
function catFor(d) {
  const name = d.q || d.ax; if (!name) return null;
  const o = HP_CATALOG.find(x => x.q.toLowerCase() === name.toLowerCase() && (x.m || x.ax));
  const m = o ? (o.m || o.ax) : null;
  return m ? { item: m, approx: !d.q || !o.m } : null;
}
async function loadMeas(d) {
  const c = catFor(d); if (!c) return null;
  const k = c.item.path; if (measCache[k]) return { ...measCache[k], approx: c.approx };
  try {
    const name = decodeURIComponent(k.split('/').pop());
    const r = await fetch(`https://raw.githubusercontent.com/jaakkopasanen/AutoEq/master/results/${k}/${encodeURIComponent(name)}%20ParametricEQ.txt`);
    if (!r.ok) throw 0;
    const txt = await r.text(), filters = [];
    txt.split(/\r?\n/).forEach(l => { const m = l.match(/^Filter \d+: ON (PK|LSC|HSC) Fc (-?[\d.]+) Hz Gain (-?[\d.]+) dB Q (-?[\d.]+)/); if (m) filters.push({ type: { PK: 'peak', LSC: 'lowshelf', HSC: 'highshelf' }[m[1]], f: +m[2], g: +m[3], q: +m[4], on: true }); });
    if (!filters.length) throw 0;
    measCache[k] = { filters, by: c.item.by, name: c.item.name };
    try { localStorage.setItem(MEAS_KEY, JSON.stringify(measCache)); } catch {}
    return { ...measCache[k], approx: c.approx };
  } catch { return null; }
}
let meas = null, measFor = null, measBusy = false;
async function ensureMeas() {
  const d = dev(); if (measFor === d.id || measBusy) return;
  measBusy = true; meas = await loadMeas(d); measFor = d.id; measBusy = false;
  if (st.tab === 'audio') render();
}

// ---------- EQ-Werte für das Gerät ----------
function deviceBands(d) {
  const p = prof(), hp = meas ? { measured: { filters: meas.filters }, useMeasured: true } : null;
  const sl = st.variant && p.variant ? p.variant.sliders : p.sliders;
  const fn = responseFn(finalPoints(p, hp, 'apo'), sl);
  return d.bands.map(f => { let g = fn(f); g = Math.max(-d.range, Math.min(d.range, g)); return [f, Math.round(g)]; });
}
function geqHtml(bands, range) {
  const pct = g => 50 - (g / range) * 45;
  return `<div class="geq" style="grid-template-columns:repeat(${bands.length},1fr)">${bands.map(([f, g]) => { const p = pct(g);
    return `<div class="b"><b>${g > 0 ? '+' : ''}${g}</b><div class="tr"><i style="top:${Math.min(50, p)}%;bottom:${100 - Math.max(50, p)}%"></i><u style="top:calc(${p}% - 3px)"></u></div>${f >= 1000 ? f / 1000 + 'k' : f}</div>`; }).join('')}</div>`;
}

// Kurve wie im Hersteller-Programm (z. B. SteelSeries GG): Punkte auf einer Frequenz-Achse
function curveHtml(bands, range) {
  const W = 340, H = 190, L = 30, R = 8, Tp = 16, B = 22, lo = Math.log10(20), hi = Math.log10(20000);
  const x = f => L + (Math.log10(f) - lo) / (hi - lo) * (W - L - R), y = g => Tp + (1 - (g + range) / (2 * range)) * (H - Tp - B);
  const pts = bands.map(([f, g]) => [x(f), y(g), g]);
  let d = `M${L},${pts[0][1].toFixed(1)} L${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`; }
  d += ` L${W - R},${pts[pts.length - 1][1].toFixed(1)}`;
  const cols = ['#a78bfa', '#818cf8', '#f472b6', '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#22d3ee', '#60a5fa'];
  const gl = [range, range / 2, 0, -range / 2, -range].map(g => `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="#2a2e35" ${g === 0 ? 'stroke-width="1.2"' : ''}/><text x="${L - 4}" y="${y(g) + 3}" text-anchor="end" font-size="8" fill="#7d848d">${g > 0 ? '+' : ''}${g}</text>`).join('');
  const xl = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].map(f => `<text x="${x(f)}" y="${H - 6}" text-anchor="middle" font-size="8" fill="#7d848d">${f >= 1000 ? f / 1000 + 'k' : f}</text>`).join('');
  const dots = pts.map(([px, py, g], i) => `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.2" fill="${cols[i % 10]}"/><text x="${px.toFixed(1)}" y="${(py + (g >= 0 ? -8 : 14)).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${g > 0 ? '+' : ''}${g}</text>`).join('');
  return `<svg class="curve" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;background:#15181c;border-radius:10px;margin:8px 0" role="img" aria-label="EQ">${gl}${xl}<path d="${d}" fill="none" stroke="#d6dae0" stroke-width="1.5"/>${dots}</svg>`;
}
function eqViewHtml(bands, range, key) {
  const curve = st.eqCurve !== false;
  return `<div class="seg" style="margin:8px 0 2px"><button data-eqview="0" aria-pressed="${!curve}">${T('Regler', 'Sliders')}</button><button data-eqview="1" aria-pressed="${curve}">${T('Kurve wie am PC', 'Curve like on PC')}</button></div>
    ${curve ? curveHtml(bands, range) + `<p class="small">${T('So sieht es in SteelSeries GG aus: jeden Punkt nur hoch/runter auf die Zahl ziehen. Von links: 31 Hz bis 16 kHz.', 'This is how it looks in SteelSeries GG: drag each point only up/down to the number. From the left: 31 Hz to 16 kHz.')}</p>` : geqHtml(bands, range)}`;
}

// ---------- Checklisten ----------
const dk = k => `${cgame().id}|${st.plat}|${k}`;
function li(it, withPath) {
  const d = !!st.done[dk(it.k)];
  return `<div class="li ${d ? 'd' : ''}" data-ck="${esc(it.k)}" role="checkbox" aria-checked="${d}" tabindex="0"><span class="ck">${d ? '✓' : ''}</span>
    <span class="t"><b>${esc(it.t)}</b>${withPath && it.p ? `<small class="pth">${esc(it.p)}</small>` : ''}${it.w ? `<small>${esc(it.w)}</small>` : ''}</span><span class="v">${esc(it.v)}</span></div>`;
}

// ---------- Seiten ----------
function renderStart() {
  const devs = C_DEVICES.filter(d => d.plat.includes(st.plat)), d = dev();
  const brands = [...new Set(devs.map(x => val(x.brand)))];
  const kindTag = d.kind === 'app' ? (d.phoneEq ? ['ok', T('📱 Handy-App · eigener EQ', '📱 phone app · own EQ')] : ['ap', T('📱 Handy-App + eigener EQ (einmal am PC)', '📱 phone app + own EQ (once on PC)')])
    : { geq: ['ok', T('✓ eigener EQ', '✓ own EQ')], preset: ['ap', T('◐ Voreinstellungen', '◐ presets')], none: ['no', T('○ keine Einstellung', '○ no settings')] }[d.kind];
  const p = prof();
  return `
  <h4>${T('Spiel', 'Game')}</h4>
  <select class="sel" id="game">${CGAMES().map(g => `<option value="${g.id}" ${g.id === cgame().id ? 'selected' : ''}>${esc(L(g, 'name'))}</option>`).join('')}<option disabled>${T('GTA 6 – kommt (ab 19.11.2026)', 'GTA 6 – coming (from Nov 19, 2026)')}</option></select>
  <p class="hint">${cgame().audio === 'own' ? T('Dieses Spiel macht eigenen 3D-Sound – CAO stellt die Konsole passend ein.', 'This game does its own 3D sound – CAO sets up the console to match.') : T('Das Spiel liefert echtes 7.1 – die Konsole macht daraus Raumklang.', 'The game delivers true 7.1 – the console turns it into surround.')}</p>
  <h4>${T('Konsole', 'Console')}</h4>
  <div class="seg"><button data-plat="ps" aria-pressed="${st.plat === 'ps'}">PlayStation 5</button><button data-plat="xbox" aria-pressed="${st.plat === 'xbox'}">Xbox Series X|S</button></div>
  <h4>${T('Kopfhörer', 'Headphones')}</h4>
  <select class="sel" id="dev">${brands.map(b => `<optgroup label="${esc(b)}">${devs.filter(x => val(x.brand) === b).map(x => `<option value="${x.id}" ${x.id === d.id ? 'selected' : ''}>${esc(val(x.name))}</option>`).join('')}</optgroup>`).join('')}</select>
  <p class="hint"><span class="tag ${kindTag[0]}">${kindTag[1]}</span> ${d.where ? esc(val(d.where)) : T('Einstellen an Konsole und im Spiel', 'Set up on console and in game')}</p>
  <h4>${T('Sound-Profil', 'Sound profile')}</h4>
  ${(() => { const pf = profilesFor(cgame().id), opt = x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${esc(L(x, 'name'))} – ${esc(L(x, 'short') || '')}</option>`;
    return `<select class="sel" id="prof">${(pf.own.length ? pf.own : pf.other.filter(x => !x.hidden)).map(opt).join('')}</select>`; })()}
  ${p.variant ? `<label class="hint" style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="checkbox" id="variant" ${st.variant ? 'checked' : ''}> ${esc(L(p, 'variantLabel') || p.variant.label)}</label>` : ''}
  <button class="btn" data-go="audio">${T('Weiter zu Audio →', 'Continue to audio →')}</button>
  <p class="hint" style="text-align:center;margin-top:14px">${T('Kein Eingriff ins Spiel · nur Anleitung', 'No game tampering · instructions only')}</p>`;
}
function renderAudio() {
  const d = dev(), p = prof(); let n = 0, html = '';
  if (d.kind === 'geq') {
    ensureMeas();
    const corr = meas ? (meas.approx ? T(`+ Kopfhörer-Korrektur (angelehnt an ${meas.name})`, `+ headphone correction (approximated from ${meas.name})`) : T(`+ Kopfhörer-Korrektur (Messung: ${String(meas.by).split(' on ')[0]})`, `+ headphone correction (measured by ${String(meas.by).split(' on ')[0]})`)) : measBusy ? T('Kopfhörer-Messung wird geladen …', 'Loading headphone measurement …') : T('ohne Kopfhörer-Korrektur', 'without headphone correction');
    html += `<div class="box"><h5><span class="n">${++n}</span>${esc(val(d.where))} – Equalizer</h5>
      <ol>${val(d.steps).map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${geqHtml(deviceBands(d), d.range)}
      <p class="small">${T('Profil', 'Profile')} <b style="color:#fff">${esc(p.name)}</b> ${esc(corr)} · ${T('angenähert auf die Regler des Geräts, in dB', 'approximated to the device’s sliders, in dB')}</p>
      ${d.note ? `<div class="note">${esc(val(d.note))}</div>` : ''}</div>`;
  } else if (d.kind === 'app') {
    ensureMeas();
    const corr = meas ? (meas.approx ? T(`+ Kopfhörer-Korrektur (angelehnt an ${meas.name})`, `+ headphone correction (approximated from ${meas.name})`) : T(`+ Kopfhörer-Korrektur (Messung: ${String(meas.by).split(' on ')[0]})`, `+ headphone correction (measured by ${String(meas.by).split(' on ')[0]})`)) : measBusy ? T('Kopfhörer-Messung wird geladen …', 'Loading headphone measurement …') : T('ohne Kopfhörer-Korrektur', 'without headphone correction');
    const sl = `${geqHtml(deviceBands(d), d.range)}<p class="small">${T('Profil', 'Profile')} <b style="color:#fff">${esc(p.name)}</b> ${esc(corr)} · ${T('in dB', 'in dB')}</p>`;
    if (d.phoneEq) {
      html += `<div class="box"><h5><span class="n">${++n}</span>${esc(val(d.where))} – Equalizer</h5>
        <ol>${val(d.appSteps).map(s => `<li>${esc(s)}</li>`).join('')}</ol>${sl}
        ${d.appNote ? `<div class="note">${esc(val(d.appNote))}</div>` : ''}${d.note ? `<div class="note">${esc(val(d.note))}</div>` : ''}</div>`;
    } else {
      html += `<div class="box"><h5><span class="n">${++n}</span>${T('Eigener Equalizer · einmal am PC eintragen', 'Own equalizer · enter once on PC')}</h5>
        <p class="small" style="margin:-4px 0 8px"><span class="tag ok">${T('✓ im Headset gespeichert · dann in der App wählbar', '✓ stored in the headset · then selectable in the app')}</span></p>${d.note ? `<div class="note">${esc(val(d.note))}</div>` : ''}
        <ol>${val(d.pcSteps).map(s => `<li>${esc(s)}</li>`).join('')}</ol>${eqViewHtml(deviceBands(d), d.range)}<p class="small">${T('Profil', 'Profile')} <b style="color:#fff">${esc(p.name)}</b> ${esc(corr)} · ${T('in dB', 'in dB')}</p>${d.pcNote ? `<div class="note">${esc(val(d.pcNote))}</div>` : ''}</div>`;
    }
  } else if (d.kind === 'preset') {
    html += `<div class="box"><h5><span class="n">${++n}</span>${esc(val(d.where))}</h5><p style="color:#e8eaed;font-size:14px">${esc(val(d.preset))}</p>${d.note ? `<div class="note">${esc(val(d.note))}</div>` : ''}</div>`;
  } else {
    html += `<div class="box"><h5><span class="n">${++n}</span>${esc(devName(d))}</h5><p>${T('An diesem Kopfhörer lässt sich an der Konsole kein Klang einstellen. Das Beste holst du über die Konsole und das Spiel heraus – siehe unten.', 'This headset has no sound settings on console. Get the most out of it via the console and the game – see below.')}</p>
      ${d.note ? `<div class="note">${esc(val(d.note))}</div>` : ''}<div class="note info">${T('Tipp: Mit einem PC und Capture Card bekommst du den vollen EQ von CAO für PC.', 'Tip: with a PC and capture card you get the full EQ from CAO for PC.')}</div></div>`;
  }
  const own = cgame().audio === 'own', sys = C_SYSTEM[st.plat](own);
  html += `<div class="box"><h5><span class="n">${++n}</span>${st.plat === 'ps' ? T('PS5 – Einstellungen', 'PS5 – settings') : T('Xbox – Einstellungen', 'Xbox – settings')}</h5>${sys.map(it => li(it, true)).join('')}</div>`;
  html += `<div class="box"><h5><span class="n">${++n}</span>${esc(L(cgame(), 'name'))} – ${T('Einstellungen → Audio', 'Settings → Audio')}</h5>${(GAME_AUDIO[cgame().id] || (() => []))({ pc: false }).map(it => li(it)).join('')}</div>`;
  const tips = L(p, 'tips') || [];
  if (tips.length && (d.kind === 'geq' || d.kind === 'app')) html += `<div class="box"><h5>${T('Wenn beim Testen …', 'If while testing …')}</h5>${tips.map(t => `<p style="color:#cfd3d8;margin:0 0 6px">${esc(t)}</p>`).join('')}<p class="small">${T('„Punkt“ bezieht sich auf die Profil-Werte am PC – an der Konsole den Regler mit der nächsten Frequenz nehmen.', '“Point” refers to the profile values on PC – on console use the slider with the nearest frequency.')}</p></div>`;
  return html;
}
function renderGfx() {
  const groups = (GAME_GFX[cgame().id] || (() => []))(), all = groups.flatMap(g => g.items), done = all.filter(it => st.done[dk(it.k)]).length;
  return `<div class="small">${done} ${T('von', 'of')} ${all.length} ${T('erledigt', 'done')} · ${esc(L(cgame(), 'name'))} · ${T('Stand Oktober 2026', 'as of October 2026')}</div>
    <div class="prog"><i style="width:${all.length ? Math.round(done / all.length * 100) : 0}%"></i></div>
    ${groups.map(g => `<div class="box"><h5>${esc(g.grp)}</h5>${g.items.map(it => li(it)).join('')}</div>`).join('')}
    <button class="reset" id="resetChecks">${T('Haken zurücksetzen', 'Reset checkmarks')}</button>`;
}
function renderInfo() {
  return `<div class="box"><h5>${T('Was ist CAO Konsole?', 'What is CAO Console?')}</h5><p style="color:#cfd3d8">${T('Für PS5- und Xbox-Spieler ohne PC: CAO zeigt dir, was du an deinem Headset, an der Konsole und im Spiel einstellst – mit den Sound-Profilen und Kopfhörer-Messdaten aus CAO für PC.', 'For PS5 and Xbox players without a PC: CAO shows you what to set on your headset, console and in game – using the sound profiles and headphone measurements from CAO for PC.')}</p></div>
  <div class="box"><h5>${T('Sicher', 'Safe')}</h5><p style="color:#cfd3d8">${T('Die App verändert nichts an Konsole oder Spiel – sie ist nur eine Anleitung. Kein Eingriff, kein Anti-Cheat-Risiko.', 'The app changes nothing on your console or game – it’s just a guide. No tampering, no anti-cheat risk.')}</p></div>
  <div class="box"><h5>${T('Spielst du auch am PC?', 'Also playing on PC?')}</h5><p style="color:#cfd3d8">${T('CAO für PC stellt den Sound automatisch ein – auch für PS5/Xbox über Capture Card.', 'CAO for PC sets up the sound automatically – also for PS5/Xbox via capture card.')}</p><a href="https://demonbeater97.github.io/CAO/#download">${T('Zur Download-Seite →', 'To the download page →')}</a></div>
  <div class="box"><h5>${T('Quellen', 'Sources')}</h5><p class="small">${T('Kopfhörer-Messdaten: AutoEQ (MIT-Lizenz). Konsolen-Menüs: PlayStation-Support, Xbox-Support, Herstellerangaben. Spiel-Empfehlungen: Stand Oktober 2026.', 'Headphone measurements: AutoEQ (MIT licence). Console menus: PlayStation support, Xbox support, manufacturer info. Game recommendations: as of October 2026.')}</p>
    <p class="small">CAO Konsole v${VERSION} · © 2026 MrMaik240 · <a href="https://www.twitch.tv/mrmaik240">twitch.tv/MrMaik240</a></p>
    <p class="small">${T('Alle Rechte vorbehalten. Kopieren, Nachbauen, erneutes Veröffentlichen und die Nutzung für KI-Training sind ohne Erlaubnis nicht gestattet. Privat benutzen: ja, gerne.', 'All rights reserved. Copying, recreating, republishing and use for AI training are not permitted without permission. Private use: yes, of course.')}</p>
    <p class="small">${T('Fan-Projekt, nicht verbunden mit Activision, Sony, Microsoft oder den Headset-Herstellern.', 'Fan project, not affiliated with Activision, Sony, Microsoft or headset makers.')}</p></div>`;
}

function render() {
  document.documentElement.lang = CAO_LANG;
  $('#langBtn').textContent = CAO_LANG.toUpperCase();
  document.querySelectorAll('[data-de]').forEach(e => { e.textContent = CAO_LANG === 'en' ? e.dataset.en : e.dataset.de; });
  document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === st.tab));
  const d = dev(), g = { name: L(cgame(), 'name') };
  const head = { start: [T('CAO Konsole', 'CAO Console'), 'Competitive Audio Optimizer'], audio: [T('Audio', 'Audio'), `${g.name.replace('Call of Duty: ', '')} · ${st.plat === 'ps' ? 'PS5' : 'Xbox'} · ${devName(d)}`], gfx: [T('Grafik', 'Graphics'), `${g.name.replace('Call of Duty: ', '')} · ${st.plat === 'ps' ? 'PS5' : 'Xbox'}`], info: ['Info', T('CAO Konsole v', 'CAO Console v') + VERSION] }[st.tab];
  $('#hdT').textContent = head[0]; $('#hdS').textContent = head[1];
  $('#main').innerHTML = ({ start: renderStart, audio: renderAudio, gfx: renderGfx, info: renderInfo })[st.tab]();
}
function go(tab) { st.tab = tab; save(); render(); window.scrollTo(0, 0); }

document.addEventListener('click', e => {
  const b = e.target.closest('button, .li'); if (!b) return;
  if (b.dataset.tab) return go(b.dataset.tab);
  if (b.dataset.go) return go(b.dataset.go);
  if (b.dataset.plat) { st.plat = b.dataset.plat; if (!dev() || dev().id !== st.dev) st.dev = dev().id; meas = null; measFor = null; save(); return render(); }
  if (b.dataset.eqview) { st.eqCurve = b.dataset.eqview === '1'; save(); return render(); }
  if (b.dataset.ck) { const k = dk(b.dataset.ck); if (st.done[k]) delete st.done[k]; else st.done[k] = 1; save(); return render(); }
  if (b.id === 'langBtn') { CAO_LANG = CAO_LANG === 'en' ? 'de' : 'en'; try { localStorage.setItem('cao-lang', CAO_LANG); } catch {} return render(); }
  if (b.id === 'resetChecks') { Object.keys(st.done).forEach(k => { if (k.startsWith(`${cgame().id}|${st.plat}|v-`)) delete st.done[k]; }); save(); render(); return toast(T('Zurückgesetzt.', 'Reset.')); }
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('li')) { e.preventDefault(); e.target.click(); } });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'game') { st.game = t.value; const own = profilesFor(cgame().id).own; if (own.length && !own.some(x => x.id === st.prof)) { st.prof = own[0].id; st.variant = false; } }
  else if (t.id === 'dev') { st.dev = t.value; meas = null; measFor = null; }
  else if (t.id === 'prof') { st.prof = t.value; st.variant = false; }
  else if (t.id === 'variant') st.variant = t.checked;
  else return;
  save(); render();
});

render();
if (dev().kind === 'geq' || dev().kind === 'app') ensureMeas();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
