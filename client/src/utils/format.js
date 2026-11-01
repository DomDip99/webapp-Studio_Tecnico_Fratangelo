const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

// Gli importi sono in centesimi interi (1999 = 19,99 €)
export function formatEuro(centesimi) {
  if (centesimi == null) return ''
  return euro.format(centesimi / 100)
}