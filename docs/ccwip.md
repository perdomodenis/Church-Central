Das Umwandeln der PDF-Datei in das Markdown-Format übersteigt meine Limits keineswegs. Ich habe den gesamten Text, die Tabellen, die API-Spezifikationen und die hierarchischen User Stories aus deiner Projektdokumentation vollständig extrahiert und sauber strukturiert.

Hier ist der komplette Inhalt von **Church Central (Dokumentation Gruppe 2)** als valide Markdown-Datei:

```markdown
# Church Central – Projektdokumentation
**Gruppe 2**

---

## 1. Projektplan und Scope Definition
* **Datum:** Samstag, 9. Mai 2026, 11:22 AM
* **Status:** Planungsphase abgeschlossen

### Basisdaten
| Feld | Inhalt |
| :--- | :--- |
| **Projektname** | Church Central |
| **Zweck und Vision** | Verbesserung des Informationsflusses in Kirchen |
| **Scope** | Die App soll die Eventplanung und Verbreitung der Informationen vereinfachen und zentralisieren. Der Nutzer wird Dokumente oder Ankündigungen hochladen, welche dann die vorbestimmten Nutzer erreicht und benachrichtigt. Die Nutzer werden nach Standort (Court), Gruppen (Departement) und Rollen (Position) aufgeteilt. Die App ist komplett webbasiert und kann somit von jedem ohne direkte Installation benutzt werden. |
| **Machbarkeitsanalyse** | Technisch gesehen sehr machbar, da die notwendigen Ressourcen alle kostenlos verfügbar sind. |
| **Budget & Ressourcen** | Bis zu einem Datenlimit kostenfrei. |

### Projektphasen & Meilensteine

#### 1. Planungsphase (Project Planning)
Fokus auf die organisatorischen Rahmenbedingungen, Termine, Meilensteine und die wirtschaftliche/technische Machbarkeit.
* Projektplan & Scope-Definition abgeschlossen.
* **Ergebnis:** Festlegung des MVP-Umfangs.

#### 2. Analysephase (Requirements Engineering & Analysis)
Fokus auf die Ausarbeitung der detaillierten fachlichen und technischen Anforderungen, User Stories und die Risikoanalyse.
* Anforderungsanalyse & Zielkatalog abgeschlossen.
* **Ergebnis:** Abgestimmte funktionale und nicht-funktionale Anforderungen (inkl. Datenschutz- und Rollenkonzept).

#### 3. Design- / Entwurfsphase (Software Architecture & Design)
Fokus auf die softwareseitige und visuelle Konzeption der Anwendung vor dem eigentlichen Programmierstart.
* Software Design Document (SDD) & Wireframes fertig.
* **Ergebnis:** Festlegung der Schichtenarchitektur (3-Tier), des logischen Datenmodells und Bereitstellung von Low-Fidelity Skizzen der Benutzeroberfläche.

#### 4. Vorbereitungs- & Infrastrukturphase (Setup & Environment)
Fokus auf das Bereitstellen der Werkzeuge und der Zielumgebungen, die für die Entwicklung und den Betrieb notwendig sind.
* Entwicklungsumgebung, Cloud-Infrastruktur & Repository eingerichtet.
* **Ergebnis:** * Git-Repository initialisiert.
  * Cloud-Infrastruktur für die Datenbank-Instanz (z. B. in der Public Cloud) bereitgestellt.
  * CI/CD-Pipeline für automatisierte Deployments eingerichtet.

#### 5. Implementierungsphase (Development & Implementation)
Fokus auf das eigentliche Schreiben des Programmcodes für das Backend (Logik) und das Frontend (Präsentation).
* **Backend & Kernlogik (Logikschicht / Business Logic Layer):**
  * Datenbank-Schema & Datenzugriffsschicht (Data Access Layer) implementiert.
  * **Ergebnis:** Das DB-Schema ist in die Cloud-Datenbank eingespielt; die Grundfunktionen zum Speichern und Abrufen von Dokumenten über das Backend funktionieren.
  * Kern-Logik & Nutzer-Kategorisierung fertiggestellt.
  * **Ergebnis:** Die Logik für Standorte (Court), Gruppen (Departement) und Rollen (RBAC) ist im Backend stabil umgesetzt.
* **Frontend & Interaktion (Präsentationsschicht / Presentation Layer):**
  * Benutzeroberfläche & Dokumenten-Upload integriert.
  * **Ergebnis:** Die Views für die Anwender stehen; Nutzer können Ankündigungen hochladen und das Frontend kommuniziert erfolgreich über APIs mit dem Backend.
  * Benachrichtigungssystem & Rollenprüfung aktiv.
  * **Ergebnis:** Die App prüft im Frontend die Autorisierung und benachrichtigt die vorbestimmten Nutzergruppen basierend auf ihren Rollen.

#### 6. Testphase (Software Testing / Quality Assurance)
Fokus auf die systematische Überprüfung der Anwendung gegen die definierten Anforderungen, um ein fehlerfreies System zu garantieren.
* Systemtests & Fehlerbehebung abgeschlossen.
* **Ergebnis:** Durchführung von automatisierten und manuellen Integrationstests nach der Testpyramide; kritische Bugs und Sicherheitslücken sind behoben.

#### 7. Deployment- & Betriebsphase (Deployment & Maintenance)
Fokus auf den Go-Live der Anwendung und den offiziellen Projektabschluss.
* MVP Deployment & Go-Live.
* **Ergebnis:** Die Webapplikation ist über die CI/CD-Pipeline in der produktiven Cloud-Umgebung live gesetzt und für Endnutzer erreichbar.
* Projektabschluss & Lessons Learned.
* **Ergebnis:** Durchführung einer kurzen Retrospektive zur Prozessverbesserung für künftige Sprints.

---

## 2. Analyse & Anforderungen
* **Datum:** Montag, 18. Mai 2026, 17:25

### Risikoanalyse

| Risiko | Lösung |
| :--- | :--- |
| Hohe Anzahl an zeitgleichem Zugriff | Systemtests / Lasttests vorsehen |
| Sensible religiöse Daten | DSGVO-konforme Massnahmen |
| Datenzugriff innerhalb der App | Role-Based Access Control (RBAC) |
| Schädliche Skripte durch Dokumenten-Upload | Malware-Schutz / Payload-Validierung |

### Berechtigungskonzept (Inhaltstrennung nach Zugriffslevel)

* **Level 1 (Besucher):**
  * Events & Ankündigungen
  * Neue Mitglieder & Allgemeine Themen
  * Links (Livestream, Bible Study, Gebet)
  * Programm-Informationen (Zeugnis-Abgabedatum, Tauf-Datum, Verfügbarkeit der Leiter)
* **Level 2 (Co-Leiter, Mitglied):**
  * Arbeitsplan
  * Neue Errungenschaften (Erfolge, neue Mitglieder, etc.)
  * Fortschrittsübersicht
* **Level 3 (Pastor, Diakon, Leiter):**
  * Übersicht der Distrikte
  * Mitglieder-Anwesenheit
  * Übersicht der Mitglieder pro Departement
* **Level 4 (Reverend):**
  * Vollständige Übersicht aller Informationen und Updates

---

## 3. User Stories

### MVP (Minimum Viable Product)
* **Als Benutzer** möchte ich Dokumente hochladen, **damit** andere Zugriff darauf haben.
* **Als Benutzer** möchte ich nur bei spezifischen Events benachrichtigt werden, **damit** ich keine unnötigen Infos erhalte.
* **Als Benutzer** möchte ich Zugriff auf Infos erhalten, **damit** ich nichts verpasse.
* **Als Benutzer** möchte ich Links zu den Streams erhalten, **damit** ich sie anschauen kann.
* **Als Benutzer** möchte ich nach Standort (*courts*), Rollen (*position*) und Gruppen (*Departments, Districts, SOW*) aufgeteilt werden, **damit** ich richtig eingeteilt bin.
* **Als Benutzer** möchte ich, dass die Infos nur für Befugte zugänglich sind, **damit** keine Aussenstehenden Zugriff darauf haben.
* **Als Benutzer** möchte ich meine Gedanken anonym teilen, **damit** diese auch durchkommen.
* **Als Benutzer** möchte ich das bevorstehende Programm angezeigt bekommen, **damit** ich mich vorbereiten kann.
* **Als Benutzer** möchte ich bei Videokonferenzen mit Link benachrichtigt werden, **damit** ich diese nicht verpasse.
* **Als Benutzer** möchte ich den Service bewerten können, **damit** die Minister eine Rückmeldung erhalten.
* **Als Benutzer** möchte ich mich registrieren können und meine Departement-Zugehörigkeit auswählen können, **damit** ich über ein Konto verfüge.
* **Als Member** möchte ich einen Arbeitsplan haben, **damit** ich über meine Stunden Bescheid weiss.
* **Als Member** möchte ich, dass Neuigkeiten/Erfolge angezeigt werden, **damit** alle den Fortschritt miterleben können.
* **Als Member** möchte ich den jeweiligen Dress-Code angezeigt bekommen, **damit** ich mich vorbereiten kann.
* **Als Besucher** möchte ich wissen, wann man sein *Testimony* abgeben darf, **damit** ich Bescheid weiss.
* **Als Besucher** möchte ich mich durch die App für das NLS / die Taufe anmelden können, **damit** ich dies nicht verpasse, falls Astrid nicht auffindbar ist.
* **Als Admin** möchte ich die Benutzer aufteilen, **damit** jeder den richtigen Inhalt bekommt.
* **Als Admin** möchte ich Benutzer hinzufügen und entfernen können, **damit** ich Duplikat-Probleme entfernen kann.
* **Als Leader** möchte ich in einer Admin-Gruppe bezüglich der *Districts* sein, **damit** alle die Infos erhalten und wir motiviert sind, um die Anforderungen zu erfüllen.
* **Als Leader** möchte ich Members meinem Department hinzufügen oder entfernen können, **damit** ich mein Department administrieren kann.
* **Als Leiter** möchte ich meine Mitglieder in mein Departement genehmigen können, **damit** ich meine Mitglieder drinnen habe.
* **Als Reverend** möchte ich einen eigenen Kanal über alle Infos und Updates erhalten, **damit** ich den Überblick habe, ohne überfordert zu werden.

### Post-MVP
* **Als Member** möchte ich ein Projektmanagement-Tool, **damit** ich den Fortschritt mitverfolgen kann.
* **Als Leader** möchte ich wissen, wann meine Members krank sind, **damit** ich mich vorbereiten kann.
* **Als Admin** möchte ich die App skalieren können, **damit** ich die App auf andere Länder ausbreiten kann.
* **Als Benutzer** möchte ich mit spezifischen Leuten einen Termin abmachen, **damit** meine Anfrage auch sicher bearbeitet wird.

---

## 4. Technische Systemarchitektur & Infrastruktur
* **Datum:** Montag, 18. Mai 2026, 20:15

Die Applikation wird in einer klassischen **3-Schichten-Architektur** (3-Tier Architecture) innerhalb eines **Kubernetes-Clusters** betrieben.

### Komponenten & Technologie-Stack
* **Frontend:** React Web UI (verpackt als Docker-Container)
* **Backend:** Node.js / Express REST API (verpackt als Docker-Container)
* **Datenbank:** PostgreSQL (verpackt als Docker-Container) mit persistenten Daten-Volumes
* **Orchestrierung:** Kubernetes zur Verwaltung, Skalierung und Hochverfügbarkeit
* **Repository & DevOps:** GitLab zur Verwaltung von Code, Konfigurationsdateien, Kubernetes-Manifesten und Dokumentation.

### GitLab CI/CD Pipeline Workflow
1. **Code Push:** Entwickler pusht Code ins GitLab-Repository.
2. **Build:** Automatisches Erstellen der Docker-Images.
3. **Test:** Ausführung automatisierter Softwaretests.
4. **Image Push:** Sicheres Ablegen der verifizierten Images in der GitLab Container Registry.
5. **Deploy:** Rollout des Updates auf das produktive Kubernetes-Cluster.

---

## 5. Strategisches API-Design (Anlehnung an DDD)
Die API-Endpunkte sind entsprechend den identifizierten Aggregaten und Entitäten in logische Ressourcen-Kontexte gegliedert. Jedes Aggregat erhält einen eindeutigen Pfad (*Bounded Context*).

### 5.1 Endpunkt-Übersicht

#### Authentifizierung & Benutzerverwaltung (User Management)
Verantwortlich für die Registrierung, Anmeldung und Rollenzuweisung (RBAC).
* `POST /api/v1/auth/register` – Registrierung eines neuen Kontos mit Auswahl der Wunsch-Zugehörigkeit.
* `POST /api/v1/auth/login` – Authentifizierung und Vergabe des JWT (JSON Web Tokens).
* `PATCH /api/v1/users/:id/roles` – Zuweisung/Änderung von Court, Departement oder Position (*Admin-only*).

#### Organisationsstruktur (Organisation Structure)
Verwaltung der Hierarchien: Courts (Standorte), Departements (Gruppen) und Districts.
* `GET /api/v1/courts` – Abrufen aller Standorte.
* `POST /api/v1/departments/:id/members` – Hinzufügen von Mitgliedern zu einem Departement durch den Leiter.
* `DELETE /api/v1/departments/:id/members/:userId` – Entfernen von Mitgliedern aus einem Departement.
* `PATCH /api/v1/departments/:id/approve/:userId` – Genehmigung eines neuen Mitglieds durch den Leiter.

#### Dokumente & Ankündigungen (Uploads & Communication)
Verarbeitung von hochgeladenen Dokumenten und News mit integrierter Rollenprüfung.
* `POST /api/v1/content` – Erstellen/Hochladen einer neuen Entität (Typ: `document`, `event` oder `news`).
* `GET /api/v1/content` – Abrufen der Feeds/Inhalte, gefiltert nach dem Zugriffslevel (Level 1 bis 4) des angemeldeten Benutzers.

### 5.2 Detaillierte API-Spezifikation (SDD-Beispiele)

#### Endpunkt 1: Dokument / Ankündigung hochladen
* **User Story:** *„Als Benutzer möchte ich Dokumente hochladen, damit andere Zugriff darauf haben.“*
* **Sicherheits-Anforderung:** Schutz vor schädlichen Skripten (Malware-Validierung erforderlich).
* **HTTP-Methode:** `POST`
* **Pfad:** `/api/v1/content`
* **Headers:** * `Authorization: Bearer <JWT-Token>`
  * `Content-Type: multipart/form-data`

**Request Body (Form-Data / JSON):**
```json
{
  "type": "document",
  "title": "Gemeinde-Update Mai",
  "targetCourts": ["Glory Court"],
  "targetDepartments": ["Youth"],
  "minAccessLevel": 2
}

```

**Response (210 Created):**

```json
{
  "id": "doc_98765",
  "title": "Gemeinde-Update Mai",
  "url": "[https://storage.cloud.local/church-central/docs/update_mai.pdf](https://storage.cloud.local/church-central/docs/update_mai.pdf)",
  "status": "scanned_and_approved",
  "createdAt": "2026-05-19T17:12:00Z"
}

```

#### Endpunkt 2: Departement-Mitglied genehmigen

* **User Story:** *„Als Leiter möchte ich meine Mitglieder in mein Departement genehmigen können.“*
* **HTTP-Methode:** `PATCH`
* **Pfad:** `/api/v1/departments/:deptId/approve/:userId`
* **Headers:**
* `Authorization: Bearer <JWT-Token>`



**Response (200 OK):**

```json
{
  "message": "User successfully approved for the department.",
  "departmentId": "dept_choir_01",
  "userId": "usr_denis123",
  "status": "active"
}

```

### 5.3 Sicherheits- & Risiko-Architektur im API-Design

1. **Role-Based Access Control (RBAC) & Inhaltstrennung:**
Jeder API-Route wird eine Middleware vorgeschaltet, die das verschlüsselte JWT decodiert, das `AccessLevel` (1–4) ausliest und prüft, ob die Berechtigung ausreicht.
* *Beispiel:* Versucht ein Besucher (Level 1) auf `GET /api/v1/districts` zuzugreifen (erfordert Level 3), blockiert die API sofort mit einem `403 Forbidden`.


2. **Payload-Validierung & Malware-Schutz:**
Um schädliche Skripte beim Dokumenten-Upload zu verhindern, muss die API:
* Den MIME-Type validieren (nur echte PDFs, Bilder, etc. erlauben).
* Dateigrößen-Limits (*Rate Limiting / Payload Limits*) erzwingen, um das Budget/Datenlimit der Cloud-Infrastruktur nicht zu sprengen.
* Die Datei temporär isolieren und über einen Stream-basierten Virenscanner jagen, bevor sie in den permanenten Cloud-Speicher übertragen wird.


3. **Schutz sensibler religiöser Daten (DSGVO):**
* Alle personenbezogenen Endpunkte müssen über TLS verschlüsselt sein (HTTPS).
* Bei Endpunkten wie anonymem Feedback (*„Als Benutzer möchte ich meine Gedanken anonym teilen“*) muss die API beim Speichern in der PostgreSQL-Datenbank jegliche IP-Adressen oder User-IDs serverseitig komplett verwerfen, sodass keine Rückverfolgung möglich ist.


4. **Performance & Skalierbarkeit (Hohe zeitgleiche Zugriffe):**
Da das System über Kubernetes orchestriert wird und elastisch skalieren soll, muss für das API-Engineering ein **Verbindungs-Pooling** (Connection Pooling) für die PostgreSQL-Datenbank implementiert werden. Dadurch bricht die API bei Systemtests oder echten Lastspitzen (z. B. Sonntagabends während des Livestreams) nicht zusammen.

---

## 6. Fachliches Design (Domain-Driven Design)

* **Datum:** Dienstag, 19. Mai 2026, 17:46

Im taktischen Design wird das System in klar abgegrenzte fachliche Einheiten (*Aggregate*) aufgeteilt. Ein Aggregat besteht aus einer führenden Entität (dem **Aggregate Root**), die den Zustand nach aussen hin schützt. Andere Objekte innerhalb des Aggregats können Entitäten oder Value Objects sein.

### 6.1 Identifizierte Aggregate und Entitäten

#### 1. Aggregat: Organization Structure (Struktur)

Dieses Aggregat verwaltet die hierarchische Aufteilung der Organisation. Ein Department kann nicht ohne einen Court existieren.

* **Aggregate Root:** `Court` (Entität)
* *Eigenschaften:* `id`, `name`, `country`, `createdAt`


* **Entität (innerhalb des Aggregats):** `Department`
* *Eigenschaften:* `id`, `name`, `type`
* *Integritätsregel:* Ein Department ist immer fest an einen Court gebunden.



#### 2. Aggregat: User Management (Benutzerverwaltung)

Verwaltet die Identitäten, Zugangsdaten und die globalen Rollen der Mitglieder.

* **Aggregate Root:** `User` (Entität)
* *Eigenschaften:* `email` (ID), `passwordHash`, `firstName`, `lastName`, `isActive`


* **Value Object / Referenz:** `Role`
* *Beschreibung:* Bestimmt die grundlegenden Rechte (z.B. Admin, Moderator, Member).


* **Entität (innerhalb des Aggregats):** `UserDepartment` (Zuordnung)
* *Beschreibung:* Bildet die n:m-Beziehung ab, in welchen Gruppen/Abteilungen ein Nutzer aktiv ist.



#### 3. Aggregat: Communication (Ankündigungen & Information)

Das Herzstück für die Verbreitung von Informationen. Es kapselt die Ankündigung und deren spezifische Zielgruppensteuerung.

* **Aggregate Root:** `Announcement` (Entität)
* *Eigenschaften:* `id`, `title`, `content`, `fileUrl`, `createdAt`
* *Referenz:* `author` (Verweist auf die ID des Users)


* **Entität / Value Object:** `AnnouncementTarget` (Zielgruppe)
* *Beschreibung:* Definiert die Filterregeln für die Zustellung. Eine Ankündigung hat eine oder mehrere Zielgruppen-Bedingungen.
* *Integritätsregel:* Wenn eine Ankündigung gelöscht wird, verschwinden auch alle ihre `AnnouncementTargets`.



### 6.2 Repositories (Schnittstellen)

Da Repositories im DDD immer nur für Aggregate Roots bereitgestellt werden, benötigt das System genau drei Repositories. Sie abstrahieren den Datenbankzugriff (z.B. Firebase / SQL):

#### `CourtRepository`

* `save(court: Court): void` – Erstellt oder aktualisiert einen Standort (inkl. seiner Departments).
* `findById(id: String): Court` – Lädt einen Court samt seiner Abteilungen.
* `findAll(): List<Court>` – Listet alle Standorte für die Auswahl auf.

#### `UserRepository`

* `save(user: User): void` – Registriert oder aktualisiert einen Nutzer (inkl. Department-Zugehörigkeit).
* `findByEmail(email: String): User` – Wichtig für den Login-Prozess und die Authentifizierung.
* `findUsersByTarget(courtId, departmentId, roleId): List<User>` – *Fachlich kritische Methode:* Findet alle Nutzer, die den Kriterien eines Announcement Targets entsprechen, um die Benachrichtigungen auszulösen.

#### `AnnouncementRepository`

* `save(announcement: Announcement): void` – Speichert eine neue Ankündigung samt ihrer Zielgruppen-Filter.
* `findActiveAnnouncementsForUser(user: User): List<Announcement>` – Holt alle Ankündigungen, die für die Standorte, Abteilungen oder Rollen des spezifischen Nutzers freigegeben sind.

---

## 7. Test- & Verifikationsplanung

* **Datum:** Samstag, 9. Mai 2026, 14:13
* **Ziel:** Systematische Durchführung von Verifikationstests vor dem Release.

1. **Benachrichtigungsfunktion testen:** Überprüfung, ob Benachrichtigungen nur an die im `AnnouncementTarget` hinterlegten Rollen und Gruppen verteilt werden.
2. **Sicherheits- & RBAC-Verifikation:** Validierung, dass Zugriffslevel-Sperren unbefugte API-Aufrufe (z. B. Level 1 User versucht Level 3 Routen aufzurufen) unterbinden.