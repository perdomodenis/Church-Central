# GitLab CI/CD Pipeline für Church-Central

## Übersicht

Die GitLab CI/CD Pipeline ist der automatisierte Prozess, der den Code von Church-Central baut und zur Produktionsumgebung (Firebase Hosting) deployt. Die Pipeline läuft automatisch, wenn Code in das GitLab Repository gepusht wird.

---

## Pipeline-Stages

### 1. **install** - Abhängigkeiten installieren
**Was passiert:**
- Die Node.js Umgebung wird vorbereitet
- `npm ci` (Clean Install) lädt alle npm-Abhängigkeiten herunter und speichert sie

**Warum nötig:**
- Das React Projekt benötigt externe Bibliotheken (React, Firebase SDK, etc.)
- `npm ci` ist sicherer als `npm install`, da es exakte Versionen aus package-lock.json verwendet
- Die Abhängigkeiten werden als "Artifacts" zwischengespeichert, damit die nächste Stage sie nicht erneut herunterladen muss

**Dauer:** 1-2 Minuten (abhängig von Anzahl der Abhängigkeiten)

---

### 2. **build** - React Anwendung bauen
**Was passiert:**
- `npm run build` kompiliert den React-Code zu optimiertem JavaScript und HTML
- Die optimierte Version wird im `build/` Ordner gespeichert

**Warum nötig:**
- React-Code muss in produktives, optimiertes JavaScript verwandelt werden
- Dieser Prozess minimiert Code, entfernt ungenutzte Teile und optimiert Dateigröße
- Erst danach kann das Frontend zu Firebase Hosting hochgeladen werden

**Dauer:** 2-5 Minuten (abhängig von Projektgröße)

---

### 3. **deploy** - Zu Firebase Hosting deployen
**Was passiert:**
- Firebase CLI wird installiert
- Der optimierte Build-Code wird zu Firebase Hosting hochgeladen
- Nur auf dem **main-Branch** läuft dieser automatisch
- Andere Branches können manuell deployed werden (z.B. develop Branch)

**Warum nötig:**
- Stellt sicher, dass nur getesteter Code von main zu Produktiv geht
- Automatisiert den Deployment-Prozess und eliminiert manuelle Fehler
- Benutzer können sofort die neueste Version nutzen

**Dauer:** 1-2 Minuten

---

## GitLab Variable: FIREBASE_TOKEN

### Was ist FIREBASE_TOKEN?

Ein **FIREBASE_TOKEN** ist ein Authentifizierungstoken, den Firebase generiert. Damit kann die GitLab Pipeline ohne interaktive Anmeldung auf das Firebase Projekt zugreifen.

### Warum wird FIREBASE_TOKEN gespeichert?

1. **Automatisierung:** Die Pipeline braucht Zugriff auf Firebase, ohne dass ein Mensch manuell authentifiziert
2. **Sicherheit:** Der Token wird nicht im Code gespeichert, sondern sicher in GitLab verwahrt
3. **Separation of Concerns:** Der Token gehört in ein Secret-Management-System, nicht in den Quellcode

### Wie man FIREBASE_TOKEN einrichtet

**Schritt 1: Firebase CI Token generieren**

Im Terminal lokal ausführen:

```bash
firebase login:ci
```

Dieser Befehl öffnet einen Browser, in dem Sie sich bei Firebase anmelden. Nach erfolgreicher Anmeldung wird ein Token generiert und angezeigt.

**Schritt 2: Token kopieren**

Den angezeigten Token kopieren (ca. 600+ Zeichen langer String).

**Schritt 3: Token in GitLab eintragen**

1. Zum GitLab Projekt navigieren
2. Menü öffnen: **Settings** → **CI/CD**
3. Auf **Variables** klicken
4. Button **Add variable** klicken
5. Folgende Werte eintragen:

| Feld | Wert |
|------|------|
| **Key** | `FIREBASE_TOKEN` |
| **Value** | [Den kopierten Token einfügen] |
| **Masked** | ✅ Ja (Token wird in Logs nicht angezeigt) |
| **Protected** | ❌ Nein (auch Feature-Branches können deployen) |

**Schritt 4: Speichern**

Auf **Add variable** klicken. Die Variable ist nun gespeichert und kann von der Pipeline verwendet werden.

---

## Pipeline-Ablauf

```
Code wird gepusht zu GitLab
        ↓
GitLab erkennt neue Commits
        ↓
Pipeline startet automatisch
        ↓
├─→ Stage 1: install
│   └─→ npm ci
│       └─→ Abhängigkeiten installt ✅
│
├─→ Stage 2: build
│   └─→ npm run build
│       └─→ React-Code kompiliert ✅
│
└─→ Stage 3: deploy (nur auf main-Branch)
    └─→ firebase deploy --token=$FIREBASE_TOKEN
        └─→ Code zu Firebase Hosting hochgeladen ✅
```

---

## Branch-Strategie

### main-Branch (Produktion)
- **Automatischer Deployment:** Jeder Push zu main deployt automatisch zu Firebase Hosting
- **Zielgruppe:** Live-Benutzer von Church-Central

### develop-Branch (Staging/Testing)
- **Manueller Deployment:** Deployment muss manuell in GitLab Pipeline ausgelöst werden
- **Zielgruppe:** Testing vor Production

### feature-Branches (z.B. feature/ap5-ap9-church-central)
- **Kein Deployment:** Feature-Branches deployen nicht automatisch
- **Zielgruppe:** Entwicklung und Testing vor Merge in develop/main

---

## Pipeline-Logs und Debugging

Um die Pipeline zu beobachten:

1. GitLab Projekt öffnen
2. **Build** → **Pipelines** klicken
3. Die aktuelle Pipeline auswählen
4. Jede Stage anklicken um Logs zu sehen

**Häufige Fehler:**

| Fehler | Ursache | Lösung |
|--------|--------|--------|
| `npm ci` schlägt fehl | package-lock.json ist veraltet | `npm ci` lokal ausführen und neu committen |
| `npm run build` schlägt fehl | Code-Fehler oder fehlende Abhängigkeit | Lokal testen: `npm run build` |
| `firebase deploy` schlägt fehl | Ungültiger FIREBASE_TOKEN | FIREBASE_TOKEN neu generieren und aktualisieren |
| Deploy läuft nicht auf main | main-Branch ist nicht aktiviert | In `.gitlab-ci.yml` prüfen, dass `only: - main` gesetzt ist |

---

## Firebase Projekt-Konfiguration

Die Pipeline deployt zu diesem Firebase Projekt:

- **Projekt-ID:** `church-central-992a7`
- **Konfiguration:** `.firebaserc`
- **Hosting:** Firebase Hosting

---

## Environment-Variablen in der Pipeline

```yaml
NODE_VERSION: "20"  # Node.js Version 20
```

---

## Wichtige Hinweise

### 1. Branch-Name
Falls die Hauptbranch in diesem Repository **"master"** heißt statt "main", bitte in `.gitlab-ci.yml` ändern:

```yaml
only:
  - master  # statt: - main
```

### 2. Build-Ordner
Der Pipeline sucht nach einem `build/` Ordner. Stelle sicher, dass `npm run build` diese Verzeichnis erstellt. Überprüfe in `package.json`:

```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

### 3. Firebase Projekt-ID
Die Pipeline nutzt `church-central-992a7`. Falls sich die Projekt-ID ändert, bitte aktualisieren in:
- `.gitlab-ci.yml` (Zeile mit `--project=church-central-992a7`)
- `.firebaserc`

### 4. Zeitpunkt des Deployments
Die Pipeline läuft:
- ✅ Automatisch beim Push zu main
- ✅ Automatisch bei Merge Request zu main
- ❌ Nicht bei Push zu anderen Branches (außer manueller Auslösung für develop)

---

## Zukünftige Verbesserungen

1. **Unit Tests hinzufügen:** `npm run test` vor dem Build
2. **Linting:** Code-Qualitätsprüfung mit ESLint
3. **Performance:** Build-Zeit optimieren
4. **Preview Deployments:** Automatische Vorschau für Feature-Branches
5. **Notifications:** Slack/E-Mail Benachrichtigungen bei Deployment-Erfolg/Fehler
