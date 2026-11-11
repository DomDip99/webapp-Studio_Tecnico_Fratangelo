import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Clienti from './Clienti.jsx'

describe('Clienti', () => {
  it('parte con il primo cliente selezionato', () => {
    render(<Clienti />)

    expect(screen.getByLabelText('Nome')).toHaveValue('Alfa Costruzioni S.r.l.')
    expect(screen.getByLabelText('Città')).toHaveValue('Torino')
  })

  it('selezionando una riga il form mostra i dati del cliente', async () => {
    const user = userEvent.setup()
    render(<Clienti />)

    await user.click(screen.getByText('Beta Servizi S.n.c.'))

    expect(screen.getByLabelText('Nome')).toHaveValue('Beta Servizi S.n.c.')
    expect(screen.getByLabelText('Città')).toHaveValue('Milano')
    expect(screen.getByLabelText('Intestatario')).toHaveValue('Laura Bianchi')
  })

  it('un cliente senza intestatario mostra il campo vuoto', async () => {
    const user = userEvent.setup()
    render(<Clienti />)

    await user.click(screen.getByText('Gamma Studio Associato'))

    expect(screen.getByLabelText('Intestatario')).toHaveValue('')
  })

  it('segna i clienti archiviati', async () => {
    const user = userEvent.setup()
    render(<Clienti />)

    expect(screen.getByText('Delta Impianti S.p.A.').closest('tr')).toHaveClass('row-muted')

    await user.click(screen.getByText('Delta Impianti S.p.A.'))

    expect(screen.getByLabelText('Archiviato')).toBeChecked()
  })
})