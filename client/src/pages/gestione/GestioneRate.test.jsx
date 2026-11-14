import { describe, it, expect } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GestioneRate from './GestioneRate.jsx'
import { renderWithOutlet } from '../../test/renderWithOutlet.jsx'
import { piani, rate } from '../../mocks/rate.js'
import { calcolaTotali } from '../../utils/totali.js'
import { formatEuro } from '../../utils/format.js'

// Intl usa uno spazio non separabile prima di "€", mentre toHaveTextContent normalizza gli spazi
const norm = (testo) => testo.replace(/\u00A0/g, ' ')

// Righe della seconda tabella (le rate generate), senza l'intestazione
const contaRate = () => {
  const tabellaRate = screen.getAllByRole('table')[1]
  return within(tabellaRate).getAllByRole('row').length - 1
}

const rateDelPiano = (id) => rate.filter((r) => r.pianoId === id)

describe('GestioneRate', () => {
  it('parte dal primo piano con i suoi dati nel form', () => {
    renderWithOutlet(<GestioneRate />)

    expect(screen.getByLabelText('Tipo rata')).toHaveValue('Mensile')
    expect(screen.getByLabelText('Descrizione')).toHaveValue('Affitto casa')
    expect(screen.getByLabelText('Giorno')).toHaveValue('2')
    expect(screen.getByLabelText('Importo rata')).toHaveValue(formatEuro(75000))
    expect(contaRate()).toBe(rateDelPiano(1).length)
  })

  it('selezionando un piano cambiano il form e le rate generate', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<GestioneRate />)

    await user.click(screen.getByText('Bolletta acqua ufficio'))

    expect(screen.getByLabelText('Tipo rata')).toHaveValue('Bimestrale')
    expect(screen.getByLabelText('Tipo bim.')).toHaveValue('1° mese')
    expect(contaRate()).toBe(rateDelPiano(2).length)
  })

  it('un piano in entrata imposta la casella e riempie la colonna Entrata', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<GestioneRate />)

    await user.click(screen.getByText('Canone cliente Alfa'))

    expect(screen.getByLabelText('Generazione rate in entrata')).toBeChecked()
    const totali = calcolaTotali(rateDelPiano(5))
    expect(screen.getByText('Totale entrate').nextElementSibling).toHaveTextContent(
      norm(formatEuro(totali.totaleEntrate)),
    )
  })

  it('nasconde i piani archiviati finché non si preme Archiviate', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<GestioneRate />)

    const archiviato = piani.find((p) => p.archiviato).descrizione
    expect(screen.queryByText(archiviato)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Archiviate' }))
    expect(screen.getByText(archiviato)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Archiviate' }))
    expect(screen.queryByText(archiviato)).not.toBeInTheDocument()
  })

  it('con "solo voci da pagare" mostra solo le rate non pagate', () => {
    renderWithOutlet(<GestioneRate />, { soloDaPagare: true })

    expect(contaRate()).toBe(rateDelPiano(1).filter((r) => !r.pagata).length)
  })

  it('mostra il totale delle uscite del piano selezionato', () => {
    renderWithOutlet(<GestioneRate />)

    const totali = calcolaTotali(rateDelPiano(1))
    expect(screen.getByText('Totale uscite').nextElementSibling).toHaveTextContent(
      norm(formatEuro(totali.totaleUscite)),
    )
  })

  it('cambiando scheda il contenuto della precedente scompare', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<GestioneRate />)

    await user.click(screen.getByRole('tab', { name: 'Riepilogo' }))

    expect(await screen.findByRole('heading', { name: 'Riepilogo piani' })).toBeInTheDocument()
    // la scheda precedente esce con una transizione: bisogna aspettare che venga rimossa
    await waitFor(() => expect(screen.queryByLabelText('Tipo rata')).not.toBeInTheDocument())
  })

  it('il piano selezionato resta lo stesso cambiando scheda', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<GestioneRate />)

    await user.click(screen.getByText('Bolletta acqua ufficio'))
    await user.click(screen.getByRole('tab', { name: 'Modifica rate' }))

    expect(await screen.findByLabelText('Piano')).toHaveValue('2')
  })
})