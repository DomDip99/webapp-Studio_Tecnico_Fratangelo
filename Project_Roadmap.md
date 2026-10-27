# Project Roadmap

Gestionale per la rendicontazione di fatture, bollette, rate e documenti fiscali, con generazione di report. Progetto di apprendimento.

**Obiettivo:** imparare le basi dell'architettura web, i test e il flusso di lavoro con Git, procedendo per tappe.

## Tappe di migrazione

| Tappa | Stack | Tag Git |
|---|---|---|
| 1 | React (Vite) + Express + SQLite (`better-sqlite3`, SQL scritto a mano) | `v0.1` |
| 2 | React (Vite) + Express + PostgreSQL + Drizzle ORM | `v0.2` |
| 3 | Next.js + PostgreSQL + Drizzle ORM (senza Express separato) | `v0.3` |

Struttura del repo: `client/` (React) e `server/` (Node + Express).

## Convenzioni

- **Git:** `main` contiene sempre codice funzionante. Un branch per ogni unità di lavoro (`feature/...`, `fix/...`, `docs/...`), poi Pull Request e merge. Un branch può toccare sia `client/` sia `server/`.
- **Tag:** si marca ogni tappa conclusa (`v0.1`, `v0.2`, `v0.3`).
- **Segreti e dati:** `.env` e i file del database (`*.db`, `*.sqlite`) non si committano mai. `.env.example` documenta le variabili.
- **Test:** si scrivono insieme al codice, non alla fine. Server: Jest + supertest. Client: Vitest + React Testing Library.
- **Importi:** da progettare in centesimi interi per evitare errori sui decimali.
- **Accesso ai dati:** tutte le query stanno in `server/db/`, scritte come funzioni `async`, così il passaggio a PostgreSQL non tocca le route.

---

## Tappa 1: React + Express + SQLite

### Fase 0: Repository e ambiente
- [x] Creare il repo su GitHub (README, licenza MIT, `.gitignore` Node)
- [x] Clonare in locale e creare `client/` e `server/`
- [x] Inizializzare il client con Vite e il server con `npm init`
- [x] Primo commit e push
- [x] Prima Pull Request: dipendenze del server, Jest, `.env.example`, `.gitattributes`
- [ ] Aggiungere questa roadmap al repo

### Fase 1: Server base
- [x] Express con CORS e JSON, endpoint `/api/health`
- [x] Variabili d'ambiente con `dotenv`
- [ ] Separare `app.js` (costruzione dell'app) e `index.js` (avvio), necessario per testare le API

### Fase 2: Primi test
- [ ] Capire struttura di un test (`describe`, `it`, `expect`) con una funzione semplice
- [ ] Primo test sull'endpoint `/api/health` con supertest
- [ ] File `tests/setup.js` con `DB_PATH=:memory:`

### Fase 3: Database SQLite
- [ ] Progettare lo schema: utenti, categorie, documenti (fatture, bollette, rate), pagamenti
- [ ] Connessione in `server/db/index.js` (percorso da `DB_PATH`)
- [ ] Creazione tabelle con script SQL di migrazione
- [ ] Funzioni di accesso ai dati in `server/db/`, in stile `async`
- [ ] Test sulle funzioni del database con DB in memoria

### Fase 4: API REST
- [ ] Rotte CRUD per i documenti
- [ ] Validazione degli input e gestione degli errori
- [ ] Test delle rotte con supertest

### Fase 5: Autenticazione e sicurezza
- [ ] Registrazione e login (hash delle password, JWT o sessioni)
- [ ] Protezione delle rotte e separazione dei dati per utente
- [ ] Test di autenticazione e autorizzazione

### Fase 6: Upload dei file
- [ ] Caricamento di PDF e immagini con `multer`
- [ ] File su disco (fuori da Git), nel database solo il riferimento
- [ ] Limiti di dimensione e tipo di file

### Fase 7: Report
- [ ] Query di aggregazione per periodo, categoria, stato dei pagamenti
- [ ] Endpoint per i report
- [ ] Esportazione (CSV o PDF)

### Fase 8: Frontend React
- [ ] Struttura delle pagine e routing
- [ ] Chiamate alle API e gestione di loading ed errori
- [ ] Interfaccia ispirata al programma esistente da rinnovare
- [ ] Test dei componenti con Vitest + React Testing Library

### Fase 9: Integrazione e chiusura tappa
- [ ] Collegamento completo client-server
- [ ] Verifica della persistenza dei dati
- [ ] Tag `v0.1`

---

## Tappa 2: PostgreSQL + Drizzle

- [ ] Installare PostgreSQL in locale e il driver `pg`
- [ ] Introdurre Drizzle ORM (`drizzle-orm`, `drizzle-kit`), schema in JavaScript
- [ ] Riscrivere le funzioni di `server/db/` con Drizzle, riadattare i test
- [ ] Migrare i dati esistenti da SQLite
- [ ] Tag `v0.2`

Nota: il cambio di database non si riduce a modificare il `dialect`. Cambiano gli import dello schema (`sqliteTable` diventa `pgTable`), alcuni tipi di colonna e l'inizializzazione del driver. Le query restano molto simili.

## Tappa 3: Next.js

- [ ] Creare il progetto Next.js
- [ ] Spostare i componenti React e le pagine
- [ ] Spostare la logica dei dati in API Routes o Server Actions, eliminando Express
- [ ] Riadattare autenticazione e upload
- [ ] Tag `v0.3`

---

## Idee future

- Storage cloud per i file caricati
- Deploy dell'applicazione
- GitHub Actions per test e lint automatici
- Protezione del branch `main` con review obbligatoria
- Un secondo piccolo progetto con MongoDB, per imparare il modello a documenti
