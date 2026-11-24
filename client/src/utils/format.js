const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', useGrouping: 'always' })

// Gli importi sono in centesimi interi (1999 = 19,99 €)
export function formatEuro(centesimi) {
  if (centesimi == null) return ''
  return euro.format(centesimi / 100)
}

const numero = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: 'always',
})

// 123456 -> "1.234,56" (senza simbolo dell'euro, adatto ai campi di testo)
export function formatNumero(centesimi) {
  return numero.format((centesimi ?? 0) / 100)
}

// "1.234,56" -> 123456. La virgola è il separatore decimale e il punto quello delle migliaia;
// senza virgola un punto è trattato come decimale ("1000.50"). Un testo non valido vale 0.
export function parseEuro(testo) {
  const pulito = String(testo).replace(/[^\d,.-]/g, '')
  const normalizzato = pulito.includes(',') ? pulito.replace(/\./g, '').replace(',', '.') : pulito
  const valore = Number.parseFloat(normalizzato)
  return Number.isFinite(valore) ? Math.round(valore * 100) : 0
}