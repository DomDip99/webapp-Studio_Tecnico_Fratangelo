import dayjs from 'dayjs'

// Dati inventati, con date calcolate rispetto a "oggi" così ci sono sempre scadenze vicine.
// Importi in centesimi.
const modelli = [
  { giorni: -2, descrizione: 'Caffè Esempio S.a.s.', operazione: 'Pagamento con assegno', conto: 'Conto corrente', uscita: 9120, pagata: false },
  { giorni: 0, descrizione: 'Telefonia Demo', operazione: 'Addebito in Banca', conto: 'Conto corrente', uscita: 4560, pagata: false },
  { giorni: 0, descrizione: 'Cliente Prova S.r.l.', operazione: 'Ricevuta Bancaria', conto: 'Conto corrente', entrata: 80000, pagata: false },
  { giorni: 1, descrizione: 'Cartoleria Demo S.r.l.', operazione: 'Pagobancomat', conto: 'Cassa', uscita: 2350, pagata: true },
  { giorni: 3, descrizione: 'Locatore Demo', operazione: 'Addebito in Banca', conto: 'Conto corrente', uscita: 75000, pagata: false },
  { giorni: 4, descrizione: 'Servizio Streaming', operazione: 'Carta Di Credito', conto: 'Carta di credito', uscita: 1299, pagata: false },
  { giorni: 7, descrizione: 'Alfa Costruzioni S.r.l.', operazione: 'Ricevuta Bancaria', conto: 'Conto corrente', entrata: 150000, pagata: false },
]

export function scadenze(oggi) {
  return modelli.map(({ giorni, ...resto }, i) => ({
    id: `scadenza-${i + 1}`,
    data: dayjs(oggi).add(giorni, 'day').format('YYYY-MM-DD'),
    entrata: null,
    uscita: null,
    ...resto,
  }))
}