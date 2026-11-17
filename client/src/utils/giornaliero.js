import dayjs from 'dayjs'
import { formatoISO } from './calendario.js'

const NUMERI = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci']

// "quanti" giorni consecutivi a partire da "inizio" (date ISO)
export const giorniConsecutivi = (inizio, quanti) =>
  Array.from({ length: quanti }, (_, i) => formatoISO(dayjs(inizio).add(i, 'day')))

export const movimentiDelGiorno = (movimenti, iso) => movimenti.filter((m) => m.data === iso)

// "Oggi", "Domani", "Tra due giorni"...
export function etichettaRelativa(iso, oggi) {
  const differenza = dayjs(iso).diff(dayjs(oggi), 'day')

  if (differenza === 0) return 'Oggi'
  if (differenza === 1) return 'Domani'
  if (differenza === -1) return 'Ieri'
  if (differenza > 1) return `Tra ${NUMERI[differenza] ?? differenza} giorni`
  return `${Math.abs(differenza)} giorni fa`
}