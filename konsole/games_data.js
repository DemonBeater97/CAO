/* © 2026 MrMaik240 – CAO (Competitive Audio Optimizer). Alle Rechte vorbehalten / All rights reserved. Keine Nutzung für KI-Training / No AI training. Siehe LICENSE. */
/* Spiel-Einstellungen für CAO (PC) und CAO Konsole – Stand Oktober 2026.
   GAME_AUDIO[id](ctx): Audio-Einstellungen im Spiel. ctx = { pc: true|false, output: '71'|'stereo' }
   GAME_GFX[id](): Grafik-Liste für Konsole (Gruppen mit Punkten).
   Quellen: Dexerto, KeenGamer, WASD Life, ProSettings, Embody, Gaming Route (siehe Über CAO / Info). */
const _a = (k, t, v, w) => ({ k, t, v, w: w || '' });
const CONSOLE_TV = () => ({ grp: T('Konsole & Fernseher', 'Console & TV'), items: [
  _a('v-120', T('120 Hz + VRR', '120 Hz + VRR'), T('An', 'On'), T('Für flüssiges Bild und weniger Verzögerung. Fernseher/Monitor muss 120 Hz können.', 'For smooth picture and less delay. TV/monitor must support 120 Hz.')),
  _a('v-game', T('Spielmodus am Fernseher', 'Game mode on the TV'), T('An', 'On'), T('Weniger Verzögerung zwischen Controller und Bild.', 'Less delay between controller and picture.')) ] });

const COD_AUDIO = (ctx, dmz) => [
  _a('g-mix', T('Audio-Mix', 'Audio mix'), T('Kopfhörer', 'Headphones'), dmz ? T('Für Kopfhörer abgestimmt. In DMZ kannst du auch „Heimkino“ testen – nimm, womit du Richtung am besten hörst.', 'Tuned for headphones. In DMZ you can also try “Home Theater” – use whichever gives you direction best.') : T('Für Kopfhörer abgestimmt – Schritte und Richtung am klarsten.', 'Tuned for headphones – clearest footsteps and direction.')),
  _a('g-out', T('Lautsprecher-Ausgabe', 'Speaker output'), ctx.pc && ctx.output === '71' ? '7.1 Surround' : 'Stereo', ctx.pc ? '' : T('Den Raumklang macht die Konsole (3D-Audio / Windows Sonic).', 'The console does the surround (3D Audio / Windows Sonic).')),
  _a('g-tin', T('Tinnitus-Geräusch reduzieren', 'Reduce tinnitus sound'), T('An', 'On'), T('Nimmt das Piepen nach Explosionen weg.', 'Removes the ringing after explosions.')),
  _a('g-music', T('Gameplay- und Film-Musik', 'Gameplay and cinematic music'), '0', T('Musik überdeckt Schritte.', 'Music masks footsteps.')),
  _a('g-dlg', T('Dialog-Lautstärke', 'Dialogue volume'), dmz ? '80–90' : '30', dmz ? T('In DMZ wichtig: Aufträge und Infos laufen über Sprache.', 'Important in DMZ: missions and intel come through voice.') : T('Ansagen leiser, Schritte bleiben vorne.', 'Callouts quieter, footsteps stay in front.')),
  _a('g-mono', T('Mono-Audio', 'Mono audio'), T('Aus', 'Off'), T('Mono nimmt dir die Richtung.', 'Mono removes direction.')),
  _a('g-asym', T('Asymmetrischer Hörausgleich', 'Asymmetric hearing compensation'), T('Aus', 'Off'), T('Eine Hörhilfe – sonst verbiegt sie den Klang.', 'A hearing aid feature – otherwise it bends the sound.')),
  ...(dmz ? [_a('g-prox', T('Umgebungs-Sprachchat', 'Proximity chat'), T('An – aber aufpassen', 'On – but careful'), T('Gegner in der Nähe hören, was du sagst. Keine Pläne oder Positionen laut besprechen.', 'Nearby enemies hear what you say. Don’t discuss plans or positions out loud.'))] : [])
];
const COD_GFX = () => [CONSOLE_TV(), { grp: T('Im Spiel – Grafik & Ansicht', 'In game – graphics & view'), items: [
  _a('v-fov', T('Sichtfeld (FOV)', 'Field of view (FOV)'), '105', T('Mehr Überblick, Gegner am Rand sichtbar. Wird dir übel: etwas runter.', 'More overview, enemies at the edge visible. If you feel sick: lower it a bit.')),
  _a('v-adsfov', T('Sichtfeld beim Zielen', 'ADS field of view'), T('Betroffen', 'Affected'), T('Zoom bleibt zum Sichtfeld passend.', 'Zoom stays consistent with your FOV.')),
  _a('v-cam', T('Kamerabewegung', 'Camera movement'), T('Minimal (25 %)', 'Minimal (25%)'), T('Weniger Wackeln beim Sprinten.', 'Less shake while sprinting.')),
  _a('v-wblur', T('Bewegungsunschärfe Welt', 'World motion blur'), T('Aus', 'Off'), T('Bild bleibt in Bewegung scharf.', 'Picture stays sharp in motion.')),
  _a('v-gblur', T('Bewegungsunschärfe Waffe', 'Weapon motion blur'), T('Aus', 'Off')),
  _a('v-grain', T('Filmkörnung', 'Film grain'), '0', T('Körnung macht Gegner unruhiger zu erkennen.', 'Grain makes enemies harder to spot.')),
  _a('v-dof', T('Tiefenunschärfe (Welt / Waffe)', 'Depth of field (world / weapon)'), T('Aus', 'Off'), T('Alles bleibt scharf, nicht nur die Mitte.', 'Everything stays sharp, not just the centre.')),
  _a('v-bright', T('Helligkeit', 'Brightness'), T('So, dass Umrisse in dunklen Räumen sichtbar sind', 'So outlines in dark rooms are visible'), T('Nicht zu hell – sonst wirkt alles grau.', 'Not too bright – otherwise everything looks grey.')) ] }];

const GAME_AUDIO = {
  mw4: ctx => COD_AUDIO(ctx, false),
  dmz: ctx => COD_AUDIO(ctx, true),
  bo7: ctx => COD_AUDIO(ctx, false),
  bf6: ctx => [
    _a('g-sys', T('Soundsystem', 'Sound system'), T('Kopfhörer', 'Headphones'), T('Das Spiel mischt selbst für Kopfhörer – zusätzlicher Raumklang aus.', 'The game mixes for headphones itself – extra surround off.')),
    _a('g-mix', T('Audio-Mix', 'Audio mix'), 'War Tapes', T('Der Mix mit der klarsten Ortung und weniger übertriebenem Krach.', 'The mix with the clearest positioning and less over-the-top noise.')),
    _a('g-music', T('Musik-Lautstärke', 'Music volume'), '0', T('Musik überdeckt Schritte.', 'Music masks footsteps.')),
    _a('g-sfx', T('Soundeffekte', 'Sound effects'), '100', ''),
    _a('g-vo', T('Kommandant- und Soldaten-Stimmen', 'Commander and soldier VO'), '80', T('Wichtige Ansagen bleiben hörbar, ohne Schritte zu überdecken.', 'Important callouts stay audible without masking footsteps.')),
    _a('g-tin', T('Tinnitus-Effekt-Lautstärke', 'Tinnitus SFX volume'), '0', T('Kein Pfeifen nach Explosionen.', 'No ringing after explosions.')),
    ...(ctx.pc ? [] : [_a('g-pad', T('Controller-Lautsprecher', 'Controller speaker volume'), '0', T('Sonst kommen Geräusche aus dem Controller statt aus dem Headset.', 'Otherwise sounds come from the controller instead of the headset.'))])
  ],
  r6: ctx => [
    _a('g-dyn', T('Dynamikumfang', 'Dynamic range'), T('Niedrig (Nachtmodus)', 'Low (Night Mode)'), T('Leise Geräusche wie Schritte und Gadgets werden angehoben, laute gedämpft – Standard bei Profis.', 'Quiet sounds like footsteps and gadgets are raised, loud ones tamed – the pro standard.')),
    _a('g-music', T('Musik-Lautstärke', 'Music volume'), '0', ''),
    _a('g-dlg', T('Dialog-Lautstärke', 'Dialogue volume'), '100', T('Viele Guides empfehlen 100 – sonst können wichtige Hinweise untergehen.', 'Many guides recommend 100 – otherwise important cues can get lost.')),
    _a('g-master', T('Gesamtlautstärke', 'Master volume'), '80–100', ''),
    _a('g-voice', T('Sprachchat', 'Voice chat'), '60–70', T('Team hörbar, aber nicht lauter als Schritte.', 'Team audible, but not louder than footsteps.')),
    ...(ctx.pc ? [_a('g-loud', T('Windows-Lautstärkeausgleich', 'Windows loudness equalization'), T('Aus testen', 'Try off'), T('Der Nachtmodus des Spiels gleicht schon aus – doppelt drückt alles zu sehr zusammen.', 'The game’s night mode already evens things out – doing it twice squashes everything.'))] : []),
    _a('g-spat', ctx.pc ? T('Windows/Sonar/CAO-Raumklang', 'Windows/Sonar/CAO surround') : T('Raumklang der Konsole', 'Console surround'), T('Aus testen', 'Try off'), T('Siege ortet selbst in 3D – doppelter Raumklang macht Schritte oft ungenauer.', 'Siege positions in 3D itself – double surround often makes footsteps less precise.'))
  ],
  arc: ctx => [
    _a('g-night', T('Nachtmodus (Dynamikumfang)', 'Night mode (dynamic range)'), T('An', 'On'), T('Hebt leise Geräusche wie Schritte, Looten und entfernte ARC-Drohnen an.', 'Raises quiet sounds like footsteps, looting and distant ARC drones.')),
    _a('g-out', T('Ausgabe', 'Output'), T('Stereo / Kopfhörer', 'Stereo / headphones'), ''),
    _a('g-sfx', T('Effekte', 'Effects'), '100', ''),
    _a('g-music', T('Musik', 'Music'), T('Niedrig', 'Low'), ''),
    ...(ctx.pc ? [_a('g-loud', T('Windows-Lautstärkeausgleich', 'Windows loudness equalization'), T('Aus testen', 'Try off'), T('Der Nachtmodus des Spiels gleicht schon aus – doppelt drückt alles zu sehr zusammen.', 'The game’s night mode already evens things out – doing it twice squashes everything.'))] : []),
    _a('g-spat', ctx.pc ? T('Windows/Sonar/CAO-Raumklang', 'Windows/Sonar/CAO surround') : T('Raumklang der Konsole', 'Console surround'), T('Aus', 'Off'), T('Das Spiel ortet selbst – sonst wird doppelt gerechnet.', 'The game positions itself – otherwise it’s processed twice.'))
  ],
  wardogs: ctx => [
    _a('g-3d', T('3D-Raumklang (3D Spatial Audio)', '3D Spatial Audio'), T('An', 'On'), T('Der eigene Raumklang des Spiels – dafür Windows/Sonar/CAO-Raumklang aus.', 'The game’s own surround – keep Windows/Sonar/CAO surround off.')),
    _a('g-music', T('Musik im Menü und im Spiel', 'Menu and in-game music'), '0', ''),
    _a('g-radio', T('Radio-Musik', 'Radio music'), '30', T('Leise genug, um Schritte nicht zu überdecken.', 'Quiet enough not to mask footsteps.')),
    _a('g-sfx', T('Effekte', 'Effects'), '100', ''),
    _a('g-tin', T('Tinnitus-Effekt', 'Tinnitus audio'), T('Aus', 'Off'), T('Kein Pfeifen nach Explosionen.', 'No ringing after explosions.'))
  ],
  valorant: ctx => [
    _a('g-hrtf', 'HRTF', T('An', 'On'), T('Valorants eigener 3D-Sound für Kopfhörer – dafür jeden anderen Raumklang aus.', 'Valorant’s own 3D sound for headphones – turn every other surround off.')),
    _a('g-spk', T('Lautsprecher-Konfiguration', 'Speaker configuration'), 'Stereo', ''),
    _a('g-sfx', T('Soundeffekte', 'Sound effects'), '100 %', ''),
    _a('g-vo', T('Sprachausgabe (Agenten)', 'Voice-over'), '50–60 %', ''),
    _a('g-music', T('Musik', 'Music'), T('Niedrig', 'Low'), '')
  ],
  cs2: ctx => [
    _a('g-dev', T('Audiogerät', 'Audio device'), T('Kopfhörer', 'Headphones'), T('CS2 berechnet Raumklang selbst – Windows/Sonar/CAO-Raumklang aus.', 'CS2 does its own surround – keep Windows/Sonar/CAO surround off.')),
    _a('g-music', T('Musik', 'Music'), T('Niedrig', 'Low'), '')
  ],
  story: ctx => []
};

const GAME_GFX = {
  mw4: COD_GFX, dmz: COD_GFX, bo7: COD_GFX,
  bf6: () => [CONSOLE_TV(), { grp: T('Im Spiel – Grafik & Kamera', 'In game – graphics & camera'), items: [
    _a('v-perf', T('Leistungs-Voreinstellung', 'Performance preset'), T('Leistung', 'Performance'), T('Mehr Bilder pro Sekunde.', 'More frames per second.')),
    _a('v-fov', T('Sichtfeld (FOV)', 'Field of view (FOV)'), '105', T('Guter Startwert zwischen 100 und 110.', 'Good starting point between 100 and 110.')),
    _a('v-wfov', T('Waffen-Sichtfeld', 'Weapon field of view'), T('Breit', 'Wide'), ''),
    _a('v-blur', T('Bewegungsunschärfe Welt / Waffe', 'World / weapon motion blur'), '0', T('Bild bleibt in Bewegung scharf.', 'Picture stays sharp in motion.')),
    _a('v-bob', T('Kamerawackeln beim Sprinten reduzieren', 'Reduce sprint camera bobbing'), T('An', 'On'), ''),
    _a('v-ca', T('Chromatische Aberration', 'Chromatic aberration'), T('Aus', 'Off'), T('Keine farbigen Ränder an Kanten.', 'No coloured fringes on edges.')),
    _a('v-vig', T('Vignette', 'Vignette'), T('Aus', 'Off'), T('Ränder bleiben hell.', 'Edges stay bright.')),
    _a('v-grain', T('Filmkörnung', 'Film grain'), T('Aus', 'Off'), '') ] }],
  r6: () => [CONSOLE_TV(), { grp: T('Im Spiel – Grafik & Ansicht', 'In game – graphics & view'), items: [
    _a('v-perf', T('Leistungsmodus / 120 Hz', 'Performance mode / 120 Hz'), T('An', 'On'), T('Wichtiger als schöne Grafik – Siege entscheidet sich in Sekundenbruchteilen.', 'More important than pretty graphics – Siege is decided in split seconds.')),
    _a('v-fov', T('Sichtfeld (FOV)', 'Field of view (FOV)'), T('So hoch, wie es angenehm ist', 'As high as comfortable'), T('Mehr Überblick; zu hoch macht Gegner kleiner.', 'More overview; too high makes enemies smaller.')),
    _a('v-blur', T('Bewegungsunschärfe', 'Motion blur'), T('Aus', 'Off'), ''),
    _a('v-shake', T('Bildschirmwackeln reduzieren', 'Screen shake reduction'), T('An', 'On'), '') ] }],
  arc: () => [CONSOLE_TV(), { grp: T('Im Spiel – Grafik & Ansicht', 'In game – graphics & view'), items: [
    _a('v-fov', T('Sichtfeld (FOV)', 'Field of view (FOV)'), T('Hoch (angenehm)', 'High (comfortable)'), T('Mehr Überblick über Gegner und ARC.', 'More overview of enemies and ARC.')),
    _a('v-blur', T('Bewegungsunschärfe', 'Motion blur'), T('Aus', 'Off'), T('Klar bei Explosionen und schnellen Drehungen.', 'Clear during explosions and fast turns.')),
    _a('v-dmg', T('Trefferrichtungs-Anzeige', 'Damage direction indicator'), T('An', 'On'), T('Zeigt, woher Schüsse kommen.', 'Shows where shots come from.')),
    _a('v-bright', T('Helligkeit', 'Brightness'), '50 %', '') ] }],
  valorant: () => [CONSOLE_TV(), { grp: T('Im Spiel – Ansicht', 'In game – view'), items: [
    _a('v-hl', T('Gegner-Hervorhebungsfarbe', 'Enemy highlight color'), T('Gelb oder Lila', 'Yellow or purple'), T('Hebt sich auf den meisten Karten am besten ab.', 'Stands out best on most maps.')),
    _a('v-blur', T('Bewegungsunschärfe / Effekte', 'Motion blur / effects'), T('Aus / niedrig', 'Off / low'), '') ] }]
};
