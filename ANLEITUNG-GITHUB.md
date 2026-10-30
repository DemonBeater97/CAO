# CAO auf GitHub – Anleitung

Oct 29, 2026 · @Maik

In sechs Schritten liegen Webseite, PC-Programm, CAO Konsole und die Android-App auf deinem GitHub-Konto DemonBeater97 – die Webseite ist danach unter demonbeater97.github.io/CAO erreichbar.

## Was du brauchst

Zwei Dateien aus dem Chat reichen, alles andere baut GitHub selbst.

| Datei | Was ist das? | Wohin? |
| --- | --- | --- |
| CAO-GitHub-Repository.zip | Webseite, CAO Konsole, Videos, APK-Bauplan, Lizenz und KI-Sperre (38 Dateien) – **ohne** PC-Quellcode | Entpacken, Inhalt ins Repository hochladen (Schritt 2) |
| CAO-Setup.exe | Das PC-Programm v0.7.1 (ca. 80 MB) | An die Veröffentlichung hängen (Schritt 4) – genau dieser Name, sonst geht der Download-Knopf nicht |
| CAO-Konsole.apk | Die Android-App | Baut GitHub automatisch (Schritt 5) |

## Schritt 1: Repository „CAO“ anlegen

Der Name muss genau **CAO** heißen, weil die Webseite und alle Download-Links darauf zeigen.

1. Auf github.com anmelden, oben rechts auf **„+“** → **„New repository“**.
2. Repository name: **CAO**
3. **Public** wählen (die kostenlose Webseite geht nur bei öffentlichen Repositories).
4. **Kein** Haken bei „Add a README file“ – die README ist schon in der ZIP-Datei.
5. **„Create repository“** klicken.

## Schritt 2: Dateien hochladen

Alle 38 Dateien passen in einen Upload; keine ist größer als 25 MB.

1. **CAO-GitHub-Repository.zip** auf dem PC entpacken (Rechtsklick → „Alle extrahieren“).
2. Im neuen, leeren Repository auf den Link **„uploading an existing file“** klicken.
3. Den entpackten Ordner öffnen, **alles darin markieren** (Strg+A) und ins Browserfenster ziehen – den **Inhalt**, nicht den Ordner selbst. Wichtig: der Ordner **.github** und die Datei **.nojekyll** müssen mit dabei sein.
4. Unten **„Commit changes“** klicken und warten, bis alles hochgeladen ist.
5. Kontrolle: Im Repository müssen jetzt u. a. `index.html`, `konsole`, `media`, `app-android`, `LICENSE`, `robots.txt` und `.github` stehen.

Fehlt `.github`: **„Add file“ → „Create new file“**, als Namen `.github/workflows/apk.yml` eintippen, den Inhalt der gleichnamigen Datei aus der ZIP hineinkopieren und speichern.

## Schritt 3: Webseite einschalten

Danach ist die Seite unter **demonbeater97.github.io/CAO** erreichbar.

1. Im Repository oben auf **„Settings“** (Einstellungen).
2. Links **„Pages“** wählen.
3. Bei „Source“: **„Deploy from a branch“**.
4. Bei „Branch“: **main** und **/ (root)** wählen → **„Save“**.
5. 1–2 Minuten warten, Seite neu laden: oben erscheint „Your site is live at …“.

Die Download-Knöpfe gehen erst nach Schritt 4 und 5 – vorher zeigen sie ins Leere.

## Schritt 4: Veröffentlichung mit dem PC-Programm

Eine „Veröffentlichung“ (bei GitHub: Release) ist der Ort für große Download-Dateien – die 80 MB des PC-Programms passen nicht ins normale Hochladen.

1. Im Repository rechts auf **„Releases“** → **„Create a new release“**.
2. **„Choose a tag“** → `v0.7.1` eintippen → **„Create new tag“**.
3. Titel: **CAO v0.7.1**. Beschreibung zum Beispiel: „PC-Programm + CAO Konsole – jetzt mit Battlefield 6, Rainbow Six, ARC Raiders und mehr“.
4. Die Datei **CAO-Setup.exe** in das Feld **„Attach binaries“** ziehen. Der Name muss genau so bleiben.
5. **Kein** Haken bei „Set as a pre-release“.
6. **„Publish release“** klicken.

Das Veröffentlichen startet automatisch auch Schritt 5.

## Schritt 5: Android-App (APK) bauen lassen

GitHub baut die APK selbst und hängt sie als **CAO-Konsole.apk** an die Veröffentlichung – das dauert etwa 5–10 Minuten.

1. Oben im Repository auf **„Actions“**. Fragt GitHub, ob Abläufe erlaubt sind: **„I understand my workflows, go ahead and enable them“**.
2. Links **„APK bauen“** wählen. Läuft dort schon ein Durchgang (gelber Punkt), einfach warten.
3. Läuft nichts: rechts **„Run workflow“** → **„Run workflow“**.
4. Grüner Haken = fertig. In der Veröffentlichung v0.7.1 steht jetzt zusätzlich **CAO-Konsole.apk**.

Roter Haken: in den Lauf klicken und mir einen Screenshot der roten Zeile schicken. Häufigste Ursache: **Settings → Actions → General → „Workflow permissions“** auf **„Read and write permissions“** stellen und den Lauf mit **„Re-run jobs“** wiederholen.

## Schritt 6: Alles prüfen – und später aktualisieren

**Prüfen:**

- [ ] Am PC demonbeater97.github.io/CAO öffnen → die PC-Karte ist markiert, „Für Windows herunterladen“ lädt CAO-Setup.exe.
- [ ] Am Handy (Android) dieselbe Seite → die Android-Karte steht oben, „APK herunterladen“ lädt die App.
- [ ] Am iPhone in Safari → „CAO Konsole öffnen“ → Teilen → „Zum Home-Bildschirm“.
- [ ] Oben DE/EN umschalten → Text und Video wechseln die Sprache.
- [ ] Unter „Videos“ laufen alle vier (PC und Konsole, je Deutsch und Englisch).

**Später aktualisieren:**

| Was ist neu? | Was tust du? |
| --- | --- |
| Neues PC-Programm | Neue Veröffentlichung (z. B. v0.8.0) mit der neuen Datei, wieder **CAO-Setup.exe** genannt. Die APK wird automatisch angehängt. |
| Änderung an CAO Konsole | Geänderte Dateien im Ordner `konsole` hochladen (gleiche Namen ersetzen). Die APK wird automatisch neu gebaut und an die neueste Veröffentlichung gehängt. |
| Webseite oder Videos | Geänderte Datei im Repository ersetzen – die Seite ist nach 1–2 Minuten aktuell. |

Den Link für deine TikTok- und Twitch-Bio: **demonbeater97.github.io/CAO**

## Schutz vor Kopieren und KI

Drei Ebenen schützen deine Arbeit:

- **LICENSE** – „Alle Rechte vorbehalten“: Herunterladen und privat benutzen ist erlaubt, kopieren, nachbauen, neu hochladen oder für KI-Training verwenden nicht. Mit ausdrücklichem Nutzungsvorbehalt nach § 44b UrhG und EU-Richtlinie 2019/790.
- **robots.txt, ai.txt und noai-Markierung** in der Webseite – sagt den KI-Sammlern (OpenAI, Google, Anthropic, Apple, Meta, Perplexity, Common Crawl usw.): nicht einsammeln. Seriöse Firmen halten sich daran, Betrüger nicht – dafür ist die Lizenz da.
- **Der PC-Quellcode bleibt privat** – er ist nur in deiner Sicherung (CAO-Sicherung-komplett.zip), nicht auf GitHub. Öffentlich ist nur das fertige Setup.

Hinweis: Suchmaschinen lesen eine robots.txt eigentlich nur ganz oben auf der Adresse (demonbeater97.github.io/robots.txt). Wer das will, legt zusätzlich ein Repository namens **DemonBeater97.github.io** an und lädt dort nur die robots.txt hoch. Die noai-Markierung in der Seite wirkt auch ohne das.

Findest du deine Arbeit irgendwo kopiert: Bei GitHub über „Report content“ → Urheberrecht (DMCA) melden, mit Link auf dein Repository und die LICENSE.

## Falls etwas nicht klappt

| Problem | Lösung |
| --- | --- |
| Seite zeigt „404“ | Schritt 3 prüfen (Branch main, / (root)), 2 Minuten warten. Das Repository muss **CAO** heißen. |
| Download-Knopf zeigt „Not Found“ | Veröffentlichung fehlt, ist „pre-release“, oder die Datei heißt nicht genau **CAO-Setup.exe** bzw. **CAO-Konsole.apk**. |
| APK fehlt in der Veröffentlichung | Schritt 5 – unter „Actions“ nachsehen; roter Haken → Screenshot an Claude. |
| Android blockiert die APK | Beim Öffnen „Unbekannte Apps installieren“ für den Browser erlauben. Die App ist nicht aus dem Play Store, daher fragt Android einmal nach. |
| Windows warnt beim Setup | Normal ohne Signatur: „Weitere Informationen“ → „Trotzdem ausführen“. |
| iPhone: kein „Zum Home-Bildschirm“ | Die Seite in **Safari** öffnen (nicht in der TikTok- oder Instagram-App). |

Wichtig für spätere Änderungen mit Claude: Die neueste ZIP-Datei oder den Link zum Repository in den neuen Chat geben – dann geht es genau dort weiter.
