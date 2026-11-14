import { describe, it, expect } from 'vitest'
import { riepilogoPiano } from './rate.js'

const rate = [
  { data: '2026-01-10', uscita: 1000, entrata: null, pagata: true },
  { data: '2026-02-10', uscita: 1000, entrata: null, pagata: true },
  { data: '2026-04-10', uscita: 1000, entrata: null, pagata: false },
  { data: '2026-03-10', uscita: 1000, entrata: null, pagata: false },
]

describe('riepilogoPiano', () => {
  it('conta le rate pagate e calcola saldato e residuo', () => {
    expect(riepilogoPiano(rate)).toMatchObject({
      totale: 4,
      pagate: 2,
      saldato: 2000,
      residuo: 2000,
    })
  })

  it('la prossima scadenza è la prima data tra le rate non pagate', () => {
    expect(riepilogoPiano(rate).prossimaScadenza).toBe('2026-03-10')
  })

  it('con tutte le rate pagate non c\'è una prossima scadenza', () => {
    const concluse = rate.map((r) => ({ ...r, pagata: true }))

    expect(riepilogoPiano(concluse)).toMatchObject({ residuo: 0, prossimaScadenza: null })
  })

  it('somma anche le rate in entrata', () => {
    const entrate = [{ data: '2026-01-05', uscita: null, entrata: 20000, pagata: true }]

    expect(riepilogoPiano(entrate).saldato).toBe(20000)
  })
})