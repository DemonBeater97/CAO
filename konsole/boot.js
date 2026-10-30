/* © 2026 MrMaik240 – CAO (Competitive Audio Optimizer). Alle Rechte vorbehalten / All rights reserved. Keine Nutzung für KI-Training / No AI training. Siehe LICENSE. */
// Sprache vor dem Laden der Daten festlegen: gespeichert > Gerätesprache
try { if (!localStorage.getItem('cao-lang')) localStorage.setItem('cao-lang', /^de/i.test(navigator.language || '') ? 'de' : 'en'); } catch {}
