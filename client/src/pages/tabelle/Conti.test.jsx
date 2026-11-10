import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Conti from './Conti.jsx'

describe('Conti', () => {
  it('parte con il primo conto selezionato', () => {
    render(<Conti />)

    expect(screen.getByLabelText('Nome')).toHaveValue('Cassa')
  })

  it('selezionando una riga il form mostra i suoi dati', async () => {
    const user = userEvent.setup()
    render(<Conti />)

    await user.click(screen.getByText('Conto corrente'))

    expect(screen.getByLabelText('Nome')).toHaveValue('Conto corrente')
    expect(screen.getByLabelText('Num. conto')).toHaveValue('000123')
    expect(screen.getByLabelText('Archiviato')).not.toBeChecked()
  })

  it('segna come archiviato un conto archiviato', async () => {
    const user = userEvent.setup()
    render(<Conti />)

    await user.click(screen.getByText('Conto deposito'))

    expect(screen.getByLabelText('Archiviato')).toBeChecked()
  })

  it('Registra e Annulla sono disattivati', () => {
    render(<Conti />)

    expect(screen.getByRole('button', { name: 'Registra' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Annulla' })).toBeDisabled()
  })

  it('mostra in grigio i conti archiviati', () => {
    render(<Conti/>)

    expect(screen.getByText('Conto deposito').closest('tr')).toHaveClass('row-muted')
    expect(screen.getByText('Cassa').closest('tr')).not.toHaveClass('row-muted')
  })
})