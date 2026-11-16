import { describe, it, expect } from 'vitest'
import { etichettaGiorno, giorniDelMese, nomeGiorno, settimaneDelMese } from './calendario.js'

describe('nomeGiorno', () => {
  it('parte dal lunedì', () => {
    expect(nomeGiorno('2026-11-02')).toBe('lunedì')
    expect(nomeGiorno('2026-11-01')).toBe('domenica')
  })
})

describe('etichettaGiorno', () => {
  it('scrive data e giorno della settimana in italiano', () => {
    expect(etichettaGiorno('2026-11-04')).toBe('04 novembre 2026 - mercoledì')
  })
})

describe('giorniDelMese', () => {
  it('restituisce tutti i giorni del mese', () => {
    const giorni = giorniDelMese('2026-11-15')

    expect(giorni).toHaveLength(30)
    expect(giorni[0]).toBe('2026-11-01')
    expect(giorni[29]).toBe('2026-11-30')
  })

  it('gestisce gli anni bisestili', () => {
    expect(giorniDelMese('2028-02-10')).toHaveLength(29)
    expect(giorniDelMese('2027-02-10')).toHaveLength(28)
  })
})

describe('settimaneDelMese', () => {
  it('novembre 2026 occupa sei settimane, da lunedì a domenica', () => {
    const settimane = settimaneDelMese('2026-11-04')

    expect(settimane).toHaveLength(6)
    expect(settimane.every((settimana) => settimana.length === 7)).toBe(true)
    // la prima riga inizia con il lunedì 26 ottobre, che non è del mese
    expect(settimane[0][0]).toEqual({ iso: '2026-10-26', delMese: false })
    expect(settimane[0][6]).toEqual({ iso: '2026-11-01', delMese: true })
    expect(settimane[5][6].iso).toBe('2026-12-06')
  })

  it('febbraio 2027 inizia di lunedì e occupa quattro settimane piene', () => {
    const settimane = settimaneDelMese('2027-02-10')

    expect(settimane).toHaveLength(4)
    expect(settimane.flat().every((giorno) => giorno.delMese)).toBe(true)
  })
})