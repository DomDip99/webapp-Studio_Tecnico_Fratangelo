import { movimenti } from './movimenti.js'

// Dati inventati. Estendono i movimenti della prima nota con il titolare e i collegamenti
// (rata, pratica, incasso da cliente, movimento virtuale). Importi in centesimi.
const titolari = {
  1: 'Laura Bianchi', 2: 'Laura Bianchi', 3: 'Paolo Verdi', 4: 'Paolo Verdi', 5: 'Mario Rossi',
  6: 'Mario Rossi', 7: 'Mario Rossi', 8: 'Mario Rossi', 9: 'Laura Bianchi',
}

const speciali = {
  5: { incasCli: true },
  6: { rateo: true },
  8: { rateo: true },
}

const aggiuntivi = [
  { id: 10, data: '2026-06-18', descrizione: 'Alfa Costruzioni S.r.l.', note: 'Acconto pratica ristrutturazione', voce: 'Clienti', sottovoce: 'Parcelle', operazione: 'Incasso bonifico bancario', conto: 'Conto corrente', entrata: 150000, uscita: null, pagata: true, doc: true, titolare: 'Laura Bianchi', rateo: false, pratica: true, incasCli: true, virtuale: false },
  { id: 11, data: '2026-07-20', descrizione: 'Previsione spese trasferta', note: 'Voce di previsione', voce: 'Ufficio', sottovoce: 'Cancelleria', operazione: 'Contanti', conto: 'Cassa', entrata: null, uscita: 20000, pagata: false, doc: false, titolare: 'Anna Neri', rateo: false, pratica: false, incasCli: false, virtuale: true },
]

export const movimentiRicerca = [
  ...movimenti.map((m) => ({
    titolare: titolari[m.id],
    rateo: false,
    pratica: false,
    incasCli: false,
    virtuale: false,
    ...m,
    ...speciali[m.id],
  })),
  ...aggiuntivi,
]