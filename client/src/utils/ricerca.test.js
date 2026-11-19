import { describe, it, expect } from 'vitest'
import { FILTRI_VUOTI, filtraMovimenti, subtotaliPerVoce } from './ricerca.js'

const base = {
  data: '2026-05-10',
  descrizione: 'Prova',
  voce: 'Ufficio',
  sottovoce: 'Telefono',
  operazione: 'Contanti',
  conto: 'Cassa',
  titolare: 'Anna',
  pagata: true,
  entrata: null,
  uscita: 100,
  rateo: false,
  pratica: false,
  incasCli: false,
  virtuale: false,
}
const mov = (id, extra) => ({ id, ...base, ...extra })

const filtra = (movimenti, filtri = {}, soloDaPagare = false) =>
  filtraMovimenti(movimenti, { ...FILTRI_VUOTI, ...filtri }, soloDaPagare)
const ids = (lista) => lista.map((m) => m.id)

describe('filtraMovimenti', () => {
  const movimenti = [
    mov(1, { descrizione: 'Caffè Esempio', data: '2026-03-10' }),
    mov(2, { descrizione: 'Toner Print', data: '2026-05-10', voce: 'Casa', sottovoce: 'Utenze', pagata: false }),
    mov(3, { descrizione: 'Rata affitto', data: '2026-07-01', rateo: true, conto: 'Banca', titolare: 'Mario', operazione: 'Bonifico' }),
    mov(4, { descrizione: 'Previsione', virtuale: true }),
  ]

  it('senza filtri mostra tutti i movimenti tranne i virtuali', () => {
    expect(ids(filtra(movimenti))).toEqual([1, 2, 3])
  })

  it('cerca nella descrizione senza distinguere maiuscole', () => {
    expect(ids(filtra(movimenti, { descrizione: 'TONER' }))).toEqual([2])
    expect(ids(filtra(movimenti, { descrizione: ' caff' }))).toEqual([1])
  })

  it('il periodo include gli estremi', () => {
    expect(ids(filtra(movimenti, { dataInizio: '2026-05-10', dataFine: '2026-07-01' }))).toEqual([2, 3])
    expect(ids(filtra(movimenti, { dataFine: '2026-03-10' }))).toEqual([1])
  })

  it('filtra per voce, sottovoce, titolare, operazione e conto', () => {
    expect(ids(filtra(movimenti, { voce: 'Casa' }))).toEqual([2])
    expect(ids(filtra(movimenti, { sottovoce: 'Utenze' }))).toEqual([2])
    expect(ids(filtra(movimenti, { titolare: 'Mario' }))).toEqual([3])
    expect(ids(filtra(movimenti, { operazione: 'Bonifico' }))).toEqual([3])
    expect(ids(filtra(movimenti, { conto: 'Banca' }))).toEqual([3])
  })

  it('Pag. e Non pag. restringono solo se ne è spuntata una', () => {
    expect(ids(filtra(movimenti, { pagati: true }))).toEqual([1, 3])
    expect(ids(filtra(movimenti, { nonPagati: true }))).toEqual([2])
    expect(ids(filtra(movimenti, { pagati: true, nonPagati: true }))).toEqual([1, 2, 3])
  })

  it('"solo voci da pagare" tiene i movimenti non pagati', () => {
    expect(ids(filtra(movimenti, {}, true))).toEqual([2])
  })

  it('Rateo, Pratica e Incas. cli. tengono i movimenti collegati', () => {
    expect(ids(filtra(movimenti, { rateo: true }))).toEqual([3])
    expect(ids(filtra(movimenti, { pratica: true }))).toEqual([])
    expect(ids(filtra(movimenti, { incasCli: true }))).toEqual([])
  })

  it('i virtuali compaiono solo se richiesti', () => {
    expect(ids(filtra(movimenti, { inclVirtuali: true }))).toEqual([1, 2, 3, 4])
    expect(ids(filtra(movimenti, { soloVirtuali: true }))).toEqual([4])
  })

  it('combina più filtri', () => {
    expect(ids(filtra(movimenti, { dataInizio: '2026-04-01', pagati: true }))).toEqual([3])
  })
})

describe('subtotaliPerVoce', () => {
  it('somma entrate e uscite per voce e sottovoce, in ordine alfabetico', () => {
    const righe = subtotaliPerVoce([
      mov(1, { voce: 'Ufficio', sottovoce: 'Telefono', uscita: 100 }),
      mov(2, { voce: 'Ufficio', sottovoce: 'Telefono', uscita: 50 }),
      mov(3, { voce: 'Casa', sottovoce: 'Utenze', entrata: 500, uscita: null }),
    ])

    expect(righe).toEqual([
      { id: 'Casa / Utenze', voce: 'Casa', sottovoce: 'Utenze', entrate: 500, uscite: 0, saldo: 500 },
      { id: 'Ufficio / Telefono', voce: 'Ufficio', sottovoce: 'Telefono', entrate: 0, uscite: 150, saldo: -150 },
    ])
  })

  it('con nessun movimento restituisce un elenco vuoto', () => {
    expect(subtotaliPerVoce([])).toEqual([])
  })
})