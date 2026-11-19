// Importi in centesimi. Un movimento conta nel saldo solo quando è pagato.
export function calcolaSaldo(situazioneIniziale, movimenti, trasferimenti, conto) {
  const delConto = movimenti.filter((m) => m.conto === conto && m.pagata)
  const entrate = delConto.reduce((somma, m) => somma + (m.entrata ?? 0), 0)
  const uscite = delConto.reduce((somma, m) => somma + (m.uscita ?? 0), 0)

  const ricevuti = trasferimenti
    .filter((t) => t.contoIngresso === conto)
    .reduce((somma, t) => somma + t.importo, 0)
  const inviati = trasferimenti
    .filter((t) => t.contoUscita === conto)
    .reduce((somma, t) => somma + t.importo, 0)

  return situazioneIniziale + entrate - uscite + ricevuti - inviati
}