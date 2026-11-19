import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
import Oggi from './Oggi.jsx'
import { renderWithOutlet } from '../../test/renderWithOutlet.jsx'

const OGGI = '2026-11-04'

const sezione = (titolo) => screen.getByRole('heading', { level: 3, name: titolo }).closest('section')

describe('Oggi', () => {
  it('mostra cinque giorni consecutivi, da oggi', () => {
    renderWithOutlet(<Oggi oggi={OGGI} />)

    for (const titolo of [
      'Oggi - mercoledì 4 novembre 2026',
      'Domani - giovedì 5 novembre 2026',
      'Tra due giorni - venerdì 6 novembre 2026',
      'Tra tre giorni - sabato 7 novembre 2026',
      'Tra quattro giorni - domenica 8 novembre 2026',
    ]) {
      expect(screen.getByRole('heading', { level: 3, name: titolo })).toBeInTheDocument()
    }
  })

  it('ogni giorno mostra i suoi movimenti', () => {
    renderWithOutlet(<Oggi oggi={OGGI} />)

    const oggi = within(sezione('Oggi - mercoledì 4 novembre 2026'))
    expect(oggi.getByText('Telefonia Demo')).toBeInTheDocument()
    expect(oggi.getByText('Cliente Prova S.r.l.')).toBeInTheDocument()

    const tra3 = within(sezione('Tra tre giorni - sabato 7 novembre 2026'))
    expect(tra3.getByText('Locatore Demo')).toBeInTheDocument()
  })

  it('un giorno senza movimenti lo dice', () => {
    renderWithOutlet(<Oggi oggi={OGGI} />)

    const tra2 = within(sezione('Tra due giorni - venerdì 6 novembre 2026'))
    expect(tra2.getByText('Nessun movimento')).toBeInTheDocument()
  })

  it('non mostra i giorni fuori dai cinque', () => {
    renderWithOutlet(<Oggi oggi={OGGI} />)

    // scaduta due giorni fa e in scadenza tra sette giorni
    expect(screen.queryByText('Caffè Esempio S.a.s.')).not.toBeInTheDocument()
    expect(screen.queryByText('Alfa Costruzioni S.r.l.')).not.toBeInTheDocument()
  })

  it('con "solo voci da pagare" nasconde i movimenti pagati', () => {
    renderWithOutlet(<Oggi oggi={OGGI} />, { soloDaPagare: true })

    expect(screen.queryByText('Cartoleria Demo S.r.l.')).not.toBeInTheDocument()
    const domani = within(sezione('Domani - giovedì 5 novembre 2026'))
    expect(domani.getByText('Nessun movimento')).toBeInTheDocument()
  })

  it('evidenzia i movimenti non pagati', () => {
    renderWithOutlet(<Oggi oggi={OGGI} />)

    expect(screen.getByText('Telefonia Demo').closest('tr')).toHaveClass('table-danger')
    expect(screen.getByText('Cartoleria Demo S.r.l.').closest('tr')).not.toHaveClass('table-danger')
  })
})