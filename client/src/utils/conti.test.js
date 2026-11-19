import { describe, it, expect } from 'vitest'
import { calcolaSaldo } from './conti.js'

describe('calcolaSaldo', () => {
  const movimenti = [
    { conto: 'Cassa', entrata: 1000, uscita: null, pagata: true },
    { conto: 'Cassa', entrata: null, uscita: 300, pagata: true },
    { conto: 'Cassa', entrata: null, uscita: 500, pagata: false },
    { conto: 'Banca', entrata: 9999, uscita: null, pagata: true },
  ]

  it('somma le entrate e sottrae le uscite pagate del conto', () => {
    expect(calcolaSaldo(2000, movimenti, [], 'Cassa')).toBe(2700)
  })

  it('ignora i movimenti non ancora pagati e quelli di altri conti', () => {
    expect(calcolaSaldo(0, movimenti, [], 'Cassa')).toBe(700)
    expect(calcolaSaldo(0, movimenti, [], 'Banca')).toBe(9999)
  })

  it('tiene conto dei trasferimenti in entrata e in uscita', () => {
    const trasferimenti = [
      { contoUscita: 'Banca', contoIngresso: 'Cassa', importo: 400 },
      { contoUscita: 'Cassa', contoIngresso: 'Banca', importo: 100 },
    ]

    expect(calcolaSaldo(0, movimenti, trasferimenti, 'Cassa')).toBe(700 + 400 - 100)
    expect(calcolaSaldo(0, movimenti, trasferimenti, 'Banca')).toBe(9999 - 400 + 100)
  })

  it('senza movimenti il saldo è quello iniziale', () => {
    expect(calcolaSaldo(5000, [], [], 'Cassa')).toBe(5000)
  })
})