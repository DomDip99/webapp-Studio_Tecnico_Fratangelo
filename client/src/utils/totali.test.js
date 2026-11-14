import { describe, it, expect } from 'vitest'
import { calcolaTotali } from './totali.js'

describe('calcolaTotali', () => {
  it('divide entrate e uscite per stato di pagamento', () => {
    const movimenti = [
      { entrata: 10000, uscita: null, pagata: true },
      { entrata: 5000, uscita: null, pagata: false },
      { entrata: null, uscita: 3000, pagata: true },
      { entrata: null, uscita: 2000, pagata: false },
    ]

    expect(calcolaTotali(movimenti)).toEqual({
      entrateIncassate: 10000,
      entrateNonIncassate: 5000,
      uscitePagate: 3000,
      usciteNonPagate: 2000,
      totaleEntrate: 15000,
      totaleUscite: 5000,
    })
  })

  it('con un elenco vuoto restituisce tutti zeri', () => {
    expect(calcolaTotali([])).toEqual({
      entrateIncassate: 0,
      entrateNonIncassate: 0,
      uscitePagate: 0,
      usciteNonPagate: 0,
      totaleEntrate: 0,
      totaleUscite: 0,
    })
  })
})