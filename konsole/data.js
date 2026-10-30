/* © 2026 MrMaik240 – CAO (Competitive Audio Optimizer). Alle Rechte vorbehalten / All rights reserved. Keine Nutzung für KI-Training / No AI training. Siehe LICENSE. */
// Daten und Rechenfunktionen für CAO. Alle Profile sind eigene Abstimmungen.
const P = (type, f, g, q, on = true) => ({ type, f, g, q, on });
// Sprache: 'de' oder 'en' (gemeinsam mit dem Audio-Labor über localStorage)
let CAO_LANG = (() => { try { return localStorage.getItem('cao-lang') === 'en' ? 'en' : 'de'; } catch { return 'de'; } })();
const T = (d, e) => CAO_LANG === 'en' ? e : d;
const L = (o, k) => (CAO_LANG === 'en' && o && o.en && o.en[k] != null) ? o.en[k] : o[k];
const TYPES = { peak: 'Peaking EQ', lowshelf: 'Low Shelving', highshelf: 'High Shelving' };
const FS = 48000;

const ZONES = [
  { k: 'bass',   name: 'Explosionen & Bass', en: 'Explosions & bass', lo: 30,   hi: 100,  goal: [-10, -5] },
  { k: 'tapp',   name: 'Schritt-Tapp', en: 'Footstep thump',       lo: 125,  hi: 250,  goal: [2, 6] },
  { k: 'hall',   name: 'Raumhall', en: 'Room echo',           lo: 300,  hi: 600,  goal: [-3, 0] },
  { k: 'shot',   name: 'Schuss-Knall', en: 'Gunshot crack',       lo: 2500, hi: 4000, goal: [-3, 0] },
  { k: 'detail', name: 'Schritt-Details', en: 'Footstep detail',    lo: 5000, hi: 8000, goal: [1, 5] }
];

// Erklärung für die drei Sonar-Schieber je Profil
const SLIDER_INFO_EN = {
  bass:   'Raises/lowers everything below ~120 Hz. Minus = quieter explosions, but also pulls down the footstep thump a little.',
  voice:  'Raises the mids around 1–2 kHz. Plus = reloads, gear and voices clearer; echo and gunshots feel quieter.',
  treble: 'Raises everything above ~6 kHz. Plus = clearer footsteps outdoors, too much = harsh.'
};
const SLIDER_INFO = {
  bass:   'Hebt/senkt alles unter ca. 120 Hz. Minus = Explosionen leiser, zieht aber das Schritt-Tapp leicht mit.',
  voice:  'Hebt die Mitte um 1–2 kHz. Plus = Nachladen, Ausrüstung und Stimmen deutlicher, Hall und Knall wirken leiser.',
  treble: 'Hebt alles ab ca. 6 kHz. Plus = Schritte im Freien klarer, zu viel = scharf.'
};

const PROFILES = [
  { id: 'tmw4', name: 'Tournament MW4', tag: 'Eigenes', tagColor: '#5fd3c0', short: 'Viel Schritt-Detail, wenig Wumms',
    en: { tag: 'Own', short: 'Lots of footstep detail, little boom', note: 'Built on Tournament (old), values from Triton, Eclipse and the Rara analysis. For multiplayer and ranked.', variantLabel: 'Test variant “quieter explosions”',
      tips: ['Explosions annoying → try the variant (bass −0.5 / voice +1 / treble +1)', 'Footsteps behind walls too quiet → point 3 (180 Hz) to +7', 'Gunshots too sharp → point 7 (3.2 kHz) to −4'] },
    note: 'Aufbau von Tournament (alt), Werte aus Triton, Eclipse und Rara-Analyse. Für Multiplayer und Ranked.',
    points: [P('lowshelf',90,-10,0.7), P('peak',20,-6,0.7), P('peak',180,6,1), P('peak',380,-5,1), P('peak',840,-1.5,1), P('peak',1400,1,1), P('peak',3200,-3,1.5), P('peak',6000,5.5,1.4)],
    sliders: { bass: 0, voice: 0, treble: 0 },
    variant: { label: 'Testvariante „Explosionen leiser“', sliders: { bass: -0.5, voice: 1, treble: 1 } },
    tips: ['Explosionen nerven → Variante testen (Bass −0,5 / Stimme +1 / Höhe +1)', 'Schritte hinter Wänden zu leise → Punkt 3 (180 Hz) auf +7', 'Schüsse zu scharf → Punkt 7 (3,2 kHz) auf −4'],
    trick: { C: 0.4, F: 0.6, S: 1, R: 1, SUB: 0.5 } },
  { id: 'triton', name: 'MW4 Triton', tag: 'Empfehlung', tagColor: '#ff7a1a', short: 'Ausgewogen für Multiplayer',
    en: { tag: 'Recommended', short: 'Balanced for multiplayer', note: 'Tuned to the MW4 sound with room echo and muffled walls. Good for long sessions.',
      tips: ['Enemies behind walls too quiet → point 2 to +6.5', 'Gunshots too sharp → point 5 to −3', 'Everything echoey → point 3 to −4'] },
    note: 'Abgestimmt auf den MW4-Sound mit Raumhall und gedämpften Wänden. Gut für lange Sessions.',
    points: [P('lowshelf',90,-10,0.7), P('peak',170,5.5,1), P('peak',380,-2.5,1), P('peak',2000,1.5,1.2), P('peak',3200,-2,1.5), P('peak',6000,5,1.4), P('highshelf',11000,-2,0.7)],
    sliders: { bass: 0, voice: 0, treble: 0 },
    tips: ['Gegner hinter Wänden zu leise → Punkt 2 auf +6,5', 'Schüsse zu scharf → Punkt 5 auf −3', 'Alles hallig → Punkt 3 auf −4'],
    trick: { C: 0.5, F: 0.7, S: 1, R: 1, SUB: 0.6 } },
  { id: 'eclipse', name: 'MW4 Eclipse', tag: 'Warzone', tagColor: '#64b5d6', short: 'Schritte stark betont',
    en: { tag: 'Warzone', short: 'Strongly boosted footsteps', note: 'More boom, very clear footsteps. Better for big maps.', tips: ['Explosions boom too much → point 2 to +3', 'Footsteps too muffled → point 5 to +7'] },
    note: 'Mehr Wumms, sehr deutliche Schritte. Eher für große Karten.',
    points: [P('lowshelf',80,-6,0.7), P('peak',180,5,0.9), P('peak',400,-2,1), P('peak',3500,-1.5,1.2), P('peak',6500,5,1.4), P('highshelf',12000,-3,0.7)],
    sliders: { bass: 0, voice: 0, treble: 0 },
    tips: ['Explosionen wummern → Punkt 2 auf +3', 'Schritte zu dumpf → Punkt 5 auf +7'],
    trick: { C: 0.5, F: 0.7, S: 1, R: 1, SUB: 0.6 } },
  { id: 'story', name: 'Kampagne', tag: 'Story', tagColor: '#9aa1a9', short: 'Voller Klang, mehr Wumms',
    en: { name: 'Campaign', short: 'Full sound, more boom', note: 'For campaign and movies: barely any changes, a bit more bass and sparkle.' },
    note: 'Für Kampagne und Filme: kaum Eingriffe, etwas mehr Bass und Glanz.',
    points: [P('lowshelf',70,2,0.7), P('peak',300,-1,1), P('peak',3000,1,1), P('highshelf',10000,1.5,0.7)],
    sliders: { bass: 0, voice: 0, treble: 0 },
    tips: [], trick: null }
];

const DEFAULT_HEADPHONES = [
  { id: 'e9', name: 'Sony INZONE E9', bauart: 'In-Ear', verbindung: 'Kabel', builtIn: true, winLoudness: true,
    corr: [P('peak',2400,-3,2), P('peak',8500,-7,4.3)], patch: {},
    vol: 'Leise: herausgenommen und baumelnd soll fast nichts zu hören sein.',
    note: 'Korrektur aus einer YouTube-Vorlage, nicht gemessen.',
    en: { vol: 'Quiet: taken out and dangling, you should hear almost nothing.', note: 'Correction from a YouTube template, not measured.' } },
  { id: 'arctis', name: 'SteelSeries Arctis Nova Pro', bauart: 'Over-Ear geschlossen', verbindung: 'Basisstation', builtIn: true, winLoudness: true,
    corr: [], patch: { tmw4: { 6: -4.5, 7: 4 }, triton: { 4: -3.5 } },
    vol: 'Headset-Regler um 30.',
    note: 'EQ in der Basisstation bzw. GG-Geräteeinstellungen flach lassen.',
    en: { vol: 'Headset dial around 30.', note: 'Keep the EQ in the base station / GG device settings flat.' } },
  { id: 'omni', name: 'SteelSeries Arctis Nova Pro Omni', bauart: 'Over-Ear geschlossen', verbindung: 'Funk-Dongle', builtIn: true, winLoudness: true,
    corr: [], patch: {},
    vol: 'Headset-Regler um 30, dann nach Gehör.',
    note: 'Neu (Mai 2026) – noch keine eigene Messung. Grob angelehnt geht: unter „Messdaten suchen“ „Arctis Nova Pro Wireless“ übernehmen. EQ in GG / am Headset flach lassen.',
    en: { vol: 'Headset dial around 30, then by ear.', note: 'New (May 2026) – no own measurement yet. For a rough match: under “Search measurements” pick “Arctis Nova Pro Wireless”. Keep the EQ in GG / on the headset flat.' } }
];

const FACTS_EN = [
  ['Triton: sound reacts to rooms', 'MW4 uses Microsoft Triton. Echo depends on the location; walls muffle gunshots, footsteps and proximity chat. Behind walls, mostly the low footstep thump (150–250 Hz) gets through.'],
  ['Footsteps were made quieter', 'After the first beta day (August 2026), Infinity Ward lowered the footstep volume.'],
  ['Reduce tinnitus sound: On', 'Removes the ringing and muffling after nearby explosions.'],
  ['In-game frequency sliders', 'Only active with “Asymmetric hearing compensation” – a hearing aid feature. Leave it off; the EQ comes from CAO.'],
  ['The game mixes in 7.1', 'With 7.1 in game plus virtual surround (Sonar Spatial Audio or HeSuVi) the direction is preserved. 7.1 is required for the channel trick in Equalizer APO.'],
  ['PS5 via capture card', 'PS5 audio goes over HDMI into the capture card and from there through Sonar, so the same EQ applies as on PC. The capture card delays the audio a little – so turn PS5 3D audio off and use stereo in game.'],
  ['No VPN, no region blocker', 'CAO changes Windows sound and – only if you want – the regular MW4 settings file (the same values as the in-game menu, with backup). None of it touches the running game or matchmaking.']
];
const FACTS = [
  ['Triton: Schall reagiert auf Räume', 'MW4 nutzt Microsofts Triton. Hall hängt vom Ort ab, Wände dämpfen Schüsse, Schritte und Proximity-Chat. Hinter Wänden kommt vor allem das tiefe Schritt-Tapp (150–250 Hz) durch.'],
  ['Schritte wurden leiser gemacht', 'Nach dem ersten Beta-Tag (August 2026) hat Infinity Ward die Schritt-Lautstärke gesenkt.'],
  ['Tinnitus-Geräusch reduzieren: An', 'Nimmt das Piepen und Dumpfwerden nach nahen Explosionen weg.'],
  ['Frequenz-Regler im Spiel', 'Nur aktiv mit „Asymmetrischer Hörausgleich“ – eine Hörhilfe. Aus lassen, der EQ kommt aus CAO.'],
  ['Spiel mischt in 7.1', 'Mit 7.1 im Spiel plus Raumklang (Sonar Spatial Audio oder HeSuVi) bleibt die Richtung erhalten. Für den Kanal-Trick in Equalizer APO ist 7.1 Pflicht.'],
  ['PS5 über die Capture Card', 'Der Ton der PS5 läuft über HDMI in die Capture Card und von dort durch Sonar. So gilt derselbe EQ wie am PC. Die Capture Card verzögert den Ton etwas – darum PS5-3D-Audio aus und im Spiel Stereo.'],
  ['Kein VPN, kein Region-Blocker', 'CAO ändert Windows-Sound und – nur wenn du es willst – die normale Einstellungsdatei von MW4 (dieselben Werte wie im Spielmenü, mit Sicherung). Nichts davon greift ins laufende Spiel oder ins Matchmaking ein.']
];

// ---------- Filter-Mathe ----------
function coef(type, f0, g, q) {
  f0 = Math.min(Math.max(f0, 5), FS / 2 - 100); q = Math.max(q || 0.7, 0.05);
  const A = Math.pow(10, g / 40), w = 2 * Math.PI * f0 / FS, c = Math.cos(w), s = Math.sin(w), al = s / (2 * q), sa = 2 * Math.sqrt(A) * al;
  if (type === 'lowshelf') return [A*((A+1)-(A-1)*c+sa), 2*A*((A-1)-(A+1)*c), A*((A+1)-(A-1)*c-sa), (A+1)+(A-1)*c+sa, -2*((A-1)+(A+1)*c), (A+1)+(A-1)*c-sa];
  if (type === 'highshelf') return [A*((A+1)+(A-1)*c+sa), -2*A*((A-1)+(A+1)*c), A*((A+1)+(A-1)*c-sa), (A+1)-(A-1)*c+sa, 2*((A-1)-(A+1)*c), (A+1)-(A-1)*c-sa];
  return [1+al*A, -2*c, 1-al*A, 1+al/A, -2*c, 1-al/A];
}
function magDb(k, f) {
  const w = 2*Math.PI*f/FS, c1 = Math.cos(w), s1 = Math.sin(w), c2 = Math.cos(2*w), s2 = Math.sin(2*w);
  const nr = k[0]+k[1]*c1+k[2]*c2, ni = -(k[1]*s1+k[2]*s2), dr = k[3]+k[4]*c1+k[5]*c2, di = -(k[4]*s1+k[5]*s2);
  return 10*Math.log10(Math.max((nr*nr+ni*ni)/(dr*dr+di*di), 1e-12));
}
function sliderPoints(s) {
  const out = [];
  if (+s.bass) out.push(P('lowshelf', 120, +s.bass, 0.7));
  if (+s.voice) out.push(P('peak', 1500, +s.voice, 0.8));
  if (+s.treble) out.push(P('highshelf', 6000, +s.treble, 0.7));
  return out;
}
// Kopfhörer-Korrektur: gemessene Daten (falls geladen) oder eigene Punkte.
// Sonar hat nur 10 Punkte – dort werden die stärksten Korrekturen genommen, die noch Platz haben.
function hpCorr(hp, route, slots) {
  if (!hp) return [];
  const useMeas = hp.measured && hp.useMeasured !== false && Array.isArray(hp.measured.filters) && hp.measured.filters.length;
  let c = (useMeas ? hp.measured.filters : hp.corr) || [];
  if (route !== 'apo' && c.length > slots) c = [...c].sort((a, b) => Math.abs(b.g) - Math.abs(a.g)).slice(0, Math.max(0, slots));
  return c;
}
// Endgültige Punkte für Profil + Kopfhörer (Patch + Korrektur)
function finalPoints(profile, hp, route) {
  const pts = profile.points.map((p, i) => {
    const x = { ...p, src: 'profil' };
    const patch = hp && hp.patch && hp.patch[profile.id];
    if (patch && patch[i] !== undefined) { x.orig = x.g; x.g = patch[i]; x.src = 'angepasst'; }
    return x;
  });
  if (profile.hasCorr) return pts;
  const meas = hp && hp.measured && hp.useMeasured !== false;
  return pts.concat(hpCorr(hp, route, 10 - pts.length).map(p => ({ ...p, src: meas ? 'messung' : 'kopfhoerer' })));
}
function responseFn(points, sliders) {
  const fl = points.filter(p => p.on !== false).concat(sliderPoints(sliders || {})).map(p => coef(p.type, +p.f, +p.g, +p.q));
  return f => fl.reduce((a, k) => a + magDb(k, f), 0);
}
function zoneValues(points, sliders) {
  const r = responseFn(points, sliders), ref = r(1000);
  return ZONES.map(z => { let s = 0; for (let i = 0; i < 12; i++) s += r(z.lo * Math.pow(z.hi / z.lo, i / 11)) - ref; return s / 12; });
}
function gradeOf(v, z) {
  const d = v < z.goal[0] ? z.goal[0] - v : v > z.goal[1] ? v - z.goal[1] : 0;
  if (d < 0.25) { const mid = (z.goal[0] + z.goal[1]) / 2, half = (z.goal[1] - z.goal[0]) / 2; return Math.abs(v - mid) <= half * 0.6 ? 4 : 3; }
  return d < 1 ? 2 : d < 3 ? 1 : 0;
}
const GRADES_DE = ['Schlecht', 'Schwach', 'Okay', 'Gut', 'Perfekt'], GRADES_EN = ['Poor', 'Weak', 'Okay', 'Good', 'Perfect'];
const GRADES = new Proxy([], { get: (_, k) => (CAO_LANG === 'en' ? GRADES_EN : GRADES_DE)[k] });
function totalLabel(t) { const n = CAO_LANG === 'en' ? ['Poor', 'Weak', 'Okay', 'Good', 'Top'] : ['Schlecht', 'Schwach', 'Okay', 'Gut', 'Top']; const i = t >= 18 ? 4 : t >= 14 ? 3 : t >= 10 ? 2 : t >= 6 ? 1 : 0; return [n[i], i]; }

// ---------- Equalizer-APO-Konfiguration ----------
function apoConfig({ profile, hp, sliders, trick, hesuvi, rk }) {
  const pts = finalPoints(profile, hp, 'apo').filter(p => p.on !== false).concat(sliderPoints(sliders));
  // Vorverstärkung aus dem echten Höchstwert der Kurve, damit nichts übersteuert
  const r = responseFn(pts, {});
  let maxBoost = 0; for (let i = 0; i < 400; i++) maxBoost = Math.max(maxBoost, r(20 * Math.pow(1000, i / 399)));
  const code = { peak: 'PK', lowshelf: 'LSC', highshelf: 'HSC' };
  const room = rk && rk.on;
  const lines = [
    '# Competitive Audio Optimizer',
    `# Profile: ${L(profile, 'name')} | Headphones: ${hp ? hp.name : '-'} | ${new Date().toLocaleString(CAO_LANG === 'en' ? 'en-GB' : 'de-DE')}`,
    `Preamp: ${(-maxBoost - 0.5 - (room ? 3 : 0)).toFixed(1)} dB`
  ];
  const bass = rk && rk.bass != null ? rk.bass : 50;
  if (trick) {
    // Bass (SUB) kommt beim Raumklang erst beim Zusammenmischen dazu – sonst hier
    const sub = room ? 1 : +(bass / 100).toFixed(2);
    lines.push('# Channel trick: front and center quieter (own gun), side/rear full. Needs 7.1 in game.');
    lines.push(`Copy: L=${trick.F}*L R=${trick.F}*R C=${trick.C}*C SUB=${sub}*SUB RL=${trick.R}*RL RR=${trick.R}*RR SL=${trick.S}*SL SR=${trick.S}*SR`);
  }
  if (room) SPATIAL.apoLines({ bass, upmix: !!rk.upmix }).forEach(l => lines.push(l));
  pts.forEach((p, i) => lines.push(`Filter ${i + 1}: ON ${code[p.type] || 'PK'} Fc ${+p.f} Hz Gain ${(+p.g).toFixed(1)} dB Q ${(+p.q).toFixed(2)}`));
  if (!room && trick && hesuvi) lines.push('Include: HeSuVi\\hesuvi.txt');
  return lines.join('\r\n') + '\r\n';
}

// ---------- Profile aus dem Audio-Labor ----------
const LAB_STORE = 'audio-labor-mw4-v9';
const LAB_COLORS = ['#5fd3c0', '#ff7a1a', '#64b5d6', '#c58af9', '#ffd166', '#ff6b9d', '#7ccf6b', '#f4a261'];
function labProfiles() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(LAB_STORE) || 'null'); } catch {}
  if (!s || !Array.isArray(s.profiles)) return [];
  const builtin = new Set(['tmw4', 'triton', 'eclipse', 'story']);
  return s.profiles.filter(p => p && p.kind === 'sonar' && Array.isArray(p.points) && !builtin.has(p.id)).map(p => {
    const sl = Array.isArray(p.sliders) ? p.sliders : [0, 0, 0];
    return {
      id: 'lab:' + p.id, lab: true, name: p.name, tag: p.own ? T('Labor · eigenes', 'Lab · own') : T('Labor', 'Lab'), tagColor: LAB_COLORS[((p.c % 8) + 8) % 8],
      short: labWhat(p), note: labWhat(p) + T(' Bearbeiten kannst du es im Audio-Labor.', ' You can edit it in the Audio Lab.'), hasCorr: !!p.hasCorr,
      points: p.points.filter(x => x.on !== false).slice(0, 10).map(x => P(x.type in TYPES ? x.type : 'peak', +x.f || 1000, +x.g || 0, +x.q || 0.7)),
      sliders: { bass: +sl[0] || 0, voice: +sl[1] || 0, treble: +sl[2] || 0 },
      tips: [], trick: { C: 0.5, F: 0.7, S: 1, R: 1, SUB: 0.6 }
    };
  });
}

// Beschreibungen der Labor-Vorlagen auf Englisch (eigene Texte bleiben, wie sie sind)
const LAB_WHAT_EN = {
  triton: 'Claude’s suggestion. Balanced, for multiplayer and long sessions.',
  eclipse: 'Rebuild of Rara Eclipse. Strongly boosted footsteps, good for Warzone.',
  tiem: 'Your rework from 23 Oct. E9 correction already included.',
  talt: 'Your previous profile. Lots of boost in the mids.',
  rarason: 'Rara Eclipse original rebuilt in 5 Sonar points (about 1 dB off). Very strong thump range.',
  tmw4: 'Your new profile: structure of Tournament (old), values from Triton, Eclipse and Rara. Tuned for the E9.',
  rara: 'Original from the Rara app. For comparison only, not for Sonar.'
};
function labWhat(p) { return (CAO_LANG === 'en' && LAB_WHAT_EN[p.id] && !p.own) ? LAB_WHAT_EN[p.id] : (p.what || ''); }

// ---------- Spiele ----------
// audio: '71' = Spiel liefert echtes 7.1 · 'own' = eigener Raumklang im Spiel · 'stereo' = nur Stereo
const GAMES = [
  { id: 'mw4', name: 'Call of Duty: MW4', en: { name: 'Call of Duty: MW4' }, audio: '71', plat: ['pc', 'ps', 'xbox'], opt: { file: 's.1.0.cod26.txt', label: 'MW4' } },
  { id: 'dmz', name: 'Call of Duty: MW4 – DMZ', audio: '71', plat: ['pc', 'ps', 'xbox'], opt: { file: 's.1.0.cod26.txt', label: 'MW4' } },
  { id: 'bo7', name: 'Black Ops 7 / Warzone', audio: '71', plat: ['pc', 'ps', 'xbox'], opt: { file: 's.1.0.cod25.txt1', label: 'BO7 / Warzone' } },
  { id: 'bf6', name: 'Battlefield 6', audio: 'own', plat: ['pc', 'ps', 'xbox'] },
  { id: 'r6', name: 'Rainbow Six Siege X', audio: 'own', plat: ['pc', 'ps', 'xbox'] },
  { id: 'arc', name: 'ARC Raiders', audio: 'own', plat: ['pc', 'ps', 'xbox'] },
  { id: 'wardogs', name: 'WARDOGS', audio: 'own', plat: ['pc'] },
  { id: 'valorant', name: 'Valorant', audio: 'own', plat: ['pc', 'ps', 'xbox'] },
  { id: 'cs2', name: 'Counter-Strike 2', audio: 'own', plat: ['pc'] },
  { id: 'story', name: 'Story-Spiele / Filme', en: { name: 'Story games / movies' }, audio: 'stereo', plat: ['pc'] }
];
const AUDIO_TYPE = {
  '71': { de: 'echtes 7.1', en: 'true 7.1', cls: 'c71' },
  own: { de: 'eigener Raumklang', en: 'own surround', cls: 'cown' },
  stereo: { de: 'nur Stereo', en: 'stereo only', cls: 'cst' }
};
const GAME_FACTS = {
  dmz: [
    ['Gleiche Datei wie der Multiplayer', 'DMZ nutzt die Einstellungsdatei von MW4 (s.1.0.cod26.txt). Grafik-Änderungen im Game Optimizer gelten für beide Modi.'],
    ['Ruhiger spielen, mehr hören', 'In DMZ entscheidet oft, wer den anderen zuerst hört. Musik aus, Dialoge lauter (Aufträge und Infos kommen über Sprache).'],
    ['Umgebungs-Sprachchat', 'Gegner in der Nähe hören, was du sagst – keine Pläne oder Positionen laut besprechen.'],
    ['Sound-Profile', 'Die MW4-Profile passen auch hier. Wem Explosionen in DMZ zu viel sind: Testvariante „Explosionen leiser“.']
  ],
  bf6: [
    ['Eigener Kopfhörer-Mix', 'Battlefield 6 mischt selbst für Kopfhörer (Soundsystem „Kopfhörer“). Sonar Spatial Audio und CAO-Raumklang aus lassen.'],
    ['War Tapes', 'Der Audio-Mix „War Tapes“ gilt als der mit der klarsten Ortung. Musik auf 0, Tinnitus-Effekt auf 0.'],
    ['Sound-Profile', 'Die Profile sind auf CoD abgestimmt. Der Equalizer hilft trotzdem (Explosionen leiser, Schritte klarer), ist aber nicht eigens für BF6 geprüft.']
  ],
  r6: [
    ['Sound ist alles', 'In Siege hörst du Gegner durch Wände, Böden und Decken. Dynamikumfang „Niedrig (Nachtmodus)“ hebt leise Geräusche an – das nutzen fast alle Profis.'],
    ['Eigene 3D-Ortung', 'Siege ortet selbst in 3D. Zusätzlicher Raumklang (Windows Sonic, Sonar, CAO) macht Schritte oft ungenauer – aus lassen oder bewusst nur eins nutzen.'],
    ['Sound-Profile', 'Die Profile sind auf CoD abgestimmt und nicht eigens für Siege geprüft. Tipp: Profil mit wenig Wumms (Tournament MW4).']
  ],
  arc: [
    ['Nachtmodus', 'ARC Raiders hat einen Nachtmodus für den Dynamikumfang. An = Schritte, Looten und entfernte ARC-Drohnen werden lauter, Explosionen leiser.'],
    ['Eigene Ortung', 'Das Spiel ortet selbst. Windows-Raumklang, Sonar Spatial Audio und CAO-Raumklang aus – sonst wird doppelt gerechnet.'],
    ['Sound-Profile', 'Die Profile sind auf CoD abgestimmt und nicht eigens für ARC Raiders geprüft.']
  ],
  wardogs: [
    ['Nur PC (Early Access)', 'WARDOGS ist seit September 2026 im Early Access auf PC. PS5 und Xbox sind erst für 2028 angekündigt.'],
    ['3D Spatial Audio', 'Das Spiel hat einen eigenen 3D-Raumklang. An lassen und dafür Windows/Sonar/CAO-Raumklang aus.'],
    ['Sound-Profile', 'Die Profile sind auf CoD abgestimmt und nicht eigens für WARDOGS geprüft.']
  ],
  bo7: [
    ['Eine Datei für BO7 und Warzone', 'Black Ops 7 und Warzone teilen sich die Einstellungsdatei s.1.0.cod25.txt1. Der Game Optimizer ändert also beide.'],
    ['Spiel mischt in 7.1', 'Wie MW4: Im Spiel 7.1 wählen, dann Raumklang über Sonar Spatial Audio oder CAO-Raumklang.'],
    ['Sound-Profile', 'Die Sound-Profile sind auf MW4 abgestimmt und hier übernommen – noch nicht eigens für BO7/Warzone geprüft.']
  ],
  valorant: [
    ['Eigener Raumklang im Spiel', 'Valorant hat eine eigene Raumklang-Berechnung (Einstellungen → Audio → HRTF). Nutze entweder die oder Sonar/CAO-Raumklang – nie beides, sonst verschwimmt die Richtung.'],
    ['Ausgabe', 'Windows und Sonar auf Stereo lassen, Spatial Audio in Sonar aus.'],
    ['Sound-Profile', 'Die Sound-Profile sind auf MW4 abgestimmt. Der Equalizer hilft trotzdem (Explosionen leiser, Schritte klarer), ist aber nicht eigens geprüft.']
  ],
  cs2: [
    ['Eigener Raumklang im Spiel', 'CS2 berechnet Raumklang selbst (Audio-Einstellungen, „Erweiterte 3D-Audioverarbeitung“). Dann Sonar Spatial Audio und CAO-Raumklang aus.'],
    ['Ausgabe', 'Im Spiel Kopfhörer / Stereo wählen.'],
    ['Sound-Profile', 'Die Sound-Profile sind auf MW4 abgestimmt und nicht eigens für CS2 geprüft.']
  ],
  story: [
    ['Nur Stereo', 'Viele Story-Spiele, Videos und Musik liefern nur Stereo. Raumklang kann daraus keine echte Richtung machen.'],
    ['Hochrechnen', 'Auf der Seite Raumklang kannst du Stereo auf 7.1 hochrechnen – klingt räumlicher, nur für Stimmung.']
  ]
};
const GAME_FACTS_EN = {
  dmz: [
    ['Same file as multiplayer', 'DMZ uses the MW4 settings file (s.1.0.cod26.txt). Graphics changes in the Game Optimizer apply to both modes.'],
    ['Play quieter, hear more', 'In DMZ, whoever hears the other first often wins. Music off, dialogue louder (missions and intel come through voice).'],
    ['Proximity chat', 'Nearby enemies hear what you say – don’t discuss plans or positions out loud.'],
    ['Sound profiles', 'The MW4 profiles fit here too. If explosions are too much in DMZ: test variant “quieter explosions”.']
  ],
  bf6: [
    ['Own headphone mix', 'Battlefield 6 mixes for headphones itself (sound system “Headphones”). Keep Sonar Spatial Audio and CAO surround off.'],
    ['War Tapes', 'The “War Tapes” audio mix is considered the clearest for positioning. Music to 0, tinnitus SFX to 0.'],
    ['Sound profiles', 'The profiles are tuned for CoD. The EQ still helps (quieter explosions, clearer footsteps) but is not specifically checked for BF6.']
  ],
  r6: [
    ['Sound is everything', 'In Siege you hear enemies through walls, floors and ceilings. Dynamic range “Low (Night Mode)” raises quiet sounds – almost every pro uses it.'],
    ['Own 3D positioning', 'Siege positions in 3D itself. Extra surround (Windows Sonic, Sonar, CAO) often makes footsteps less precise – keep it off or deliberately use only one.'],
    ['Sound profiles', 'The profiles are tuned for CoD and not specifically checked for Siege. Tip: a profile with little boom (Tournament MW4).']
  ],
  arc: [
    ['Night mode', 'ARC Raiders has a night mode for dynamic range. On = footsteps, looting and distant ARC drones get louder, explosions quieter.'],
    ['Own positioning', 'The game positions sound itself. Windows spatial sound, Sonar Spatial Audio and CAO surround off – otherwise it’s processed twice.'],
    ['Sound profiles', 'The profiles are tuned for CoD and not specifically checked for ARC Raiders.']
  ],
  wardogs: [
    ['PC only (Early Access)', 'WARDOGS has been in Early Access on PC since September 2026. PS5 and Xbox are announced for 2028.'],
    ['3D Spatial Audio', 'The game has its own 3D surround. Keep it on and turn Windows/Sonar/CAO surround off.'],
    ['Sound profiles', 'The profiles are tuned for CoD and not specifically checked for WARDOGS.']
  ],
  bo7: [
    ['One file for BO7 and Warzone', 'Black Ops 7 and Warzone share the settings file s.1.0.cod25.txt1, so the Game Optimizer changes both.'],
    ['The game mixes in 7.1', 'Like MW4: choose 7.1 in game, then surround via Sonar Spatial Audio or CAO surround.'],
    ['Sound profiles', 'The sound profiles are tuned for MW4 and reused here – not separately checked for BO7/Warzone.']
  ],
  valorant: [
    ['Own surround in game', 'Valorant has its own surround processing (Settings → Audio → HRTF). Use either that or Sonar/CAO surround – never both, or the direction gets blurry.'],
    ['Output', 'Keep Windows and Sonar on stereo, Spatial Audio in Sonar off.'],
    ['Sound profiles', 'The sound profiles are tuned for MW4. The EQ still helps (quieter explosions, clearer footsteps) but is not specifically checked.']
  ],
  cs2: [
    ['Own surround in game', 'CS2 does its own surround processing (audio settings, “Advanced 3D Audio Processing”). Then turn Sonar Spatial Audio and CAO surround off.'],
    ['Output', 'Choose headphones / stereo in game.'],
    ['Sound profiles', 'The sound profiles are tuned for MW4 and not specifically checked for CS2.']
  ],
  story: [
    ['Stereo only', 'Many story games, videos and music only deliver stereo. Surround cannot turn that into real direction.'],
    ['Upmix', 'On the Surround page you can upmix stereo to 7.1 – sounds roomier, just for atmosphere.']
  ]
};
