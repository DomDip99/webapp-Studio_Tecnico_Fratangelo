import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalendarioGiorni from './CalendarioGiorni.jsx'

function renderCalendario(value = '2026-11-04', oggi = '2026-11-04') {
  const onChange = vi.fn()
  render(<CalendarioGiorni value={value} onChange={onChange} oggi={oggi} />)
  return onChange
}

describe('CalendarioGiorni', () => {
  it('mostra mese e anno del giorno selezionato', () => {
    renderCalendario()

    expect(screen.getByText('novembre 2026')).toBeInTheDocument()
  })

  it("l'elenco contiene tutti i giorni del mese", () => {
    renderCalendario()

    expect(screen.getAllByRole('button', { name: /^\d{2} novembre 2026 - / })).toHaveLength(30)
  })

  it('segna il giorno selezionato', () => {
    renderCalendario()

    expect(screen.getByRole('button', { name: '04 novembre 2026 - mercoledì' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '05 novembre 2026 - giovedì' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it("scegliere un giorno dall'elenco avvisa chi usa il componente", async () => {
    const user = userEvent.setup()
    const onChange = renderCalendario()

    await user.click(screen.getByRole('button', { name: '10 novembre 2026 - martedì' }))

    expect(onChange).toHaveBeenCalledWith('2026-11-10')
  })

  it('scegliere un giorno dalla griglia avvisa chi usa il componente', async () => {
    const user = userEvent.setup()
    const onChange = renderCalendario()

    await user.click(screen.getByRole('button', { name: '15 novembre 2026' }))

    expect(onChange).toHaveBeenCalledWith('2026-11-15')
  })

  it('la griglia mostra anche i giorni dei mesi vicini', async () => {
    const user = userEvent.setup()
    const onChange = renderCalendario()

    await user.click(screen.getByRole('button', { name: '26 ottobre 2026' }))

    expect(onChange).toHaveBeenCalledWith('2026-10-26')
  })

  it('le frecce cambiano mese mantenendo il giorno', async () => {
    const user = userEvent.setup()
    const onChange = renderCalendario()

    await user.click(screen.getByRole('button', { name: 'Mese successivo' }))
    expect(onChange).toHaveBeenLastCalledWith('2026-12-04')

    await user.click(screen.getByRole('button', { name: 'Mese precedente' }))
    expect(onChange).toHaveBeenLastCalledWith('2026-10-04')
  })

  it("passando a un mese più corto il giorno si adatta all'ultimo", async () => {
    const user = userEvent.setup()
    const onChange = renderCalendario('2027-01-31', '2027-01-31')

    await user.click(screen.getByRole('button', { name: 'Mese successivo' }))

    expect(onChange).toHaveBeenCalledWith('2027-02-28')
  })

  it('il pulsante Oggi riporta alla data di oggi', async () => {
    const user = userEvent.setup()
    const onChange = renderCalendario('2026-11-20', '2026-11-04')

    await user.click(screen.getByRole('button', { name: 'Oggi: 04/11/2026' }))

    expect(onChange).toHaveBeenCalledWith('2026-11-04')
  })
})