# Project Roadmap

Gestionale per la rendicontazione di fatture, bollette, rate e documenti fiscali, con generazione di report. Progetto di apprendimento. Ultimo aggiornamento: 27/11/2026.

**Obiettivo:** imparare le basi dell'architettura web, i test e il flusso di lavoro con Git, procedendo per tappe.

## Come si è sviluppato finora

Rispetto al piano iniziale l'ordine è cambiato: prima si è costruito il **client completo con dati finti** (struttura, login di prova, tutte le pagine, test), e solo dopo si progetta il database. Dalle schermate del programma originale emergono così i campi e le relazioni reali, e lo schema nasce da requisiti concreti. Decisioni, ipotesi e dubbi da portare nel database sono raccolti in `NOTE-PROGETTO.md`.

## Tappe di migrazione

| Tappa | Stack | Tag Git |
|---|---|---|
| 1 | React (Vite) + Express + SQLite (`better-sqlite3`, SQL scritto a mano) | `v0.1` |
| 2 | React (Vite) + Express + PostgreSQL + Drizzle ORM | `v0.2` |
| 3 | Next.js + PostgreSQL + Drizzle ORM (senza Express separato) | `v0.3` |

Struttura del repo: `client/` (React) e `server/` (Node + Express).

## Convenzioni

- **Git:** `main` contiene sempre codice funzionante. Un branch per ogni unità di lavoro (`feature/...`, `fix/...`, `docs/...`), poi Pull Request e merge. Un branch può toccare sia `client/` sia `server/`. Un commit per argomento.
- **Tag:** si marca ogni tappa conclusa (`v0.1`, `v0.2`, `v0.3`).
- **Segreti e dati:** `.env` e i file del database (`*.db`, `*.sqlite`) non si committano mai. `.env.example` documenta le variabili.
- **Test:** si scrivono insieme al codice. Server: Jest + supertest. Client: Vitest + React Testing Library. La copertura si misura con `npm run coverage` nel client. Il layout responsive non si verifica con i test: si controlla a mano.
- **Importi** in centesimi interi, **date** in formato ISO (`AAAA-MM-GG`), formattati solo in visualizzazione.
- **Accesso ai dati** in `server/db/`, scritto come funzioni `async`, così il passaggio a PostgreSQL non tocca le route.
- **Logica nel server:** calcoli, permessi e validazioni stanno nelle API, così ogni interfaccia (computer o telefono) li condivide.

---

## Tappa 1: React + Express + SQLite

### Fase 0: Repository e ambiente
- [x] Repo su GitHub (README, licenza MIT, `.gitignore` Node), `client/` e `server/`
- [x] Dipendenze, Jest, `.env.example`, `.gitattributes`
- [x] Roadmap e README nel repo

### Fase 1: Server base e primi test
- [x] Express con CORS e JSON, endpoint `/api/health`
- [x] Server diviso in `app.js` e `index.js`
- [x] Primo test con Jest e supertest

### Fase 2: Client, struttura e collegamento
- [x] Template di Vite ripulito, Bootstrap, react-router, react-icons, dayjs
- [x] Proxy di Vite verso il server e controllo dello stato del server
- [x] Vitest e React Testing Library

### Fase 3: Login finto e ruoli
- [x] Contesto di autenticazione, pagina di login, rotte protette
- [x] Ruoli `admin` e `utente`: menu e rotte per ruolo, uscita

### Fase 4: Pagine con dati finti
- [x] Componenti riusabili (barra azioni, tabelle, form, calendario)
- [x] Tabelle, Gestione (prima nota, per voci di spesa, rate, pratiche)
- [x] Situazione (oggi, calendario, ricerca voce) e Conti
- [x] Utilità e Fatture (con calcolo dei totali)
- [x] Test di integrazione dell'intera app e controllo della copertura

### Fase 5: Stile, layout responsive e documentazione
- [ ] Tema chiaro come base e interruttore chiaro/scuro per tutta l'app
- [ ] Colori e logo (il logo è in attesa)
- [ ] Layout responsive per tutta l'app: barra laterale a scomparsa su schermi piccoli, tabelle scorrevoli, form su una colonna
- [ ] Verifica a mano con la modalità dispositivo del browser (telefono e tablet)
- [x] Documenti aggiornati (README, roadmap, note di progetto)

### Fase 6: Database SQLite
- [ ] Progettare lo schema a partire da `NOTE-PROGETTO.md`
- [ ] Connessione in `server/db/index.js` (percorso da `DB_PATH`)
- [ ] Script SQL di creazione e migrazione delle tabelle
- [ ] Funzioni di accesso ai dati, in stile `async`
- [ ] Test con database in memoria (`:memory:`)

### Fase 7: API REST
- [ ] Rotte CRUD per ogni entità (tabelle, movimenti, rate, pratiche, fatture)
- [ ] Validazione degli input e gestione degli errori
- [ ] Test delle rotte con supertest

### Fase 8: Autenticazione e sicurezza
- [ ] Registrazione e login veri (password cifrate, JWT o sessioni)
- [ ] Permessi per ruolo controllati sul server, separazione dei dati per utente
- [ ] Sessione più breve per l'accesso da telefono
- [ ] Test di autenticazione e autorizzazione

### Fase 9: Documenti allegati
- [ ] Caricamento di PDF e immagini con `multer`
- [ ] File su disco (fuori da Git), nel database solo il riferimento
- [ ] Limiti di dimensione e tipo di file
- [ ] Caricamento da telefono con la fotocamera (campo file con `capture`), foto ridimensionate prima dell'invio, messaggio chiaro se la connessione cade

### Fase 10: Collegare il client alle API
- [ ] Sostituire i dati finti con le chiamate al server
- [ ] Stati di caricamento ed errore, salvataggio dei form
- [ ] Anno d'esercizio e data corrente applicati ai dati, salvataggio reale dello zip
- [ ] Test aggiornati e verifica della persistenza dei dati

### Fase 11: Chiusura della tappa
- [ ] Report ed esportazione (CSV o PDF), pulsanti di stampa
- [ ] Tag `v0.1`

---

## Tappa 2: PostgreSQL + Drizzle

- [ ] PostgreSQL in locale (anche tramite Docker Compose) e driver `pg`
- [ ] Introdurre Drizzle ORM (`drizzle-orm`, `drizzle-kit`), schema in JavaScript
- [ ] Riscrivere le funzioni di `server/db/` con Drizzle, riadattare i test
- [ ] Migrare i dati esistenti da SQLite
- [ ] Tag `v0.2`

Nota: il cambio di database non si riduce a modificare il `dialect`. Cambiano gli import dello schema (`sqliteTable` diventa `pgTable`), alcuni tipi di colonna e l'inizializzazione del driver. Le query restano molto simili.

## Tappa 3: Next.js

- [ ] Creare il progetto Next.js
- [ ] Spostare componenti e pagine
- [ ] Spostare la logica dei dati in API Routes o Server Actions, eliminando Express
- [ ] Riadattare autenticazione e upload
- [ ] Tag `v0.3`

---

## Dopo le tre tappe

### Uso da telefono (deciso)
- Layout **responsive per tutta l'app** (Fase 5), perché non si sa quali sezioni si useranno di più.
- **Caricamento di documenti dalla fotocamera** (Fase 9).
- Si usa fuori dall'ufficio, tramite VPN: in ufficio si usa il computer. Non esiste ancora un'app da telefono con cui confrontarsi, quindi l'uso concreto è ipotetico.
- **Scartati per ora:** React Native (interfaccia da riscrivere, due codici da mantenere) e Capacitor. Non servono: niente uso senza connessione, notifiche o pubblicazione negli store. Si riconsiderano solo se emergono bisogni nuovi.
- Una **PWA** (app installabile) richiede HTTPS: si valuta insieme alla produzione.
- Pagina **Statistiche**: dopo, quando l'app è stabile.

### Produzione (server dell'ufficio con Windows Server)
Opzioni da valutare, dalla più semplice:
1. **Applicazione e PostgreSQL come servizi di Windows**, senza Docker.
2. **Macchina virtuale Linux su Hyper-V** con Docker Compose all'interno.
3. **WSL2 con Docker**: possibile, ma delicato (avvio automatico, rete, versione di Windows Server).
4. Una macchina Linux dedicata.

Il server è una macchina fisica dedicata (non virtualizzata). Da chiarire: versione di Windows Server, se l'hardware supporta la virtualizzazione (serve per Hyper-V), chi la amministra e come si fanno i backup.

- [ ] Immagini Docker (applicazione e database) e `docker-compose`, con volumi per i dati e i documenti. Si impara prima sul computer di sviluppo.
- [ ] HTTPS sulla rete interna (certificato interno o nome di dominio con certificato pubblico)
- [ ] VPN per l'accesso da fuori, da configurare da zero (indipendente dall'app: login e permessi restano necessari)
- [ ] Copie di sicurezza automatiche del database e dei documenti
- [ ] GitHub Actions per test e lint automatici

Il momento giusto per l'immagine di produzione è dopo la tappa 3, per non rifarla quando cambia il server. Un `docker-compose` con solo PostgreSQL può invece servire già nella tappa 2.

## Idee future

- Protezione del branch `main` con review obbligatoria
- Un secondo piccolo progetto con MongoDB, per imparare il modello a documenti
