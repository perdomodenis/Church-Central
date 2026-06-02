# Church-Central
The app simplifies and centralizes event planning and information sharing. Users upload documents or announcements, notifying specific target groups. Users are organized by Location (Court), Group (Department), and Role (Position). It is entirely web-based, allowing anyone to use it without direct installation.

---

**Date:** April 2, 2026

## Purpose and Vision
To improve the flow of information within churches.

## Scope
The app aims to simplify and centralize event planning and information distribution. Users can upload documents or announcements, which then reach and notify predetermined users. 

Users are categorized by:
* **Location** (Court)
* **Groups** (Department)
* **Roles** (Position)

The application is **entirely web-based**, allowing for use without direct installation.

## Feasibility & Resources
* **Feasibility:** Highly feasible from a technical standpoint, as all necessary resources are available for free.
* **Budget:** Completely free of charge.
* **Resources:** 3 Developers

---

## Milestone Plan

### Phase 1: Planning & Design
* **Milestone 1: Project Plan & Scope Definition**
    * *Result:* Final target catalog and coordinated requirements.
* **Milestone 2: Software Design Document (SDD) & Wireframes**
    * *Result:* Determination of the 3-Tier architecture and Low-Fidelity UI sketches.

### Phase 2: Backend & Core Logic (Implementation – Logic Layer)
* **Milestone 3: Development Environment & Repository**
    * *Result:* Git repository initialized; cloud infrastructure for the Database (Data Access Layer) provided.
* **Milestone 4: Database Schema & Access Layer**
    * *Result:* Database is operational; basic functions for saving and retrieving documents work.
* **[ ] Milestone 5 (Day 14): Core Logic & User Categorization**
    * *Result:* Logic for locations, groups, and roles is stably implemented in the backend.

### Phase 3: Frontend & Interaction (Implementation – Presentation Layer)
* **[ ] Milestone 6 (Day 18): User Interface & Document Upload**
    * *Result:* Users can upload announcements; Frontend communicates successfully with the Backend.
* **[ ] Milestone 7 (Day 21): Notification System & Role Verification**
    * *Result:* App notifies predetermined user groups based on their roles.

### Phase 4: QA & Deployment (Test & Rollout)
* **[ ] Milestone 8 (Day 25): System Tests & Bug Fixing**
    * *Result:* Integration tests completed based on the test pyramid; critical bugs resolved.
* **[ ] Milestone 9 (Day 28): MVP Deployment & Go-Live**
    * *Result:* Web application is live in the cloud environment and accessible to users.
* **[ ] Milestone 10 (Day 30): Project Closure & Lessons Learned**
    * *Result:* Short retrospective conducted to improve processes for future sprints.

---

## Risks
* High volume of simultaneous notifications.
* Data privacy (Datenschutz).
* Authentication (Authentifizierung).

---

## 🚀 Installations- und Setup-Anleitung (Hands-off)

Diese Anleitung beschreibt, wie Sie das komplette System (Frontend & Backend) manuell oder vollautomatisch mittels Docker Compose in Betrieb nehmen können.

### 📋 Voraussetzungen
Stellen Sie sicher, dass folgende Software auf Ihrem System installiert ist:
* **Docker & Docker Compose** (Empfohlen für vollautomatisches Setup)
* **Node.js (v18+)** und **npm** (Für lokales manuelles Setup)
* **Git** (Zum Klonen des Repositories)

---

### 🐳 Option A: Vollautomatisches Setup mit Docker Compose (Empfohlen)

Mit Docker Compose können Sie das gesamte System (React Frontend, Express Backend und lokale Services) mit einem einzigen Befehl starten, ohne vorher Abhängigkeiten installieren zu müssen:

1. **Repository klonen:**
   ```bash
   git clone https://github.com/perdomodenis/Church-Central.git
   cd Church-Central
   ```

2. **Container bauen und starten:**
   Führen Sie im Stammverzeichnis (wo sich `docker-compose.yml` befindet) folgenden Befehl aus:
   ```bash
   docker-compose up --build
   ```

3. **Applikation aufrufen:**
   * **Frontend:** Öffnen Sie [http://localhost:3000](http://localhost:3000) im Browser.
   * **Backend-API:** Erreichbar unter [http://localhost:5000](http://localhost:5000).

4. **Container stoppen:**
   ```bash
   docker-compose down
   ```

---

### 💻 Option B: Lokales manuelles Setup (Entwicklungsmodus)

Falls Sie die Applikation direkt auf Ihrem Host-System ausführen möchten:

1. **Repository klonen:**
   ```bash
   git clone https://github.com/perdomodenis/Church-Central.git
   cd Church-Central
   ```

2. **Alle Abhängigkeiten installieren (Monorepo-Befehl):**
   ```bash
   npm run install:all
   ```
   *(Dieser Befehl installiert die npm-Pakete im Root sowie in den Unterordnern `frontend/` und `backend/`).*

3. **Applikation starten:**
   Starten Sie Frontend und Backend gleichzeitig über das Root-Verzeichnis:
   ```bash
   npm start
   ```
   *(Dieser Befehl nutzt `concurrently` und startet das Frontend auf Port `3000` sowie den Backend-Server im Entwicklungsmodus).*

---

### 🔑 Test-Benutzerdaten (Credentials)

Für die manuelle Bewertung können Sie sich mit folgendem Standard-Testbenutzer in der App anmelden:

* **E-Mail-Adresse:** `test@test.ch`
* **Passwort:** `test123`

---

### 🧪 Ausführen der Test-Suites

* **Frontend-Tests ausführen:**
  ```bash
  cd frontend
  npm test -- --watchAll=false
  ```
* **Backend-Tests ausführen:**
  ```bash
  cd backend
  npm test
  ```
* **Cypress E2E-Tests starten (Frontend muss laufen):**
  ```bash
  cd frontend
  npx cypress open
  ```

