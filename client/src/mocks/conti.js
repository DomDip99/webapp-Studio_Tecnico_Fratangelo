// Dati inventati. Importi in centesimi.
export const situazioniIniziali = [
  { id: 1, conto: 'Cassa', numero: '', dataIniziale: '2026-01-01', importoIniziale: 50000, dataVerifica: '2026-06-30', importoVerifica: 38200 },
  { id: 2, conto: 'Conto corrente', numero: '000123', dataIniziale: '2026-01-01', importoIniziale: 1200000, dataVerifica: '2026-06-30', importoVerifica: 1485000 },
  { id: 3, conto: 'Carta di credito', numero: '000456', dataIniziale: '2026-01-01', importoIniziale: 0, dataVerifica: '', importoVerifica: 0 },
]

// Trasferimenti di denaro tra due conti
export const trasferimenti = [
  { id: 1, data: '2026-03-15', contoUscita: 'Conto corrente', contoIngresso: 'Cassa', descrizione: 'Prelievo per la cassa', importo: 30000 },
  { id: 2, data: '2026-04-30', contoUscita: 'Conto corrente', contoIngresso: 'Carta di credito', descrizione: 'Ricarica carta', importo: 50000 },
  { id: 3, data: '2026-06-10', contoUscita: 'Cassa', contoIngresso: 'Conto corrente', descrizione: 'Versamento incassi', importo: 20000 },
]