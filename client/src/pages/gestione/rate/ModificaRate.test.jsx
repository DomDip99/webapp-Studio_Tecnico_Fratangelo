import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithOutlet } from '../../../test/renderWithOutlet.jsx'
import ModificaRate from './ModificaRate.jsx'
import { rate } from '../../../mocks/rate.js'
import { formatEuro } from '../../../utils/format.js'

const rateDelPiano = (id) => rate.filter((r) => r.pianoId === id)
const contaRighe = () => screen.getAllByRole('row').length - 1

describe('ModificaRate', () => {
  it('mostra le rate del piano scelto', () => {
    renderWithOutlet(<ModificaRate pianoId={1} onSelectPiano={() => {}} />)

    expect(screen.getByLabelText('Piano')).toHaveValue('1')
    expect(contaRighe()).toBe(rateDelPiano(1).length)
  })

  it('parte dalla prima rata nel form', () => {
    renderWithOutlet(<ModificaRate pianoId={1} onSelectPiano={() => {}} />)

    expect(screen.getByLabelText('Descrizione')).toHaveValue(rateDelPiano(1)[0].descrizione)
    expect(screen.getByLabelText('Importo')).toHaveValue(formatEuro(75000))
  })

  it('selezionando una rata il form mostra i suoi dati', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<ModificaRate pianoId={1} onSelectPiano={() => {}} />)
    const terza = rateDelPiano(1)[2]

    await user.click(screen.getByText(terza.descrizione))

    expect(screen.getByLabelText('Descrizione')).toHaveValue(terza.descrizione)
  })

  it('la casella Pagata riflette lo stato della rata', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<ModificaRate pianoId={1} onSelectPiano={() => {}} />)
    const pagata = rateDelPiano(1).find((r) => r.pagata)
    const nonPagata = rateDelPiano(1).find((r) => !r.pagata)

    expect(screen.getByLabelText('Pagata')).toBeChecked()

    await user.click(screen.getByText(nonPagata.descrizione))
    expect(screen.getByLabelText('Pagata')).not.toBeChecked()

    await user.click(screen.getByText(pagata.descrizione))
    expect(screen.getByLabelText('Pagata')).toBeChecked()
  })

  it('evidenzia solo le rate non pagate', () => {
    renderWithOutlet(<ModificaRate pianoId={1} onSelectPiano={() => {}} />)

    const evidenziate = screen
      .getAllByRole('row')
      .filter((riga) => riga.classList.contains('table-success'))
    expect(evidenziate).toHaveLength(rateDelPiano(1).filter((r) => !r.pagata).length)
  })

  it('cambiando piano avvisa chi lo usa', async () => {
    const user = userEvent.setup()
    const onSelectPiano = vi.fn()
    renderWithOutlet(<ModificaRate pianoId={1} onSelectPiano={onSelectPiano} />)

    await user.selectOptions(screen.getByLabelText('Piano'), 'Bolletta acqua ufficio')

    expect(onSelectPiano).toHaveBeenCalledWith(2)
  })
  it('con "solo voci da pagare" mostra solo le rate non pagate', () => {
    renderWithOutlet(<ModificaRate pianoId={1} onSelectPiano={() => {}} />, { soloDaPagare: true })

    expect(contaRighe()).toBe(rateDelPiano(1).filter((r) => !r.pagata).length)
  })

  it('con il filtro attivo e tutte le rate pagate mostra un messaggio', () => {
    // il piano 6 è concluso: tutte le sue rate sono pagate
    renderWithOutlet(<ModificaRate pianoId={6} onSelectPiano={() => {}} />, { soloDaPagare: true })

    expect(screen.getByText('Nessun elemento')).toBeInTheDocument()
  })
})