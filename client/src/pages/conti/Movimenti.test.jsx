import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Movimenti from './Movimenti.jsx'
import { trasferimenti } from '../../mocks/conti.js'
import { formatEuro } from '../../utils/format.js'

const norm = (testo) => testo.replace(/\u00A0/g, ' ')

describe('Movimenti conti', () => {
  it('mostra i trasferimenti e il primo nel form', () => {
    render(<Movimenti />)

    expect(screen.getAllByRole('row')).toHaveLength(trasferimenti.length + 1)
    expect(screen.getByLabelText('Descrizione')).toHaveValue('Prelievo per la cassa')
    expect(screen.getByLabelText('Conto uscita')).toHaveValue('Conto corrente')
    expect(screen.getByLabelText('Conto ingresso')).toHaveValue('Cassa')
  })

  it('selezionando una riga il form mostra i suoi dati', async () => {
    const user = userEvent.setup()
    render(<Movimenti />)

    await user.click(screen.getByText('Ricarica carta'))

    expect(screen.getByLabelText('Descrizione')).toHaveValue('Ricarica carta')
    expect(screen.getByLabelText('Importo')).toHaveValue(formatEuro(50000))
  })

  it('mostra il totale dei trasferimenti', () => {
    render(<Movimenti />)

    const totale = trasferimenti.reduce((somma, t) => somma + t.importo, 0)
    expect(screen.getByText('Totale').nextElementSibling).toHaveTextContent(norm(formatEuro(totale)))
  })

  it('ha i pulsanti Filtra movimenti, Stampa e Ricalcola', () => {
    render(<Movimenti />)

    for (const nome of ['Filtra movimenti', 'Stampa', 'Ricalcola']) {
      expect(screen.getByRole('button', { name: nome })).toBeInTheDocument()
    }
  })
})