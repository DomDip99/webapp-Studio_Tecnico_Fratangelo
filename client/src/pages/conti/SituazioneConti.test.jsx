import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SituazioneConti from './SituazioneConti.jsx'
import { renderWithOutlet } from '../../test/renderWithOutlet.jsx'
import { movimenti } from '../../mocks/movimenti.js'
import { situazioniIniziali, trasferimenti } from '../../mocks/conti.js'
import { calcolaSaldo } from '../../utils/conti.js'
import { formatEuro } from '../../utils/format.js'

const normSpace = (text) => text.replace(/\u00A0/g, ' ')

// Righe della seconda tabella (quella dei movimenti del conto), senza l'intestazione
const contaRigheDettaglio = () =>
  within(screen.getAllByRole('table')[1]).getAllByRole('row').length - 1

describe('SituazioneConti', () => {
  it('mostra un conto per riga con la situazione iniziale', () => {
    renderWithOutlet(<SituazioneConti />)

    const tabella = screen.getAllByRole('table')[0]
    expect(within(tabella).getAllByRole('row')).toHaveLength(situazioniIniziali.length + 1)
    expect(within(tabella).getByText(normSpace(formatEuro(1200000)))).toBeInTheDocument()
  })

  it('parte dal primo conto con i suoi movimenti', () => {
    renderWithOutlet(<SituazioneConti />)

    expect(screen.getByRole('heading', { level: 3, name: 'Cassa' })).toBeInTheDocument()
    expect(contaRigheDettaglio()).toBe(movimenti.filter((m) => m.conto === 'Cassa').length)
  })

  it('selezionando un conto cambiano movimenti e saldo finale', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<SituazioneConti />)

    await user.click(screen.getAllByText('Conto corrente')[0])

    expect(screen.getByRole('heading', { level: 3, name: 'Conto corrente' })).toBeInTheDocument()
    expect(contaRigheDettaglio()).toBe(movimenti.filter((m) => m.conto === 'Conto corrente').length)

    const saldo = calcolaSaldo(1200000, movimenti, trasferimenti, 'Conto corrente')
    expect(screen.getByText('Situazione finale').nextElementSibling).toHaveTextContent(
      normSpace(formatEuro(saldo)),
    )
  })

  it('la scheda Movimenti mostra i trasferimenti del conto', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<SituazioneConti />)

    await user.click(screen.getByRole('tab', { name: 'Movimenti' }))

    expect(await screen.findByText('Prelievo per la cassa')).toBeInTheDocument()
    expect(screen.getByText('Versamento incassi')).toBeInTheDocument()
    // la ricarica della carta non riguarda la cassa
    expect(screen.queryByText('Ricarica carta')).not.toBeInTheDocument()
  })

  it('con "solo voci da pagare" nasconde i movimenti pagati', () => {
    renderWithOutlet(<SituazioneConti />, { soloDaPagare: true })

    expect(contaRigheDettaglio()).toBe(
      movimenti.filter((m) => m.conto === 'Cassa' && !m.pagata).length || 1,
    )
  })
})