// Percentuali usate nel calcolo (ipotesi, da verificare). Un giorno le modificherà il pulsante Config.
export const ALIQUOTE = { maggiorazione: 5, iva: 22, ritenuta: 20 }

// Importi in centesimi, percentuale arrotondata al centesimo
const percento = (importo, aliquota) => Math.round((importo * aliquota) / 100)

export function calcolaFattura(
  { onorario, spese = 0, conMaggiorazione = false, conIva = false, conRitenuta = false },
  aliquote = ALIQUOTE,
) {
  const maggiorazione = conMaggiorazione ? percento(onorario, aliquote.maggiorazione) : 0
  const sommano = onorario + maggiorazione
  const iva = conIva ? percento(sommano, aliquote.iva) : 0
  const totale = sommano + iva
  const ritenuta = conRitenuta ? percento(onorario, aliquote.ritenuta) : 0
  const totaleParziale = totale - ritenuta

  return {
    maggiorazione,
    sommano,
    iva,
    totale,
    ritenuta,
    totaleParziale,
    spese,
    totaleDocumento: totaleParziale + spese,
  }
}