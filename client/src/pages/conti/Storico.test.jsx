import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Storico from './Storico.jsx'

const OGGI = '2026-11-04'

const righeTabella = (indice) =>
  within(screen.getAllByRole('table')[indice]).getAllByRole('row').length - 1

describe('Storico', () => {
  it('mostra i movimenti del conto selezionato per il giorno di oggi', () => {
    render(<Storico oggi={OGGI} />)

    expect(
      screen.getByRole('heading', { level: 3, name: '04 novembre 2026 - mercoledì' }),
    ).toBeInTheDocument()
    // oggi la Cassa non ha movimenti: la tabella lo dice
    expect(within(screen.getAllByRole('table')[0]).getByText('Nessun elemento')).toBeInTheDocument()
  })

  it('cambiando conto cambiano i movimenti del giorno', async () => {
    const user = userEvent.setup()
    render(<Storico oggi={OGGI} />)

    await user.click(screen.getByRole('button', { name: 'Conto corrente' }))

    expect(screen.getByText('Telefonia Demo')).toBeInTheDocument()
    expect(screen.getByText('Cliente Prova S.r.l.')).toBeInTheDocument()
    expect(righeTabella(0)).toBe(2)
  })

  it('cambiando giorno cambiano i movimenti', async () => {
    const user = userEvent.setup()
    render(<Storico oggi={OGGI} />)

    await user.click(screen.getByRole('button', { name: 'Cassa' }))
    await user.click(screen.getByRole('button', { name: '05 novembre 2026 - giovedì' }))

    expect(screen.getByText('Cartoleria Demo S.r.l.')).toBeInTheDocument()
  })

  it('mostra i trasferimenti del giorno che riguardano il conto', async () => {
    const user = userEvent.setup()
    render(<Storico oggi='2026-03-15' />)

    await user.click(screen.getByRole('button', { name: 'Conto corrente' }))

    expect(screen.getByText('Prelievo per la cassa')).toBeInTheDocument()
  })
})