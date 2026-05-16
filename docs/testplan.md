# Church-Central: Testplan

**Datum:** Mai 2026  
**Projekt:** Church-Central  
**Version:** 1.0  

---

## 1. Überblick

Der Testplan beschreibt die Test-Strategie für Church-Central mit Fokus auf:
- ✅ **Frontend-Tests** (React Komponenten, UI-Tests)
- ✅ **Backend-Tests** (Firebase Functions, Firestore Rules)
- ✅ **Integration-Tests** (Frontend + Firebase zusammen)

### Test-Szenarien

1. Event-Planung
2. Benutzer-Authentifizierung
3. Benachrichtigungssystem
4. Dokumenten-Upload/Download
5. Berechtigungen nach Location/Group/Role

---

## 2. Test-Strategie

### Test-Pyramide für Church-Central

```
           🔴 E2E-Tests (5%)
          [Integration-Tests]
         
        🟡 Backend-Tests (25%)
       [Cloud Functions, Firestore]
      
    🟢 Frontend-Tests (70%)
   [Unit Tests, Component Tests, UI Tests]
```

### Test-Tools & Frameworks

| Ebene | Tool | Framework | Zweck |
|-------|------|-----------|-------|
| **Frontend** | Jest + React Testing Library | React | Unit & Component Tests |
| **Frontend** | Cypress / Playwright | Selenium | E2E & UI Tests |
| **Backend** | Firebase Emulator Suite | Jest | Cloud Functions & Firestore Tests |
| **Integration** | Cypress + Firebase Emulator | JavaScript | Full-Stack Tests |

---

## 3. Frontend-Tests

### 3.1 Unit Tests (React Komponenten)

**Ziel:** Teste einzelne React-Komponenten isoliert.

**Tools:** Jest + React Testing Library

**Test-Dateien:**
```
src/components/__tests__/
├── EventForm.test.js
├── EventList.test.js
├── DocumentUpload.test.js
├── UserProfile.test.js
├── PermissionMatrix.test.js
└── NotificationBell.test.js
```

#### Test-Szenarien für Event-Planung

**Test 1.1: Event erstellen**
```javascript
// src/components/__tests__/EventForm.test.js
describe('EventForm Component', () => {
  test('soll ein neues Event mit Titel und Datum erstellen', () => {
    // 1. EventForm rendern
    // 2. Titel eingeben: "Kirchenchor Probe"
    // 3. Datum eingeben: "2026-05-20"
    // 4. Zielgruppe wählen: "Location: Zürich, Group: Musik, Role: Member"
    // 5. Submit klicken
    // 6. Assertion: Event wird in der Liste angezeigt
  });

  test('soll Validierungsfehler zeigen bei leerem Titel', () => {
    // 1. EventForm rendern
    // 2. Datum eingeben
    // 3. Submit klicken (ohne Titel)
    // 4. Assertion: Error Message "Titel ist erforderlich"
  });

  test('soll Zielgruppe nach Location filtern', () => {
    // 1. EventForm öffnen
    // 2. Location dropdown ändern
    // 3. Assertion: Nur Gruppen dieser Location angezeigt
  });
});
```

**Test 1.2: Event bearbeiten**
```javascript
test('soll Event bearbeiten und Änderungen speichern', () => {
  // 1. Bestehendes Event laden
  // 2. Titel von "Probe" zu "Probe (verschoben)" ändern
  // 3. Datum aktualisieren
  // 4. Speichern klicken
  // 5. Assertion: Änderungen sind persistent
});
```

**Test 1.3: Event löschen**
```javascript
test('soll Event mit Bestätigung löschen', () => {
  // 1. Event laden
  // 2. Delete-Button klicken
  // 3. Bestätigungsdialog annehmem ("Ja, löschen")
  // 4. Assertion: Event ist weg
});
```

#### Test-Szenarien für Benutzer-Authentifizierung

**Test 2.1: Benutzer Registration**
```javascript
// src/components/__tests__/RegisterForm.test.js
describe('RegisterForm Component', () => {
  test('soll neuen Benutzer registrieren', () => {
    // 1. RegisterForm rendern
    // 2. E-Mail eingeben: "user@example.com"
    // 3. Passwort eingeben: "SecurePass123!"
    // 4. Benutzer-Rolle wählen: "Member"
    // 5. Location wählen: "Zürich"
    // 6. Register klicken
    // 7. Assertion: Benutzer erfolgreich registriert
  });

  test('soll Passwort-Validierung durchführen', () => {
    // 1. Passwort eingeben: "123" (zu kurz)
    // 2. Assertion: Error "Passwort muss mindestens 8 Zeichen sein"
  });

  test('soll E-Mail-Format validieren', () => {
    // 1. E-Mail eingeben: "invalid-email"
    // 2. Assertion: Error "Ungültige E-Mail Adresse"
  });
});
```

**Test 2.2: Benutzer Login**
```javascript
// src/components/__tests__/LoginForm.test.js
describe('LoginForm Component', () => {
  test('soll Benutzer mit korrekten Credentials einloggen', () => {
    // 1. LoginForm rendern
    // 2. E-Mail: "user@example.com"
    // 3. Passwort: "SecurePass123!"
    // 4. Login klicken
    // 5. Assertion: Benutzer eingeloggt, Dashboard sichtbar
  });

  test('soll Error zeigen bei falschen Credentials', () => {
    // 1. LoginForm rendern
    // 2. Falsches Passwort eingeben
    // 3. Login klicken
    // 4. Assertion: Error "E-Mail oder Passwort ungültig"
  });

  test('soll Benutzer logout ermöglichen', () => {
    // 1. Benutzer eingeloggt (Setup)
    // 2. Logout Button klicken
    // 3. Assertion: Benutzer auf Login-Seite
  });
});
```

#### Test-Szenarien für Dokumenten-Upload/Download

**Test 3.1: Datei hochladen**
```javascript
// src/components/__tests__/DocumentUpload.test.js
describe('DocumentUpload Component', () => {
  test('soll PDF hochladen', () => {
    // 1. DocumentUpload rendern
    // 2. PDF-Datei auswählen (z.B. "announcement.pdf", 2MB)
    // 3. Zielgruppe wählen: "Location: Basel, Role: Leader"
    // 4. Upload klicken
    // 5. Assertion: "Upload erfolgreich" Message
    // 6. Assertion: Datei in der Dokumentenliste
  });

  test('soll Dateigrößen-Validierung durchführen', () => {
    // 1. Datei > 50MB auswählen
    // 2. Upload klicken
    // 3. Assertion: Error "Datei zu groß (Max. 50MB)"
  });

  test('soll nur erlaubte Dateitypen akzeptieren', () => {
    // 1. .exe Datei auswählen
    // 2. Upload klicken
    // 3. Assertion: Error "Nur PDF, DOC, XLS, JPG erlaubt"
  });

  test('soll Upload-Fortschritt anzeigen', () => {
    // 1. Große Datei (10MB) hochladen
    // 2. Assertion: Progress-Bar zeigt 0-100%
    // 3. Assertion: "Upload complete" nach Abschluss
  });
});
```

**Test 3.2: Datei herunterladen**
```javascript
test('soll Datei herunterladen', () => {
  // 1. Dokument in Liste anzeigen
  // 2. Download-Button klicken
  // 3. Assertion: Datei wird heruntergeladen
  // 4. Assertion: Dateiname ist korrekt
  // 5. Assertion: Dateiinhalt ist intakt
});
```

#### Test-Szenarien für Berechtigungen nach Location/Group/Role

**Test 4.1: Permission Matrix**
```javascript
// src/components/__tests__/PermissionMatrix.test.js
describe('Permission System', () => {
  test('soll Events nur für User-Location anzeigen', () => {
    // Setup: Benutzer mit Location="Zürich"
    // 1. Dashboard öffnen
    // 2. Assertion: Nur Events für Zürich sichtbar
    // 3. Assertion: Events für Basel sind nicht sichtbar
  });

  test('soll Dokumenten-Zugriff nach Group kontrollieren', () => {
    // Setup: Benutzer mit Group="Leadership"
    // 1. Dokumente laden
    // 2. Assertion: Nur "Leadership" Dokumente sichtbar
    // 3. Assertion: "Education" Dokumente blockiert
  });

  test('soll Funktionen nach Role limitieren', () => {
    // Setup: Benutzer mit Role="Member"
    // 1. Dashboard öffnen
    // 2. Assertion: "Create Event" Button disabled
    // 3. Assertion: "View Reports" nicht sichtbar
    
    // Setup: Benutzer mit Role="Admin"
    // 1. Dashboard öffnen
    // 2. Assertion: "Create Event" Button enabled
    // 3. Assertion: "View Reports" sichtbar
  });
});
```

---

## 4. Backend-Tests

### 4.1 Cloud Functions Tests

**Ziel:** Teste Cloud Functions isoliert mit Firebase Emulator Suite.

**Tools:** Jest + Firebase Admin SDK

**Test-Dateien:**
```
functions/tests/
├── createEvent.test.js
├── notifyUsers.test.js
├── uploadDocument.test.js
└── validatePermissions.test.js
```

#### Test-Szenarien für Event-Planung

**Test 1.1: Event in Firestore erstellen**
```javascript
// functions/tests/createEvent.test.js
describe('Cloud Function: createEvent', () => {
  test('soll Event in Firestore speichern', async () => {
    const eventData = {
      title: "Kirchenchor Probe",
      date: "2026-05-20",
      location: "Zürich",
      targetGroup: { location: "Zürich", group: "Musik", role: "Member" }
    };
    
    const result = await createEvent(eventData);
    
    // Assertions
    expect(result.success).toBe(true);
    expect(result.eventId).toBeDefined();
    
    // Verifiziere in Firestore
    const doc = await db.collection('events').doc(result.eventId).get();
    expect(doc.exists).toBe(true);
    expect(doc.data().title).toBe("Kirchenchor Probe");
  });

  test('soll Timestamp automatisch setzen', async () => {
    const result = await createEvent(eventData);
    const doc = await db.collection('events').doc(result.eventId).get();
    
    expect(doc.data().createdAt).toBeDefined();
    expect(doc.data().createdAt).toBeInstanceOf(Timestamp);
  });

  test('soll Error werfen bei ungültigen Daten', async () => {
    const invalidData = { title: "" }; // title erforderlich
    
    expect(async () => {
      await createEvent(invalidData);
    }).rejects.toThrow("Titel ist erforderlich");
  });
});
```

#### Test-Szenarien für Benachrichtigungssystem

**Test 2.1: Benachrichtigungen an Zielgruppe versenden**
```javascript
// functions/tests/notifyUsers.test.js
describe('Cloud Function: notifyUsers', () => {
  test('soll Email an alle Benutzer der Zielgruppe versenden', async () => {
    const notification = {
      title: "Neue Ankündigung",
      message: "Kirchenrat-Sitzung morgen um 19:00",
      targetGroup: { location: "Zürich", group: "Leadership", role: "Admin" }
    };
    
    const result = await notifyUsers(notification);
    
    // Assertions
    expect(result.sent).toBeGreaterThan(0);
    expect(result.failed).toBe(0);
    
    // Verifiziere, dass Emails an korrekte Empfänger
    const users = await db.collection('users')
      .where('location', '==', 'Zürich')
      .where('group', '==', 'Leadership')
      .where('role', '==', 'Admin')
      .get();
    
    expect(result.sent).toBe(users.size);
  });

  test('soll Benachrichtigung in History speichern', async () => {
    const result = await notifyUsers(notification);
    
    const history = await db.collection('notifications')
      .doc(result.notificationId)
      .get();
    
    expect(history.exists).toBe(true);
    expect(history.data().status).toBe('sent');
  });
});
```

#### Test-Szenarien für Berechtigungen

**Test 3.1: Permission Validation**
```javascript
// functions/tests/validatePermissions.test.js
describe('Cloud Function: validatePermissions', () => {
  test('soll Zugriff auf Event nach Location genehmigen', async () => {
    const userId = "user123";
    const eventId = "event456";
    
    // Setup: Benutzer mit Location="Zürich"
    // Event für Location="Zürich"
    
    const hasAccess = await validatePermissions(userId, eventId);
    
    expect(hasAccess).toBe(true);
  });

  test('soll Zugriff ablehnen bei falscher Location', async () => {
    const userId = "user123"; // Location: Zürich
    const eventId = "event456"; // Location: Basel
    
    const hasAccess = await validatePermissions(userId, eventId);
    
    expect(hasAccess).toBe(false);
  });

  test('soll Admin Zugriff auf alle Events erlauben', async () => {
    const adminId = "admin123"; // Role: Admin
    const eventId = "event456"; // Beliebige Location
    
    const hasAccess = await validatePermissions(adminId, eventId);
    
    expect(hasAccess).toBe(true);
  });
});
```

### 4.2 Firestore Security Rules Tests

**Ziel:** Teste Firestore Sicherheitsregeln.

**Test-Datei:**
```
functions/tests/firestore.rules.test.js
```

**Test-Szenarien:**

```javascript
// functions/tests/firestore.rules.test.js
describe('Firestore Security Rules', () => {
  
  test('soll unauthentifizierten Benutzern Lesezugriff verweigern', async () => {
    const unauth = firebase.initializeApp({}, 'unauth').auth();
    const db = unauth.firestore();
    
    expect(async () => {
      await db.collection('events').get();
    }).rejects.toThrow('Permission denied');
  });

  test('soll authentifizierten Benutzern eigene Events anzeigen', async () => {
    const auth = firebase.auth();
    const user = await auth.signInWithEmailAndPassword('user@example.com', 'password');
    const db = firebase.firestore();
    
    const events = await db.collection('events')
      .where('createdBy', '==', user.uid)
      .get();
    
    expect(events).toBeDefined();
  });

  test('soll Schreibzugriff auf Events nach Rolle limitieren', async () => {
    // Member kann nicht schreiben
    // Admin kann schreiben
    
    const memberDb = firebase.firestore(); // Member Benutzer
    expect(async () => {
      await memberDb.collection('events').add({ title: "Test" });
    }).rejects.toThrow('Permission denied');
  });
});
```

---

## 5. Integration-Tests

### 5.1 End-to-End Tests (E2E)

**Ziel:** Teste komplette User Workflows durch die Anwendung.

**Tool:** Cypress oder Playwright

**Test-Dateien:**
```
cypress/integration/
├── event-planning.cy.js
├── authentication.cy.js
├── document-management.cy.js
└── permissions.cy.js
```

#### Test-Szenario: Kompletter Event-Planning Workflow

```javascript
// cypress/integration/event-planning.cy.js
describe('Event-Planning Workflow (E2E)', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.login('organizer@example.com', 'password123');
  });

  test('Benutzer kann kompletten Event-Workflow durchführen', () => {
    // 1. Event erstellen
    cy.contains('Neues Event').click();
    cy.get('input[name="title"]').type('Sommerfest 2026');
    cy.get('input[name="date"]').type('2026-07-15');
    cy.get('select[name="location"]').select('Zürich');
    cy.get('select[name="group"]').select('Community');
    cy.contains('Speichern').click();
    cy.contains('Event erfolgreich erstellt').should('be.visible');

    // 2. Dokument hochladen
    cy.contains('Dokumente').click();
    cy.contains('Datei hochladen').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/program.pdf');
    cy.get('select[name="targetGroup"]').select('Community');
    cy.contains('Upload').click();
    cy.contains('Datei erfolgreich hochgeladen').should('be.visible');

    // 3. Benachrichtigung versenden
    cy.contains('Benachrichtigen').click();
    cy.get('textarea[name="message"]').type('Sommerfest findet statt!');
    cy.contains('Versenden').click();
    cy.contains('Benachrichtigungen versendet').should('be.visible');

    // 4. Event in Liste überprüfen
    cy.contains('Veranstaltungen').click();
    cy.contains('Sommerfest 2026').should('be.visible');
    cy.contains('Zürich').should('be.visible');
  });
});
```

#### Test-Szenario: Authentifizierung (E2E)

```javascript
// cypress/integration/authentication.cy.js
describe('Authentication Workflow (E2E)', () => {
  
  test('Neuer Benutzer kann sich registrieren und einloggen', () => {
    cy.visit('http://localhost:3000/register');
    
    // Registrierung
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('SecurePass123!');
    cy.get('select[name="location"]').select('Basel');
    cy.get('select[name="role"]').select('Member');
    cy.contains('Registrieren').click();
    cy.contains('Registrierung erfolgreich').should('be.visible');

    // Logout
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/login');

    // Login
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('SecurePass123!');
    cy.contains('Einloggen').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  test('Benutzer mit falschen Credentials kann nicht einloggen', () => {
    cy.visit('http://localhost:3000/login');
    
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('WrongPassword');
    cy.contains('Einloggen').click();
    
    cy.contains('E-Mail oder Passwort ungültig').should('be.visible');
    cy.url().should('not.include', '/dashboard');
  });
});
```

#### Test-Szenario: Dokumenten-Management (E2E)

```javascript
// cypress/integration/document-management.cy.js
describe('Document Management Workflow (E2E)', () => {
  
  beforeEach(() => {
    cy.login('user@example.com', 'password123');
  });

  test('Benutzer kann Datei hochladen und herunterladen', () => {
    cy.visit('http://localhost:3000/documents');
    
    // Upload
    cy.contains('Datei hochladen').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/announcement.pdf');
    cy.get('input[name="title"]').type('Wichtige Ankündigung');
    cy.get('select[name="targetGroup"]').select('Alle Mitglieder');
    cy.contains('Upload').click();
    cy.contains('Erfolgreich hochgeladen').should('be.visible');

    // Datei in Liste überprüfen
    cy.contains('Wichtige Ankündigung').should('be.visible');

    // Download
    cy.contains('Wichtige Ankündigung')
      .parent()
      .contains('Download')
      .click();
    
    // Verifiziere Download
    cy.readFile('cypress/downloads/announcement.pdf').should('exist');
  });

  test('Benutzer kann nur auf berechtigte Dokumente zugreifen', () => {
    cy.visit('http://localhost:3000/documents');
    
    // Dokument für "Leadership" sollte für "Member" nicht sichtbar sein
    cy.contains('Leadership Meeting Notes').should('not.exist');
    cy.contains('Community Ankündigung').should('exist');
  });
});
```

#### Test-Szenario: Berechtigungen (E2E)

```javascript
// cypress/integration/permissions.cy.js
describe('Permission Control (E2E)', () => {
  
  test('Member und Admin sehen unterschiedliche Funktionen', () => {
    // Als Member einloggen
    cy.login('member@example.com', 'password123');
    cy.visit('http://localhost:3000/dashboard');
    
    // Member sollte diese Buttons NICHT sehen
    cy.contains('Benutzer verwalten').should('not.exist');
    cy.contains('Berichte').should('not.exist');
    
    // Member sollte diese sehen
    cy.contains('Neue Ankündigung').should('be.visible');
    cy.contains('Meine Events').should('be.visible');

    // Als Admin einloggen
    cy.logout();
    cy.login('admin@example.com', 'password123');
    cy.visit('http://localhost:3000/dashboard');
    
    // Admin sollte alles sehen
    cy.contains('Benutzer verwalten').should('be.visible');
    cy.contains('Berichte').should('be.visible');
    cy.contains('Neue Ankündigung').should('be.visible');
  });

  test('Benutzer kann nur ihre Location sehen', () => {
    cy.login('zurich@example.com', 'password123');
    cy.visit('http://localhost:3000/events');
    
    // Events für Zürich sichtbar
    cy.contains('Zürich Meeting').should('be.visible');
    
    // Events für Basel NICHT sichtbar
    cy.contains('Basel Meeting').should('not.exist');
  });
});
```

---

## 6. Test-Ausführung

### 6.1 Setup für lokale Tests

**Installations-Commands:**

```bash
# Frontend Tests
npm install --save-dev jest react-testing-library @testing-library/react @testing-library/jest-dom

# E2E Tests
npm install --save-dev cypress

# Backend Tests (in functions/ Verzeichnis)
cd functions
npm install --save-dev firebase-functions-test jest
```

### 6.2 Test-Scripts in package.json

```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run",
    "test:all": "npm run test && npm run test:e2e:headless"
  }
}
```

### 6.3 Firebase Emulator für Tests

```bash
# Emulator starten
firebase emulators:start --only firestore,functions

# Tests gegen Emulator ausführen
FIREBASE_EMULATOR_HOST=localhost:8080 npm run test
```

---

## 7. Test-Abdeckung (Coverage)

### Ziele:

| Komponente | Coverage-Ziel | Priorität |
|------------|---------------|-----------|
| Authentication | 90%+ | Kritisch |
| Event-Planning | 85%+ | Hoch |
| Permissions | 95%+ | Kritisch |
| Document Upload | 80%+ | Hoch |
| Notifications | 75%+ | Mittel |
| UI Components | 70%+ | Mittel |

### Coverage Report generieren:

```bash
jest --coverage --coverage-reporters=html
```

Öffne dann `coverage/index.html` im Browser.

---

## 8. Test-Ausführungs-Checkliste

### Vor Release zu Production:

- [ ] Alle Unit Tests bestanden (100% grün)
- [ ] Code Coverage >= 80%
- [ ] Alle E2E Tests auf main-Branch bestanden
- [ ] Keine kritischen Security Issues
- [ ] Performance Tests bestanden (Ladezeit < 3s)
- [ ] Firebase Emulator Tests bestanden
- [ ] Firestore Security Rules Tests bestanden
- [ ] Cloud Functions Tests bestanden
- [ ] Benachrichtigungssystem getestet (mindestens 100 gleichzeitige)
- [ ] Permission Matrix für alle Kombinationen getestet

### Testplan-Zyklus:

1. **Entwickler**: Feature schreiben + Unit Tests (vor Push)
2. **CI/CD Pipeline**: Automatische Tests on commit (GitHub Actions)
3. **QA**: Manual E2E Testing (1-2x pro Woche)
4. **Pre-Release**: Full Test Suite (vor Production Deployment)

---

## 9. Bekannte Test-Herausforderungen

### Challenge 1: Firestore in Tests
**Problem:** Real Firestore ist langsam in Tests  
**Lösung:** Firebase Emulator Suite verwenden

### Challenge 2: Authentication Mocking
**Problem:** Firebase Auth ist schwer zu mocken  
**Lösung:** Firebase Admin SDK für Test-User

### Challenge 3: Notification Timing
**Problem:** Async Notifications in Tests schwierig  
**Lösung:** Cypress `.then()` und Waits verwenden

### Challenge 4: Große Datenmengen
**Problem:** Test-Daten können Emulator überlasten  
**Lösung:** Minimal Data Set für Tests (< 1000 Dokumente)

---

## 10. Zukünftige Test-Verbesserungen

1. **Automated Performance Testing**: Lighthouse scores in CI/CD
2. **Visual Regression Testing**: Percy oder Chromatic
3. **Load Testing**: k6 oder Artillery für Benachrichtigungen
4. **Security Testing**: OWASP ZAP Integration
5. **Accessibility Testing**: axe-core für a11y
6. **Mobile Testing**: Real Device Testing mit BrowserStack
7. **Mutation Testing**: Stryker für Test-Qualität

---

## 11. Kontakt & Support

**Test-Lead:** Development Team  
**Feedback:** GitHub Issues mit Label `testing`  
**Fragen:** Siehe docs/ für weitere Dokumentation  

---

**Testplan Status:** ✅ Aktiv  
**Letzte Aktualisierung:** Mai 2026  
**Nächste Review:** August 2026
