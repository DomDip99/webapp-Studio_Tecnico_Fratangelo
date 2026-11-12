// Somma gli importi (in centesimi) di un elenco di movimenti, divisi per stato di pagamento
export function calcolaTotali(movimenti) {
  const t = { entrateIncassate: 0, entrateNonIncassate: 0, uscitePagate: 0, usciteNonPagate: 0 }

  for (const m of movimenti) {
    if (m.entrata) t[m.pagata ? 'entrateIncassate' : 'entrateNonIncassate'] += m.entrata
    if (m.uscita) t[m.pagata ? 'uscitePagate' : 'usciteNonPagate'] += m.uscita
  }

  return {
    ...t,
    totaleEntrate: t.entrateIncassate + t.entrateNonIncassate,
    totaleUscite: t.uscitePagate + t.usciteNonPagate,
  }
}