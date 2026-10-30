/* © 2026 MrMaik240 – CAO (Competitive Audio Optimizer). Alle Rechte vorbehalten / All rights reserved. Keine Nutzung für KI-Training / No AI training. Siehe LICENSE. */
/* CAO Konsole – Daten (Stand Oktober 2026)
   Geräte: was man OHNE PC an der Konsole einstellen kann.
   kind: 'geq'    = eigener EQ mit festen Reglern (bands = Frequenzen) → CAO rechnet Werte aus
         'preset' = nur Voreinstellungen → CAO sagt, welche passt
         'app'    = Handy-App des Herstellers: phoneEq = eigene Regler in der App (CAO rechnet Werte),
                    sonst nur Spiel-Voreinstellungen in der App + eigener EQ einmalig am PC (pcEq) – wird im Headset gespeichert
         'none'   = an der Konsole nichts einstellbar → nur Konsole + Spiel
   q = Name in der Messdaten-Liste (AutoEQ) für die Kopfhörer-Korrektur, ax = grob angelehnt */
const T2 = (de, en) => (typeof CAO_LANG !== 'undefined' && CAO_LANG === 'en') ? en : de;
const SS10 = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const LG10 = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
// Arctis Companion App (SteelSeries) – gleiche Schritte für alle unterstützten Modelle
const SS_APP = (name, o = {}) => ({ kind: 'app', app: 'Arctis Companion', phoneEq: false, bands: SS10, range: 12,
  where: () => T2('Arctis Companion App (Handy)', 'Arctis Companion app (phone)'),
  pcSteps: () => [T2('Headset-Dongle einmal an einen PC stecken (geht auch beim Kumpel), SteelSeries GG öffnen.', 'Plug the headset dongle into a PC once (a friend’s works too), open SteelSeries GG.'),
    T2(`GG → Engine → ${name} → Reiter „Audio“. Oben rechts „2,4 GHz Drahtlos“ wählen (nicht Bluetooth).`, `GG → Engine → ${name} → “Audio” tab. Top right, pick “2.4 GHz wireless” (not Bluetooth).`),
    T2('Bei „Equalizer Voreinstellungen“ über „…“ eine neue eigene anlegen, z. B. „CAO“ plus Spielname.', 'Under “Equalizer presets”, use “…” to create a new custom one, e.g. “CAO” plus the game name.'),
    T2('Die 10 Punkte stehen schon an der richtigen Stelle (von links: 31 Hz bis 16 kHz) – nur hoch oder runter auf die Werte unten ziehen. Dann unten rechts „Speichern“.', 'The 10 points are already in the right place (from the left: 31 Hz to 16 kHz) – just drag them up or down to the values below. Then “Save” at the bottom right.'),
    o.hub ? T2('An der Konsole: GameHub-Lautstärkerad gedrückt halten → Audio-Optionen → Equalizer → deine CAO-Voreinstellung wählen.', 'On console: hold the GameHub volume dial → audio options → equalizer → pick your CAO preset.')
          : T2('Danach das Headset mit der Companion App verbinden – die Voreinstellung wird automatisch übernommen. In der App bei 2,4 GHz deine CAO-Voreinstellung auswählen.', 'Then connect the headset to the Companion app – the preset is imported automatically. In the app, select your CAO preset for 2.4 GHz.')],
  pcNote: () => o.unsure ? T2('Bestätigt für Nova 5, Nova Elite und Nova Pro Omni. Zeigt GG bei deinem Modell keine solche Kurve mit Speichern, nimm in der Companion App die Spiel-Voreinstellung.', 'Confirmed for the Nova 5, Nova Elite and Nova Pro Omni. If GG doesn’t show such a curve with save for your model, pick the game preset in the Companion app.')
    : T2('Die Voreinstellung liegt dann im Headset und gilt an PS5 und Xbox – ganz ohne PC. GG dabei offen und das Headset verbunden lassen, bis gespeichert ist. Für weitere Spiele einfach wiederholen. (Der Reiter „Mikrofon“ ist nur für dein Mikro – für CAO egal.)', 'The preset then lives in the headset and works on PS5 and Xbox – no PC needed. Keep GG open and the headset connected until it’s saved. Repeat for more games. (The “Microphone” tab is only for your mic – not relevant for CAO.)') });

const C_DEVICES = [
  // ---------- SteelSeries ----------
  { id: 'nova-pro-w', brand: 'SteelSeries', name: 'Arctis Nova Pro Wireless', plat: ['ps', 'xbox'], q: 'SteelSeries Arctis Nova Pro Wireless',
    kind: 'geq', bands: SS10, range: 10, where: () => T2('Basisstation', 'Base station'),
    steps: () => [T2('Rad an der Basisstation gedrückt halten → Hauptmenü.', 'Press and hold the base station wheel → main menu.'),
      T2('„Equalizer“ → „Benutzerdefiniert“ wählen.', 'Choose “Equalizer” → “Custom”.'),
      T2('Die 10 Regler wie unten einstellen (drehen = Wert, drücken = nächster Regler).', 'Set the 10 bands as shown below (turn = value, press = next band).')],
    note: () => T2('Einmalig sollte die Firmware aktuell sein (SteelSeries GG am PC). Alternativ: unter „Equalizer“ das Spiel-Profil für dein Spiel wählen, falls es eins gibt.', 'Firmware should be up to date once (SteelSeries GG on PC). Alternative: pick the game profile for your game under “Equalizer”, if there is one.') },
  { id: 'nova-pro', brand: 'SteelSeries', name: 'Arctis Nova Pro (GameDAC Gen 2)', plat: ['ps', 'xbox'], q: 'SteelSeries Arctis Nova Pro',
    kind: 'geq', bands: SS10, range: 10, where: () => 'GameDAC',
    steps: () => [T2('Rad am GameDAC gedrückt halten → Hauptmenü.', 'Press and hold the GameDAC wheel → main menu.'), T2('„Equalizer“ → „Benutzerdefiniert“.', '“Equalizer” → “Custom”.'), T2('Die 10 Regler wie unten einstellen.', 'Set the 10 bands as shown below.')],
    note: () => T2('Einmalig Firmware über SteelSeries GG aktualisieren.', 'Update the firmware once via SteelSeries GG.') },
  { id: 'nova-elite', brand: 'SteelSeries', name: 'Arctis Nova Elite', plat: ['ps', 'xbox'], ax: 'SteelSeries Arctis Nova Pro Wireless', ...SS_APP('Arctis Nova Elite', { hub: 1 }) },
  { id: 'nova-omni', brand: 'SteelSeries', name: 'Arctis Nova Pro Omni', plat: ['ps', 'xbox'], ax: 'SteelSeries Arctis Nova Pro Wireless', ...SS_APP('Arctis Nova Pro Omni') },
  { id: 'nova7g2', brand: 'SteelSeries', name: 'Arctis Nova 7 / 7X / 7P (Gen 1 + Gen 2)', plat: ['ps', 'xbox'], q: 'SteelSeries Arctis Nova 7', ...SS_APP('Arctis Nova 7', { unsure: 1 }),
    note: () => T2('Gen 1: vorher einmal die Firmware aktualisieren (SteelSeries GG), sonst verbindet sich die App nicht.', 'Gen 1: update the firmware once first (SteelSeries GG), otherwise the app won’t connect.') },
  { id: 'nova5', brand: 'SteelSeries', name: 'Arctis Nova 5 / 5X / 5P', plat: ['ps', 'xbox'], q: 'SteelSeries Arctis Nova 5', ...SS_APP('Arctis Nova 5') },
  { id: 'nova3w', brand: 'SteelSeries', name: 'Arctis Nova 3 Wireless', plat: ['ps', 'xbox'], ax: 'SteelSeries Arctis Nova 3', ...SS_APP('Arctis Nova 3 Wireless', { unsure: 1 }) },
  // ---------- Sony ----------
  { id: 'pulse-elite', brand: 'Sony', name: 'PULSE Elite', plat: ['ps'], q: 'Sony Pulse Elite',
    kind: 'preset', where: () => T2('PS5 · Kontrollzentrum', 'PS5 · Control Center'),
    preset: () => T2('Kontrollzentrum → Ton → EQ-Voreinstellungen → „Shooter“. Wer feiner will: „Audiomodus 1“ mit den Reglern anpassen.', 'Control Center → Sound → EQ presets → “Shooter”. For more control: adjust “Audio Mode 1” with the sliders.') },
  { id: 'pulse-3d', brand: 'Sony', name: 'PULSE 3D', plat: ['ps'], q: 'Sony PULSE 3D',
    kind: 'preset', where: () => T2('PS5 · Kontrollzentrum', 'PS5 · Control Center'),
    preset: () => T2('Kontrollzentrum → Ton → EQ-Voreinstellungen → „Shooter“.', 'Control Center → Sound → EQ presets → “Shooter”.') },
  { id: 'pulse-explore', brand: 'Sony', name: 'PULSE Explore', plat: ['ps'], q: 'Sony PULSE Explore', iem: 1,
    kind: 'preset', where: () => T2('PS5 · Kontrollzentrum', 'PS5 · Control Center'),
    preset: () => T2('Kontrollzentrum → Ton → EQ-Voreinstellungen → „Shooter“.', 'Control Center → Sound → EQ presets → “Shooter”.') },
  { id: 'inzone-h9', brand: 'Sony', name: 'INZONE H9 / H9 II', plat: ['ps'], q: 'Sony INZONE H9', kind: 'none', note: () => T2('Die Sony-App „Sound Connect“ stellt den Klang nur über Bluetooth ein – mit dem PS5-Dongle gilt sie laut Sony nicht.', 'Sony’s “Sound Connect” app only adjusts sound over Bluetooth – per Sony it doesn’t apply with the PS5 dongle.') },
  { id: 'inzone-h7', brand: 'Sony', name: 'INZONE H7', plat: ['ps'], q: 'Sony INZONE H7', kind: 'none', note: () => T2('Die Sony-App „Sound Connect“ stellt den Klang nur über Bluetooth ein – mit dem PS5-Dongle gilt sie laut Sony nicht.', 'Sony’s “Sound Connect” app only adjusts sound over Bluetooth – per Sony it doesn’t apply with the PS5 dongle.') },
  { id: 'inzone-h5', brand: 'Sony', name: 'INZONE H5', plat: ['ps'], kind: 'none', note: () => T2('Die Sony-App „Sound Connect“ stellt den Klang nur über Bluetooth ein – mit dem PS5-Dongle gilt sie laut Sony nicht.', 'Sony’s “Sound Connect” app only adjusts sound over Bluetooth – per Sony it doesn’t apply with the PS5 dongle.') },
  { id: 'inzone-h3', brand: 'Sony', name: 'INZONE H3', plat: ['ps'], q: 'Sony INZONE H3', kind: 'none', note: () => T2('Die Sony-App „Sound Connect“ stellt den Klang nur über Bluetooth ein – mit dem PS5-Dongle gilt sie laut Sony nicht.', 'Sony’s “Sound Connect” app only adjusts sound over Bluetooth – per Sony it doesn’t apply with the PS5 dongle.') },
  { id: 'inzone-e9', brand: 'Sony', name: 'INZONE E9', plat: ['ps', 'xbox'], iem: 1, kind: 'none' },
  { id: 'inzone-buds', brand: 'Sony', name: 'INZONE Buds', plat: ['ps'], q: 'Sony INZONE Buds', iem: 1, kind: 'none', note: () => T2('Die Sony-App „Sound Connect“ stellt den Klang nur über Bluetooth ein – mit dem PS5-Dongle gilt sie laut Sony nicht.', 'Sony’s “Sound Connect” app only adjusts sound over Bluetooth – per Sony it doesn’t apply with the PS5 dongle.') },
  // ---------- Microsoft ----------
  { id: 'xbox-wh', brand: 'Microsoft', name: 'Xbox Wireless Headset', plat: ['xbox'], kind: 'geq', bands: [125, 250, 1000, 4000, 8000], range: 10,
    where: () => T2('Xbox Zubehör-App', 'Xbox Accessories app'),
    steps: () => [T2('Xbox Zubehör-App öffnen → Headset wählen → „Konfigurieren“.', 'Open the Xbox Accessories app → select the headset → “Configure”.'), T2('Equalizer → „Benutzerdefiniert“.', 'Equalizer → “Custom”.'), T2('Die 5 Regler wie unten einstellen, Bass-Boost aus.', 'Set the 5 sliders as shown below, bass boost off.')],
    note: () => T2('Achtung: Wechselst du danach auf eine Voreinstellung, kann der eigene EQ verloren gehen.', 'Careful: switching to a preset afterwards can lose your custom EQ.') },
  // ---------- Astro / Logitech ----------
  { id: 'a50x', brand: 'Astro', name: 'A50 X', plat: ['ps', 'xbox'], q: 'ASTRO Gaming A50 X', kind: 'app', app: 'Logitech G', phoneEq: true, bands: LG10, range: 12,
    where: () => T2('Logitech G App (Handy)', 'Logitech G app (phone)'),
    appSteps: () => [T2('App „Logitech G“ installieren und das Headset per Bluetooth mit dem Handy koppeln.', 'Install the “Logitech G” app and pair the headset with your phone via Bluetooth.'),
      T2('In der App: Equalizer → eigene Einstellung anlegen.', 'In the app: equalizer → create a custom setting.'),
      T2('Die 10 Regler wie unten einstellen und auf einen freien Platz im Headset speichern.', 'Set the 10 sliders as shown below and save to a free slot in the headset.'),
      T2('An der Konsole: mit der EQ-Taste an der Basisstation zu diesem Platz schalten.', 'On console: switch to that slot with the EQ button on the base station.')],
    appNote: () => T2('Die Plätze bleiben im Headset gespeichert – auch an der Konsole.', 'The slots stay stored in the headset – on console too.') },
  { id: 'a50g5', brand: 'Astro', name: 'A50 (Gen 5)', plat: ['ps', 'xbox'], ax: 'ASTRO Gaming A50 X', kind: 'app', app: 'Logitech G', phoneEq: true, bands: LG10, range: 12,
    where: () => T2('Logitech G App (Handy)', 'Logitech G app (phone)'),
    appSteps: () => [T2('App „Logitech G“ installieren und das Headset koppeln.', 'Install the “Logitech G” app and pair the headset.'), T2('Equalizer → eigene Einstellung anlegen.', 'Equalizer → create a custom setting.'), T2('Die 10 Regler wie unten einstellen und auf einen freien Platz speichern.', 'Set the 10 sliders as shown below and save to a free slot.'), T2('An der Konsole: mit der EQ-Taste an der Basisstation zu diesem Platz schalten.', 'On console: switch to that slot with the EQ button on the base station.')],
    appNote: () => T2('Neues Modell – Regler-Anzahl laut Logitech-App; falls deine App weniger Regler zeigt, nimm je den mit der nächsten Frequenz.', 'New model – slider count per the Logitech app; if your app shows fewer sliders, use the one with the nearest frequency.') },
  { id: 'a30', brand: 'Astro', name: 'A30', plat: ['ps', 'xbox'], q: 'ASTRO Gaming A30', kind: 'app', app: 'Logitech G', phoneEq: true, bands: LG10, range: 12,
    where: () => T2('Logitech G App (Handy)', 'Logitech G app (phone)'),
    appSteps: () => [T2('App „Logitech G“ installieren und das Headset koppeln.', 'Install the “Logitech G” app and pair the headset.'), T2('Equalizer → eigene Einstellung anlegen.', 'Equalizer → create a custom setting.'), T2('Die 10 Regler wie unten einstellen und speichern.', 'Set the 10 sliders as shown below and save.')],
    appNote: () => T2('Die Einstellung bleibt im Headset. Falls deine App weniger Regler zeigt, nimm je den mit der nächsten Frequenz.', 'If your app shows fewer sliders, use the one with the nearest frequency.') },
  { id: 'a50g4', brand: 'Astro', name: 'A50 (Gen 4)', plat: ['ps', 'xbox'], q: 'ASTRO Gaming A50 (Gen 4 2019)', kind: 'preset', where: () => T2('Headset · EQ-Taste', 'Headset · EQ button'),
    preset: () => T2('EQ-Taste am Headset → Voreinstellung „PRO“ (die Wettkampf-Einstellung).', 'EQ button on the headset → “PRO” preset (the competitive one).') },
  // ---------- Audeze ----------
  { id: 'maxwell', brand: 'Audeze', name: 'Maxwell / Maxwell 2', plat: ['ps', 'xbox'], q: 'Audeze Maxwell', kind: 'app', app: 'Audeze HQ', phoneEq: true, bands: SS10, range: 12,
    where: () => T2('Audeze HQ App (Handy)', 'Audeze HQ app (phone)'),
    appSteps: () => [T2('App „Audeze HQ“ installieren und das Headset per Bluetooth koppeln.', 'Install the “Audeze HQ” app and pair the headset via Bluetooth.'),
      T2('Oben rechts Menü → Equalizer → einen freien Platz wählen (EQ1 bis EQ4). Dabei Musik laufen lassen.', 'Top right menu → Equalizer → pick a free slot (EQ1 to EQ4). Keep music playing while you do it.'),
      T2('Die 10 Regler wie unten einstellen und speichern.', 'Set the 10 sliders as shown below and save.'),
      T2('An der Konsole: Lautstärke-Rad zweimal tippen (EQ-Modus) und zu deinem Platz drehen.', 'On console: double-tap the volume wheel (EQ mode) and scroll to your slot.')],
    appNote: () => T2('Die 4 eigenen Plätze werden im Headset gespeichert.', 'The 4 custom slots are stored in the headset.') },
  // ---------- Turtle Beach ----------
  { id: 'tb-pro', brand: 'Turtle Beach', name: 'Stealth Pro', plat: ['ps', 'xbox'], q: 'Turtle Beach Stealth Pro', kind: 'app', app: 'Turtle Beach Audio Hub', phoneEq: true, bands: SS10, range: 12,
    where: () => T2('Turtle Beach Audio Hub (Handy)', 'Turtle Beach Audio Hub (phone)'),
    appSteps: () => [T2('App „Turtle Beach Audio Hub“ installieren und das Headset per Bluetooth koppeln.', 'Install the “Turtle Beach Audio Hub” app and pair the headset via Bluetooth.'),
      T2('Equalizer → eigene Voreinstellung anlegen (bis zu 10 möglich).', 'Equalizer → create a custom preset (up to 10).'),
      T2('Die 10 Regler wie unten einstellen und speichern.', 'Set the 10 sliders as shown below and save.')],
    appNote: () => T2('Die Voreinstellung bleibt im Headset und gilt dann auch an der Konsole.', 'The preset stays in the headset and then also applies on console.') },
  { id: 'tb-700', brand: 'Turtle Beach', name: 'Stealth 700 (Gen 2 / Gen 2 MAX)', plat: ['ps', 'xbox'], q: 'Turtle Beach Stealth 700 Gen 2', kind: 'app', app: 'Turtle Beach Audio Hub', phoneEq: true, bands: SS10, range: 12,
    where: () => T2('Turtle Beach Audio Hub (Handy)', 'Turtle Beach Audio Hub (phone)'),
    appSteps: () => [T2('App „Turtle Beach Audio Hub“ installieren und das Headset koppeln.', 'Install the “Turtle Beach Audio Hub” app and pair the headset.'), T2('Equalizer → eigene Voreinstellung anlegen.', 'Equalizer → create a custom preset.'), T2('Die Regler wie unten einstellen und speichern.', 'Set the sliders as shown below and save.')],
    appNote: () => T2('Falls deine App weniger Regler zeigt, nimm je den mit der nächsten Frequenz.', 'If your app shows fewer sliders, use the one with the nearest frequency.') },
  { id: 'tb-700g3', brand: 'Turtle Beach', name: 'Stealth 700 / 600 (Gen 3)', plat: ['ps', 'xbox'], q: 'Turtle Beach Stealth 600 Gen 3', kind: 'app', app: 'Turtle Beach Swarm II', phoneEq: true, bands: SS10, range: 12,
    where: () => T2('Turtle Beach Swarm II App (Handy)', 'Turtle Beach Swarm II app (phone)'),
    appSteps: () => [T2('App „Turtle Beach Swarm II“ installieren und das Headset koppeln.', 'Install the “Turtle Beach Swarm II” app and pair the headset.'), T2('Equalizer → eigene Voreinstellung anlegen.', 'Equalizer → create a custom preset.'), T2('Die 10 Regler wie unten einstellen und speichern.', 'Set the 10 sliders as shown below and save.')],
    appNote: () => T2('Turtle Beach nennt 10 Regler; falls deine App weniger zeigt, nimm je den mit der nächsten Frequenz.', 'Turtle Beach lists 10 sliders; if your app shows fewer, use the one with the nearest frequency.') },
  // ---------- ohne Einstellung an der Konsole ----------
  { id: 'bs-v3', brand: 'Razer', name: 'BlackShark V3 Pro', plat: ['ps', 'xbox'], q: 'Razer BlackShark V3 Pro', kind: 'app', app: 'Razer Audio', phoneEq: true, bands: SS10, range: 12,
    where: () => T2('Razer Audio App (Handy)', 'Razer Audio app (phone)'),
    appSteps: () => [T2('App „Razer Audio“ installieren und das Headset per Bluetooth koppeln.', 'Install the “Razer Audio” app and pair the headset via Bluetooth.'), T2('Equalizer → „Anpassen“ wählen.', 'Equalizer → choose “Custom”.'), T2('Die Regler wie unten einstellen.', 'Set the sliders as shown below.')],
    appNote: () => T2('Die Einstellung bleibt im Headset und gilt dann auch am Konsolen-Dongle. Falls deine App weniger Regler zeigt, nimm je den mit der nächsten Frequenz.', 'The setting stays in the headset and then also applies on the console dongle. If your app shows fewer sliders, use the one with the nearest frequency.') },
  { id: 'bs-v2', brand: 'Razer', name: 'BlackShark V2 Pro', plat: ['ps', 'xbox'], q: 'Razer BlackShark V2 Pro', kind: 'app', app: 'Razer Audio', phoneEq: true, bands: SS10, range: 12,
    where: () => T2('Razer Audio App (Handy)', 'Razer Audio app (phone)'),
    appSteps: () => [T2('App „Razer Audio“ installieren und das Headset per Bluetooth koppeln.', 'Install the “Razer Audio” app and pair the headset via Bluetooth.'), T2('Equalizer → „Anpassen“ wählen.', 'Equalizer → choose “Custom”.'), T2('Die Regler wie unten einstellen.', 'Set the sliders as shown below.')],
    appNote: () => T2('Die Einstellung bleibt im Headset und gilt dann auch am Konsolen-Dongle. Falls deine App weniger Regler zeigt, nimm je den mit der nächsten Frequenz.', 'The setting stays in the headset and then also applies on the console dongle. If your app shows fewer sliders, use the one with the nearest frequency.') },
  { id: 'kaira', brand: 'Razer', name: 'Kaira Pro', plat: ['ps', 'xbox'], q: 'Razer Kaira Pro', kind: 'app', app: 'Razer Audio', phoneEq: true, bands: SS10, range: 12,
    where: () => T2('Razer Audio App (Handy)', 'Razer Audio app (phone)'),
    appSteps: () => [T2('App „Razer Audio“ installieren und das Headset per Bluetooth koppeln.', 'Install the “Razer Audio” app and pair the headset via Bluetooth.'), T2('Equalizer → „Anpassen“ wählen.', 'Equalizer → choose “Custom”.'), T2('Die Regler wie unten einstellen.', 'Set the sliders as shown below.')],
    appNote: () => T2('Die Einstellung bleibt im Headset und gilt dann auch am Konsolen-Dongle. Falls deine App weniger Regler zeigt, nimm je den mit der nächsten Frequenz.', 'The setting stays in the headset and then also applies on the console dongle. If your app shows fewer sliders, use the one with the nearest frequency.') },
  { id: 'cloud2', brand: 'HyperX', name: 'Cloud II / Cloud II Wireless', plat: ['ps', 'xbox'], q: 'HyperX Cloud II', kind: 'none' },
  { id: 'cloud3', brand: 'HyperX', name: 'Cloud III / Cloud III Wireless', plat: ['ps', 'xbox'], q: 'HyperX Cloud III', kind: 'none' },
  { id: 'cloudalpha', brand: 'HyperX', name: 'Cloud Alpha', plat: ['ps', 'xbox'], q: 'HyperX Cloud Alpha', kind: 'none' },
  { id: 'prox2', brand: 'Logitech', name: 'G PRO X 2 Lightspeed', plat: ['ps', 'xbox'], q: 'Logitech G PRO X 2 LIGHTSPEED', kind: 'none' },
  { id: 'gamezero', brand: 'Sennheiser / EPOS', name: 'GAME ZERO', plat: ['ps', 'xbox'], q: 'EPOS Sennheiser Game Zero', kind: 'none' },
  { id: 'iem', brand: T2('Andere', 'Other'), name: () => T2('In-Ear (IEM) am Controller', 'In-ear (IEM) on the controller'), plat: ['ps', 'xbox'], iem: 1, kind: 'none' },
  { id: 'wired', brand: T2('Andere', 'Other'), name: () => T2('Anderes Headset mit Kabel am Controller', 'Other wired headset on the controller'), plat: ['ps', 'xbox'], kind: 'none' }
];

// ---------- Konsolen-Einstellungen ----------
const C_SYSTEM = {
  ps: own => [
    own ? { k: 'ps-3d', t: T2('3D-Audio für Kopfhörer aktivieren', 'Enable 3D Audio for Headphones'), v: T2('Aus testen', 'Try off'), p: T2('Einstellungen → Ton → Audioausgabe', 'Settings → Sound → Audio Output'),
      w: T2('Dieses Spiel macht eigenen 3D-Sound. Doppelter Raumklang macht die Richtung oft ungenauer – mit Aus anfangen und vergleichen.', 'This game does its own 3D sound. Double surround often makes direction less precise – start with Off and compare.') }
    : { k: 'ps-3d', t: T2('3D-Audio für Kopfhörer aktivieren', 'Enable 3D Audio for Headphones'), v: T2('An', 'On'), p: T2('Einstellungen → Ton → Audioausgabe', 'Settings → Sound → Audio Output'),
      w: T2('Sonys Raumklang – hilft bei der Richtung. Wenn Richtungen für dich verschwimmen: Aus testen.', 'Sony’s surround – helps with direction. If directions feel blurry to you: try Off.') },
    { k: 'ps-3dp', t: T2('3D-Audio-Profil anpassen', 'Adjust 3D Audio Profile'), v: T2('Profil, das „von außen“ klingt', 'Profile that sounds “outside your head”'), p: T2('Einstellungen → Ton → Audioausgabe', 'Settings → Sound → Audio Output'),
      w: T2('Jeder Kopf ist anders. Alle 5 Profile kurz anhören, das klarste nehmen (oft 2 oder 3).', 'Every head is different. Listen to all 5 profiles briefly, pick the clearest (often 2 or 3).') },
    { k: 'ps-focus', t: T2('Audio-Fokus', 'Audio Focus'), v: T2('Leise Geräusche verstärken · Mittel', 'Boost Quiet Sounds · Medium'), p: T2('Einstellungen → Ton → Lautstärke → Audio-Fokus', 'Settings → Sound → Volume → Audio Focus'),
      w: T2('Macht leise Geräusche wie Schritte deutlicher. Alternativ „Hohe Töne verstärken“ testen. Zu stark = Rauschen wird lauter.', 'Makes quiet sounds like footsteps clearer. Alternatively try “Boost High Pitch”. Too strong = more hiss.') },
    { k: 'ps-out', t: T2('Ausgabe an Kopfhörer', 'Output to Headphones'), v: T2('Alle Töne', 'All Audio'), p: T2('Einstellungen → Ton → Audioausgabe', 'Settings → Sound → Audio Output'), w: '' },
    { k: 'ps-mono', t: T2('Mono-Audio für Kopfhörer', 'Mono Audio for Headphones'), v: T2('Aus', 'Off'), p: T2('Einstellungen → Ton → Audioausgabe', 'Settings → Sound → Audio Output'), w: T2('Mono nimmt dir die Richtung.', 'Mono removes direction.') },
    { k: 'ps-vol', t: T2('Lautstärke Kopfhörer', 'Headphone volume'), v: '70–80 %', p: T2('Kontrollzentrum → Ton', 'Control Center → Sound'), w: T2('Laut genug für Schritte, ohne dass Explosionen wehtun.', 'Loud enough for footsteps without explosions hurting.') }
  ],
  xbox: own => [
    { k: 'xb-fmt', t: T2('Kopfhörer-Format', 'Headset format'), v: own ? T2('Stereo unkomprimiert', 'Stereo uncompressed') : T2('Windows Sonic für Kopfhörer', 'Windows Sonic for Headphones'), p: T2('Einstellungen → Allgemein → Lautstärke & Audioausgabe', 'Settings → General → Volume & audio output'),
      w: own ? T2('Dieses Spiel macht eigenen 3D-Sound – zusätzlicher Raumklang der Xbox würde doppelt rechnen.', 'This game does its own 3D sound – extra Xbox surround would process it twice.') : T2('Kostenloser Raumklang von Microsoft. Dolby Atmos oder DTS gehen auch (kostenpflichtig) – nur eins davon nutzen.', 'Free surround from Microsoft. Dolby Atmos or DTS work too (paid) – use only one.') },
    { k: 'xb-chat', t: T2('Headset-Chat-Mixer', 'Headset chat mixer'), v: T2('Mehr Spiel als Chat', 'More game than chat'), p: T2('Einstellungen → Allgemein → Lautstärke & Audioausgabe', 'Settings → General → Volume & audio output'), w: '' },
    { k: 'xb-mono', t: T2('Mono-Ausgabe', 'Mono output'), v: T2('Aus', 'Off'), p: T2('Einstellungen → Barrierefreiheit → Audio', 'Settings → Accessibility → Audio'), w: T2('Mono nimmt dir die Richtung.', 'Mono removes direction.') }
  ]
};

// Spiele, Audio und Grafik je Spiel: siehe games_data.js (gemeinsam mit CAO für PC)
