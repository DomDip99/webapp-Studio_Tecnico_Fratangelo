import { describe, it, expect } from 'vitest'
import { etichettaRelativa, giorniConsecutivi, movimentiDelGiorno } from './giornaliero.js'

describe('giorniConsecutivi', () => {
  it('restituisce i giorni di seguito, anche a cavallo di due mesi', () => {
    expect(giorniConsecutivi('2026-11-29', 3)).toEqual(['2026-11-29', '2026-11-30', '2026-12-01'])
  })
})

describe('movimentiDelGiorno', () => {
  it('tiene solo i movimenti della data richiesta', () => {
    const movimenti = [
      { id: 1, data: '2026-11-04' },
      { id: 2, data: '2026-11-05' },
      { id: 3, data: '2026-11-04' },
    ]

    expect(movimentiDelGiorno(movimenti, '2026-11-04').map((m) => m.id)).toEqual([1, 3])
  })
})

describe('etichettaRelativa', () => {
  const oggi = '2026-11-04'

  it('usa Oggi, Domani e Ieri', () => {
    expect(etichettaRelativa('2026-11-04', oggi)).toBe('Oggi')
    expect(etichettaRelativa('2026-11-05', oggi)).toBe('Domani')
    expect(etichettaRelativa('2026-11-03', oggi)).toBe('Ieri')
  })

  it('scrive i giorni futuri a parole fino a dieci', () => {
    expect(etichettaRelativa('2026-11-06', oggi)).toBe('Tra due giorni')
    expect(etichettaRelativa('2026-11-08', oggi)).toBe('Tra quattro giorni')
    expect(etichettaRelativa('2026-11-14', oggi)).toBe('Tra dieci giorni')
    expect(etichettaRelativa('2026-11-16', oggi)).toBe('Tra 12 giorni')
  })

  it('indica i giorni passati', () => {
    expect(etichettaRelativa('2026-11-01', oggi)).toBe('3 giorni fa')
  })
})