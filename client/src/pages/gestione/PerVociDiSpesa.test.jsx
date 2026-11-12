import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PerVociDiSpesa from './PerVociDiSpesa.jsx'
import { renderWithOutlet } from '../../test/renderWithOutlet.jsx'
import { movimenti } from '../../mocks/movimenti.js'
import { calcolaTotali } from '../../utils/totali.js'
import { formatEuro } from '../../utils/format.js'

// Intl usa uno spazio non separabile prima di "€", mentre toHaveTextContent normalizza gli spazi
const normSpace = (testo) => testo.replace(/\u00A0/g, ' ')

// righe della tabella = movimenti + una riga di intestazione
const contaRighe = () => screen.getAllByRole('row').length - 1

const ufficio = movimenti.filter((m) => m.voce === 'Ufficio')

describe('PerVociDiSpesa', () => {
  it('parte dai movimenti della prima voce', () => {
    renderWithOutlet(<PerVociDiSpesa />)

    expect(screen.getByRole('button', { name: 'Ufficio' })).toHaveAttribute('aria-pressed', 'true')
    expect(contaRighe()).toBe(ufficio.length)
  })

  it('cambiando voce mostra i movimenti di quella voce', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<PerVociDiSpesa />)

    await user.click(screen.getByRole('button', { name: 'Casa' }))

    expect(contaRighe()).toBe(movimenti.filter((m) => m.voce === 'Casa').length)
    expect(screen.queryByText('Toner Print S.n.c.')).not.toBeInTheDocument()
  })

  it('filtra per sottovoce e si può tornare a tutte', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<PerVociDiSpesa />)

    await user.click(screen.getByRole('button', { name: 'Telefono' }))
    expect(contaRighe()).toBe(ufficio.filter((m) => m.sottovoce === 'Telefono').length)

    await user.click(screen.getByRole('button', { name: 'Tutte le sottovoci' }))
    expect(contaRighe()).toBe(ufficio.length)
  })

  it('filtra per mese', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<PerVociDiSpesa />)

    await user.click(screen.getByRole('button', { name: 'Maggio' }))

    expect(screen.getByText('Toner Print S.n.c.')).toBeInTheDocument()
    expect(screen.queryByText('Cartoleria Demo S.r.l.')).not.toBeInTheDocument()
  })

  it('con "solo voci da pagare" mostra solo i non pagati', () => {
    renderWithOutlet(<PerVociDiSpesa />, { soloDaPagare: true })

    expect(contaRighe()).toBe(ufficio.filter((m) => !m.pagata).length)
  })

  it('filtra per descrizione senza distinguere maiuscole', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<PerVociDiSpesa />)

    await user.type(screen.getByLabelText('Filtro descrizione'), 'toner')

    expect(contaRighe()).toBe(1)
    expect(screen.getByText('Toner Print S.n.c.')).toBeInTheDocument()
  })

  it('se nessun movimento corrisponde mostra un messaggio', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<PerVociDiSpesa />)

    await user.type(screen.getByLabelText('Filtro note'), 'zzzz')

    expect(screen.getByText('Nessun elemento')).toBeInTheDocument()
  })

  it('selezionando una riga il form mostra i suoi dati', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<PerVociDiSpesa />)

    await user.click(screen.getByText('Cartoleria Demo S.r.l.'))

    expect(screen.getByLabelText('Descrizione')).toHaveValue('Cartoleria Demo S.r.l.')
    expect(screen.getByLabelText('Importo')).toHaveValue(formatEuro(2350))
    expect(screen.getByLabelText('Conto')).toHaveValue('Conto corrente')
  })

  it('mostra i totali delle righe visibili', () => {
    renderWithOutlet(<PerVociDiSpesa />)

    const totali = calcolaTotali(ufficio)
    expect(screen.getByText('Uscite pagate').nextElementSibling).toHaveTextContent(
      normSpace(formatEuro(totali.uscitePagate)),
    )
    expect(screen.getByText('Uscite non pagate').nextElementSibling).toHaveTextContent(
      normSpace(formatEuro(totali.usciteNonPagate)),
    )
  })
})