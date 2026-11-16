import dayjs from 'dayjs'

export const MESI = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]
export const GIORNI = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica']
export const GIORNI_BREVI = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom']

// dayjs conta i giorni da domenica (0): qui si parte dal lunedì (0)
const indiceGiorno = (data) => (dayjs(data).day() + 6) % 7

export const formatoISO = (data) => dayjs(data).format('YYYY-MM-DD')
export const nomeGiorno = (iso) => GIORNI[indiceGiorno(iso)]
export const nomeMese = (iso) => MESI[dayjs(iso).month()]

// "04 novembre 2026 - mercoledì"
export function etichettaGiorno(iso) {
  const d = dayjs(iso)
  return `${d.format('DD')} ${nomeMese(iso).toLowerCase()} ${d.year()} - ${nomeGiorno(iso)}`
}

// Tutti i giorni del mese di "iso", come date ISO
export function giorniDelMese(iso) {
  const inizio = dayjs(iso).startOf('month')
  return Array.from({ length: inizio.daysInMonth() }, (_, i) => formatoISO(inizio.add(i, 'day')))
}

// Le settimane (righe da 7 giorni, da lunedì a domenica) che coprono il mese di "iso"
export function settimaneDelMese(iso) {
  const primo = dayjs(iso).startOf('month')
  const inizioGriglia = primo.subtract(indiceGiorno(primo), 'day')
  const numeroSettimane = Math.ceil((indiceGiorno(primo) + primo.daysInMonth()) / 7)

  return Array.from({ length: numeroSettimane }, (_, w) =>
    Array.from({ length: 7 }, (_, g) => {
      const giorno = inizioGriglia.add(w * 7 + g, 'day')
      return { iso: formatoISO(giorno), delMese: giorno.month() === primo.month() }
    }),
  )
}