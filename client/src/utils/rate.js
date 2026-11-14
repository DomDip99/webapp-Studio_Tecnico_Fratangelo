const importo = (rata) => rata.entrata ?? rata.uscita ?? 0

// Sintesi di un piano a partire dalle sue rate (importi in centesimi)
export function riepilogoPiano(rateDelPiano) {
  const pagate = rateDelPiano.filter((r) => r.pagata)
  const daPagare = rateDelPiano.filter((r) => !r.pagata)

  return {
    totale: rateDelPiano.length,
    pagate: pagate.length,
    saldato: pagate.reduce((somma, r) => somma + importo(r), 0),
    residuo: daPagare.reduce((somma, r) => somma + importo(r), 0),
    // le date sono in formato ISO, quindi si ordinano anche come testo
    prossimaScadenza: daPagare.map((r) => r.data).sort()[0] ?? null,
  }
}