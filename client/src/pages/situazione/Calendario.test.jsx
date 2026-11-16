import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Calendario from './Calendario.jsx'

describe('Calendario', () => {
  it('parte dal giorno di oggi', () => {
    render(<Calendario oggi='2026-11-04' />)

    expect(
      screen.getByRole('heading', { level: 3, name: '04 novembre 2026 - mercoledì' }),
    ).toBeInTheDocument()
  })

  it('scegliendo un altro giorno il titolo cambia', async () => {
    const user = userEvent.setup()
    render(<Calendario oggi='2026-11-04' />)

    await user.click(screen.getByRole('button', { name: '10 novembre 2026 - martedì' }))

    expect(
      screen.getByRole('heading', { level: 3, name: '10 novembre 2026 - martedì' }),
    ).toBeInTheDocument()
  })

  it('cambiando mese con le frecce cambia anche il giorno mostrato', async () => {
    const user = userEvent.setup()
    render(<Calendario oggi='2026-11-04' />)

    await user.click(screen.getByRole('button', { name: 'Mese successivo' }))

    expect(
      screen.getByRole('heading', { level: 3, name: '04 dicembre 2026 - venerdì' }),
    ).toBeInTheDocument()
  })
})