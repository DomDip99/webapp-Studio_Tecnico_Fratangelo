import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithOutlet } from '../../../test/renderWithOutlet.jsx'
import RiepilogoRate from './RiepilogoRate.jsx'
import { piani, rate } from '../../../mocks/rate.js'
import { calcolaTotali } from '../../../utils/totali.js'
import { formatEuro } from '../../../utils/format.js'

// Intl usa uno spazio non separabile prima di "€", mentre toHaveTextContent normalizza gli spazi
const norm = (testo) => testo.replace(/\u00A0/g, ' ')

const attivi = piani.filter((p) => !p.archiviato)

describe('RiepilogoRate', () => {
  it('mostra una riga per ogni piano attivo', () => {
    renderWithOutlet(<RiepilogoRate pianoId={1} onSelectPiano={() => {}} />)

    expect(screen.getAllByRole('row')).toHaveLength(attivi.length + 1)
  })

  it('non mostra i piani archiviati', () => {
    renderWithOutlet(<RiepilogoRate pianoId={1} onSelectPiano={() => {}} />)
    const archiviato = piani.find((p) => p.archiviato)

    expect(screen.queryByText(archiviato.descrizione)).not.toBeInTheDocument()
  })

  it('mostra le rate pagate sul totale', () => {
    renderWithOutlet(<RiepilogoRate pianoId={1} onSelectPiano={() => {}} />)

    expect(screen.getByText('10/12')).toBeInTheDocument() // affitto
    expect(screen.getByText('1/2')).toBeInTheDocument() // licenza
  })

  it('evidenzia il piano selezionato e comunica un nuovo clic', async () => {
    const user = userEvent.setup()
    const onSelectPiano = vi.fn()
    renderWithOutlet(<RiepilogoRate pianoId={1} onSelectPiano={onSelectPiano} />)

    expect(screen.getByText('Affitto casa').closest('tr')).toHaveClass('table-active')

    await user.click(screen.getByText('Licenza software'))

    expect(onSelectPiano).toHaveBeenCalledWith(4)
  })

  it('mostra i totali da pagare e da incassare', () => {
    renderWithOutlet(<RiepilogoRate pianoId={1} onSelectPiano={() => {}} />)

    const daSaldare = calcolaTotali(
      rate.filter((r) => !r.pagata && attivi.some((p) => p.id === r.pianoId)),
    )
    expect(screen.getByText('Da pagare').nextElementSibling).toHaveTextContent(
      norm(formatEuro(daSaldare.usciteNonPagate)),
    )
    expect(screen.getByText('Da incassare').nextElementSibling).toHaveTextContent(
      norm(formatEuro(daSaldare.entrateNonIncassate)),
    )
  })
  it('con "solo voci da pagare" nasconde i piani saldati', () => {
    renderWithOutlet(<RiepilogoRate pianoId={1} onSelectPiano={() => {}} />, { soloDaPagare: true })

    expect(screen.queryByText('Abbonamento telefonia')).not.toBeInTheDocument()
    expect(screen.getByText('Affitto casa')).toBeInTheDocument()
  })

  it('senza il filtro mostra anche i piani saldati, senza prossima scadenza', () => {
    renderWithOutlet(<RiepilogoRate pianoId={1} onSelectPiano={() => {}} />)

    const riga = screen.getByText('Abbonamento telefonia').closest('tr')
    expect(riga).toHaveTextContent('4/4')
    expect(riga).toHaveTextContent('—')
  })
})