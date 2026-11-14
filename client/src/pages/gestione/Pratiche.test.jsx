import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pratiche from './Pratiche.jsx'
import { renderWithOutlet } from '../../test/renderWithOutlet.jsx'
import { pratiche } from '../../mocks/pratiche.js'
import { totaliPratiche } from '../../utils/pratiche.js'
import { formatEuro } from '../../utils/format.js'

// Intl usa uno spazio non separabile prima di "€", mentre toHaveTextContent normalizza gli spazi
const norm = (testo) => testo.replace(/\u00A0/g, ' ')

// Righe di una delle due tabelle (0 = clienti, 1 = pratiche), senza l'intestazione
const contaRighe = (indice) =>
  within(screen.getAllByRole('table')[indice]).getAllByRole('row').length - 1

describe('Pratiche', () => {
  it('mostra i clienti e parte dal primo con le sue pratiche', () => {
    renderWithOutlet(<Pratiche />)

    expect(contaRighe(0)).toBe(4)
    // le pratiche attive del primo cliente sono 2: la terza è archiviata
    expect(contaRighe(1)).toBe(2)
    expect(screen.getByLabelText('Descrizione')).toHaveValue('Rilievo e frazionamento terreno')
  })

  it('mostra nella tabella dei clienti il numero di pratiche', () => {
    renderWithOutlet(<Pratiche />)

    const riga = screen.getByText('Alfa Costruzioni S.r.l.').closest('tr')
    expect(within(riga).getByText('2')).toBeInTheDocument()
  })

  it('selezionando una pratica il form mostra i suoi dati', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Pratiche />)

    await user.click(screen.getByText('Pratica edilizia ristrutturazione'))

    expect(screen.getByLabelText('Descrizione')).toHaveValue('Pratica edilizia ristrutturazione')
    expect(screen.getByLabelText('Stato pratica')).toHaveValue('In corso')
    expect(screen.getByLabelText('Stato pagamento')).toHaveValue('Acconto ricevuto')
    expect(screen.getByLabelText('Assegnatario')).toHaveValue('Laura Bianchi')
  })

  it('cambiando cliente cambiano le pratiche e il form riparte dalla prima', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Pratiche />)

    await user.click(screen.getByText('Beta Servizi S.n.c.'))

    expect(screen.getByText('Accatastamento fabbricato')).toBeInTheDocument()
    expect(screen.queryByText('Rilievo e frazionamento terreno')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Descrizione')).toHaveValue('Certificazione energetica')
  })

  it('cerca i clienti per nome', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Pratiche />)

    await user.type(screen.getByLabelText('Cerca cliente'), 'gamma')

    expect(contaRighe(0)).toBe(1)
    expect(screen.getByText('Gamma Studio Associato')).toBeInTheDocument()
  })

  it('con il filtro "non concluse" nasconde le pratiche concluse e i clienti senza pratiche aperte', () => {
    renderWithOutlet(<Pratiche />, { soloDaPagare: true })

    // Delta ha solo una pratica completata
    expect(screen.queryByText('Delta Impianti S.p.A.')).not.toBeInTheDocument()
    expect(contaRighe(0)).toBe(3)
    // il primo cliente ha una sola pratica ancora aperta
    expect(contaRighe(1)).toBe(1)
    expect(screen.queryByText('Rilievo e frazionamento terreno')).not.toBeInTheDocument()
  })

  it('le pratiche archiviate compaiono solo con il pulsante Archiviate', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Pratiche />)

    expect(screen.queryByText('Pratica chiusa 2023')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Archiviate' }))
    expect(screen.getByText('Pratica chiusa 2023').closest('tr')).toHaveClass('row-muted')

    await user.click(screen.getByRole('button', { name: 'Archiviate' }))
    expect(screen.queryByText('Pratica chiusa 2023')).not.toBeInTheDocument()
  })

  it('mostra i totali delle pratiche del cliente selezionato', () => {
    renderWithOutlet(<Pratiche />)

    const sue = pratiche.filter((p) => p.clienteId === 1 && !p.archiviata)
    const totali = totaliPratiche(sue)
    expect(screen.getByText('Totale richiesto').nextElementSibling).toHaveTextContent(
      norm(formatEuro(totali.richiesto)),
    )
    expect(screen.getByText('Residuo da incassare').nextElementSibling).toHaveTextContent(
      norm(formatEuro(totali.daIncassare)),
    )
  })
  it('il pulsante Archiviate compare solo per i clienti con pratiche archiviate', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Pratiche />)

    expect(screen.getByRole('button', { name: 'Archiviate' })).toBeInTheDocument()

    await user.click(screen.getByText('Beta Servizi S.n.c.'))
    expect(screen.queryByRole('button', { name: 'Archiviate' })).not.toBeInTheDocument()

    await user.click(screen.getByText('Alfa Costruzioni S.r.l.'))
    expect(screen.getByRole('button', { name: 'Archiviate' })).toBeInTheDocument()
  })

  it('cambiando cliente l\'interruttore Archiviate si spegne', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<Pratiche />)

    await user.click(screen.getByRole('button', { name: 'Archiviate' }))
    expect(screen.getByText('Pratica chiusa 2023')).toBeInTheDocument()

    await user.click(screen.getByText('Beta Servizi S.n.c.'))
    await user.click(screen.getByText('Alfa Costruzioni S.r.l.'))

    expect(screen.getByRole('button', { name: 'Archiviate' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByText('Pratica chiusa 2023')).not.toBeInTheDocument()
  })

  it('con il filtro "non concluse" non mostra Archiviate se le archiviate sono concluse', () => {
    renderWithOutlet(<Pratiche />, { soloDaPagare: true })

    // l'unica pratica archiviata del primo cliente è conclusa, quindi il filtro la nasconderebbe comunque
    expect(screen.queryByRole('button', { name: 'Archiviate' })).not.toBeInTheDocument()
  })
})