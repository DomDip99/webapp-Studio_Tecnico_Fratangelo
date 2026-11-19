import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Calendario from './Calendario.jsx'
import { renderWithOutlet } from '../../test/renderWithOutlet.jsx'
import { scadenze } from '../../mocks/scadenze.js'

const OGGI = '2026-11-04'
const contaRighe = () => screen.getAllByRole('row').length - 1
const delGiorno = (iso) => scadenze(OGGI).filter((m) => m.data === iso)

describe('Calendario', () => {
  it('parte dal giorno di oggi con i suoi movimenti', () => {
    renderWithOutlet(<Calendario oggi={OGGI} />)

    expect(
      screen.getByRole('heading', { level: 3, name: '04 novembre 2026 - mercoledì' }),
    ).toBeInTheDocument()
    expect(contaRighe()).toBe(delGiorno('2026-11-04').length)
    expect(screen.getByText('Telefonia Demo')).toBeInTheDocument()
  })

  it('scegliendo un altro giorno cambiano titolo e movimenti', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Calendario oggi={OGGI} />)

    await user.click(screen.getByRole('button', { name: '07 novembre 2026 - sabato' }))

    expect(
      screen.getByRole('heading', { level: 3, name: '07 novembre 2026 - sabato' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Locatore Demo')).toBeInTheDocument()
    expect(screen.queryByText('Telefonia Demo')).not.toBeInTheDocument()
  })

  it('un giorno senza movimenti mostra un messaggio', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Calendario oggi={OGGI} />)

    await user.click(screen.getByRole('button', { name: '06 novembre 2026 - venerdì' }))

    expect(screen.getByText('Nessun elemento')).toBeInTheDocument()
  })

  it('"Mostra 5 giorni consecutivi" copre il giorno scelto e i quattro successivi', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Calendario oggi={OGGI} />)

    await user.click(screen.getByRole('button', { name: 'Mostra 5 giorni consecutivi' }))

    const attesi = ['2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08'].flatMap(
      delGiorno,
    )
    expect(contaRighe()).toBe(attesi.length)
    expect(screen.getByRole('heading', { level: 3, name: 'Dal 04/11/2026 al 08/11/2026' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Mostra 5 giorni consecutivi' }))
    expect(contaRighe()).toBe(delGiorno('2026-11-04').length)
  })

  it('con "solo voci da pagare" nasconde i movimenti pagati', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Calendario oggi={OGGI} />, { soloDaPagare: true })

    // il 5 novembre c'è un solo movimento, già pagato
    await user.click(screen.getByRole('button', { name: '05 novembre 2026 - giovedì' }))

    expect(screen.queryByText('Cartoleria Demo S.r.l.')).not.toBeInTheDocument()
    expect(screen.getByText('Nessun elemento')).toBeInTheDocument()
  })

  it('cambiando mese con le frecce cambia anche il giorno mostrato', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Calendario oggi={OGGI} />)

    await user.click(screen.getByRole('button', { name: 'Mese successivo' }))

    expect(
      screen.getByRole('heading', { level: 3, name: '04 dicembre 2026 - venerdì' }),
    ).toBeInTheDocument()
  })
})