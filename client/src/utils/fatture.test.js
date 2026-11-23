import { describe, it, expect } from 'vitest'
import { ALIQUOTE, calcolaFattura } from './fatture.js'

const base = { onorario: 100000, spese: 5000, conMaggiorazione: true, conIva: true, conRitenuta: false }

describe('calcolaFattura', () => {
  it('calcola maggiorazione, IVA e totale', () => {
    expect(calcolaFattura(base)).toEqual({
      maggiorazione: 5000,
      sommano: 105000,
      iva: 23100,
      totale: 128100,
      ritenuta: 0,
      totaleParziale: 128100,
      spese: 5000,
      totaleDocumento: 133100,
    })
  })

  it('la ritenuta d\'acconto si calcola sull\'onorario e si sottrae', () => {
    const r = calcolaFattura({ ...base, conRitenuta: true })

    expect(r.ritenuta).toBe(20000)
    expect(r.totaleParziale).toBe(108100)
    expect(r.totaleDocumento).toBe(113100)
  })

  it('senza opzioni il totale è onorario più spese', () => {
    const r = calcolaFattura({ onorario: 100000, spese: 2500 })

    expect(r).toMatchObject({ maggiorazione: 0, iva: 0, ritenuta: 0, totale: 100000, totaleDocumento: 102500 })
  })

  it('arrotonda al centesimo', () => {
    // 19,99 * 22% = 4,3978 -> 4,40
    const r = calcolaFattura({ onorario: 1999, conIva: true })

    expect(r.iva).toBe(440)
    expect(r.totale).toBe(2439)
  })

  it('accetta percentuali diverse', () => {
    const r = calcolaFattura(base, { maggiorazione: 4, iva: 10, ritenuta: 20 })

    expect(r.maggiorazione).toBe(4000)
    expect(r.iva).toBe(10400)
  })

  it('le percentuali di default sono quelle ipotizzate', () => {
    expect(ALIQUOTE).toEqual({ maggiorazione: 5, iva: 22, ritenuta: 20 })
  })
})