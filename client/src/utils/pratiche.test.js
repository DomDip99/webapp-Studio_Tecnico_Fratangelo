import { describe, it, expect } from 'vitest'
import { isConclusa, totaliPratiche } from './pratiche.js'

const pratica = (extra) => ({
  importoRichiesto: 1000,
  incassato: 400,
  speseSostenute: 50,
  statoPratica: 'In corso',
  ...extra,
})

describe('isConclusa', () => {
  it('una pratica in corso o sospesa non è conclusa', () => {
    expect(isConclusa(pratica({ statoPratica: 'In corso' }))).toBe(false)
    expect(isConclusa(pratica({ statoPratica: 'Sospesa' }))).toBe(false)
  })

  it('una pratica completata è conclusa, anche se non saldata', () => {
    expect(isConclusa(pratica({ statoPratica: 'Completata' }))).toBe(true)
    expect(isConclusa(pratica({ statoPratica: 'Completata e saldata' }))).toBe(true)
  })
})

describe('totaliPratiche', () => {
  it('somma richiesto, incassato e spese e calcola il residuo', () => {
    const elenco = [pratica(), pratica({ importoRichiesto: 2000, incassato: 2000, speseSostenute: 100 })]

    expect(totaliPratiche(elenco)).toEqual({
      richiesto: 3000,
      incassato: 2400,
      spese: 150,
      daIncassare: 600,
    })
  })

  it('con un elenco vuoto restituisce tutti zeri', () => {
    expect(totaliPratiche([])).toEqual({ richiesto: 0, incassato: 0, spese: 0, daIncassare: 0 })
  })
})