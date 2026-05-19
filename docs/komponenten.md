# Church-Central: Komponenten-Übersicht

## System-Architektur

```
Benutzer → Webbrowser → React Frontend → Firebase Backend → Authentication / Firestore / Storage / Functions
```

---

## Komponenten

### 1. Benutzer
**Aufgabe:** Endbenutzer der Church-Central Anwendung.

**Warum nötig:** Benutzer sind die Stakeholder, die Veranstaltungen planen, Dokumente hochladen und Benachrichtigungen erhalten.

**Daten/Funktionen:** 
- Authentifizierung und Benutzerprofile
- Zuordnung zu Location (Court), Group (Department), Role (Position)
- Berechtigungen zur Dokumentenverwaltung
- Empfang von Benachrichtigungen

---

### 2. Webbrowser
**Aufgabe:** Clientseitige Ausführungsumgebung für das React Frontend.

**Warum nötig:** Der Browser ermöglicht Benutzern, ohne Installation auf Church-Central zuzugreifen.

**Daten/Funktionen:** 
- HTTP/HTTPS-Anfragen an Firebase
- Lokale Session-Verwaltung
- UI-Rendering
- Zwischenspeicherung (Caching)

---

### 3. Frontend mit React
**Aufgabe:** Benutzeroberfläche der Church-Central Anwendung.

**Warum nötig:** React bietet eine responsive, interaktive UI für Event-Planung und Dokumentenverwaltung.

**Daten/Funktionen:** 
- Komponenten für Event-Verwaltung
- Dokumenten-Upload/Download Interface
- Benutzer-Kategorisierung nach Location/Group/Role
- Benachrichtigungsverwaltung
- Firebase SDK Integration (Auth, Firestore, Storage)
- Echtzeit-Updates durch Firestore Listeners

---

### 4. Docker Container für das Frontend
**Aufgabe:** Containerisierung des React-Frontends für konsistente Umgebungen.

**Warum nötig:** Docker ermöglicht standardisierte Entwicklungs- und Test-Umgebungen vor dem Deployment.

**Daten/Funktionen:** 
- Node.js 20 Laufzeitumgebung
- npm-Abhängigkeiten Management
- React Build-Prozess
- Optimierter Frontend-Code

---

### 5. Firebase Backend
**Aufgabe:** Serverseitige Infrastruktur und zentrale Plattform von Church-Central.

**Warum nötig:** Firebase bietet skalierbare, serverlose Infrastruktur ohne Verwaltung von Servern, perfekt für globale Verteilung.

**Daten/Funktionen:** 
- Cloud Firestore (Datenbank)
- Authentication (Benutzeridentität)
- Cloud Storage (Dokumente/Dateien)
- Cloud Functions (Geschäftslogik)
- Firebase Hosting (Frontend-Bereitstellung)
- Echtzeit-Synchronisation

---

### 6. Firebase Authentication
**Aufgabe:** Authentifizierung und Benutzeridentitätsverwaltung.

**Warum nötig:** Sichert die Anwendung und stellt sicher, dass nur autorisierte Benutzer Daten zugreifen können.

**Daten/Funktionen:** 
- Benutzer-Registrierung und Login
- E-Mail und Passwort-Verwaltung
- Sicherheits-Token (JWT)
- Benutzer-Rollen und Berechtigungen
- Session-Verwaltung

---

### 7. Cloud Firestore
**Aufgabe:** NoSQL-Datenbank für strukturierte Daten von Church-Central.

**Warum nötig:** Speichert alle Daten: Veranstaltungen, Benutzer, Dokumente, Kategorisierung nach Location/Group/Role.

**Daten/Funktionen:** 
- Collections für Events, Benutzer, Kategorien
- Dokumente mit Feldern (Location, Group, Role, Permissions)
- Echtzeit-Listeners für Live-Updates
- Sicherheitsregeln (database.rules.json) zur Zugriffskontrolle
- Indizierung für effiziente Abfragen

---

### 8. Firebase Storage
**Aufgabe:** Dateispeicher für Dokumente, Ankündigungen und Medien.

**Warum nötig:** Ermöglicht Benutzern, Dateien (PDF, Bilder, Dokumente) hochzuladen und mit Zielgruppen zu teilen.

**Daten/Funktionen:** 
- Datei-Upload von Ankündigungen/Dokumenten
- Datei-Download für Benutzer
- Zugriffskontrolle via Sicherheitsregeln
- Speicherung von Medien (Bilder, etc.)

---

### 9. Firebase Cloud Functions
**Aufgabe:** Serverlose Funktionen für Geschäftslogik und Benachrichtigungen.

**Warum nötig:** Führt sicherheitskritische Operationen aus: Benachrichtigungen, Datensicherung, automatisierte Prozesse.

**Daten/Funktionen:** 
- Benachrichtigungslogik (Targeting nach Location/Group/Role)
- Datenvalidierung
- Automatisierte Events
- E-Mail/Push-Benachrichtigungen
- Audit-Logging

---

### 10. GitLab Repository
**Aufgabe:** Versionskontrolle und Zusammenarbeit.

**Warum nötig:** Speichert den Code, ermöglicht Verzweigungen, Code-Reviews und Zusammenarbeit zwischen Entwicklern.

**Daten/Funktionen:** 
- Git-Versioning (Commits, Branches, Tags)
- Feature-Branches (z.B. feature/ap5-ap9-church-central)
- Merge Requests für Code-Reviews
- Commit-Historie und Accountability

---

### 11. GitLab CI/CD Pipeline
**Aufgabe:** Automatisierte Build-, Test- und Deployment-Prozesse.

**Warum nötig:** Automatisiert die Bereitstellung, sichert Codequalität und reduziert manuelle Fehler.

**Daten/Funktionen:** 
- Automatisches Bauen (npm ci, npm run build)
- Artifact-Speicherung
- Deployment zu Firebase Hosting
- Logs und Monitoring
- Nur auf main-Branch Deployment

---

### 12. Firebase Hosting
**Aufgabe:** Produktiv-Umgebung für das React Frontend.

**Warum nötig:** Hostet das Frontend mit weltweiter CDN, automatischen SSL-Zertifikaten und hoher Verfügbarkeit.

**Daten/Funktionen:** 
- HTTPS-Zugriff für alle Benutzer weltweit
- CDN-Caching für schnelle Ladezeiten
- Automatische SSL/TLS-Zertifikate
- Zero-Downtime Deployments
- Analytics und Monitoring

---

## Datenfluss in Church-Central

1. **Benutzer** öffnet Church-Central im **Webbrowser**
2. **Browser** lädt das React Frontend von **Firebase Hosting**
3. **Frontend** authentifiziert den Benutzer via **Firebase Authentication**
4. **Frontend** zeigt Daten aus **Cloud Firestore** (Events, Ankündigungen für die Zielgruppe)
5. **Benutzer** ladet Dokumente hochladungen via **Firebase Storage**
6. **Cloud Functions** verarbeitet Benachrichtigungen basierend auf Location/Group/Role
7. **GitLab Repository** speichert den Code
8. **GitLab CI/CD Pipeline** baut automatisch und deployt zu **Firebase Hosting** auf main-Branch

---

## Sicherheitskonzept

- **Firestore Security Rules**: Kontrolle durch database.rules.json
- **Firebase Authentication**: Nur authentifizierte Benutzer
- **Role-Based Access Control**: Zugriff basierend auf Location, Group, Role
- **Cloud Functions**: Validierung und Autorisierung auf Backend-Seite
- **HTTPS**: Verschlüsselte Kommunikation

---

## Skalierbarkeit

- **Firebase Firestore**: Automatische Skalierung für globale Nutzung
- **Firebase Storage**: Unbegrenzte Speicherkapazität
- **Firebase Hosting**: Weltweite CDN für schnelle Zugriffe
- **Cloud Functions**: Automatische Skalierung bei hohem Aufkommen
- **Docker**: Für konsistente und wiederholbare Builds
