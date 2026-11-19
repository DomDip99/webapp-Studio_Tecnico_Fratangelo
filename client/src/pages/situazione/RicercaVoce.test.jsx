import { describe, it, expect } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RicercaVoce from './RicercaVoce.jsx'
import { renderWithOutlet } from '../../test/renderWithOutlet.jsx'
import { movimentiRicerca } from '../../mocks/ricerca.js'
import { calcolaTotali } from '../../utils/totali.js'
import { formatEuro } from '../../utils/format.js'

// Intl usa uno spazio non separabile prima di "€", mentre toHaveTextContent normalizza gli spazi
const norm = (testo) => testo.replace(/\u00A0/g, ' ')

const visibili = movimentiRicerca.filter((m) => !m.virtuale)
const contaRighe = () => screen.getAllByRole('row').length - 1
// Nelle liste a discesa compaiono gli stessi testi delle tabelle: per i dati si cerca nella tabella
const tabella = () => within(screen.getByRole('table'))
const filtra = (user) => user.click(screen.getByRole('button', { name: 'Filtra' }))

describe('RicercaVoce', () => {
  it('di partenza mostra tutti i movimenti tranne i virtuali', () => {
    renderWithOutlet(<RicercaVoce />)

    expect(contaRighe()).toBe(visibili.length)
    expect(screen.getByText(`${visibili.length} voci trovate`)).toBeInTheDocument()
    expect(screen.queryByText('Previsione spese trasferta')).not.toBeInTheDocument()
  })

  it('i filtri si applicano solo premendo Filtra', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.type(screen.getByLabelText('Descrizione'), 'streaming')
    expect(contaRighe()).toBe(visibili.length)

    await filtra(user)
    expect(contaRighe()).toBe(1)
    expect(screen.getByText('Servizio Streaming')).toBeInTheDocument()
  })

  it('le sottovoci offerte dipendono dalla voce scelta', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.selectOptions(screen.getByLabelText('Voce'), 'Casa')

    const sottovoci = within(screen.getByLabelText('Sottovoce')).getAllByRole('option')
    const nomi = sottovoci.map((o) => o.textContent)
    expect(nomi).toContain('Affitto/Mutuo')
    expect(nomi).not.toContain('Cancelleria')

    await filtra(user)
    expect(contaRighe()).toBe(visibili.filter((m) => m.voce === 'Casa').length)
  })

  it('filtra per periodo', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    fireEvent.change(screen.getByLabelText('Data inizio'), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText('Data fine'), { target: { value: '2026-05-31' } })
    await filtra(user)

    const attesi = visibili.filter((m) => m.data >= '2026-05-01' && m.data <= '2026-05-31')
    expect(contaRighe()).toBe(attesi.length)
  })

  it('Pag. e Non pag. restringono solo se ne è spuntata una', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.click(screen.getByLabelText('Non pag.'))
    await filtra(user)
    expect(contaRighe()).toBe(visibili.filter((m) => !m.pagata).length)

    await user.click(screen.getByLabelText('Pag.'))
    await filtra(user)
    expect(contaRighe()).toBe(visibili.length)
  })

  it('Rateo tiene i movimenti generati da una rata', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.click(screen.getByLabelText('Rateo'))
    await filtra(user)

    expect(contaRighe()).toBe(visibili.filter((m) => m.rateo).length)
    expect(screen.queryByText('Cartoleria Demo S.r.l.')).not.toBeInTheDocument()
  })

  it('i virtuali compaiono con "Incl. virtuali" e da soli con "Solo virtuali"', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.click(screen.getByLabelText('Incl. virtuali'))
    await filtra(user)
    expect(contaRighe()).toBe(movimentiRicerca.length)
    expect(screen.getByText('Previsione spese trasferta')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Solo virtuali'))
    await filtra(user)
    expect(contaRighe()).toBe(1)
  })

  it('Ripulisci azzera il form e il risultato', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.type(screen.getByLabelText('Descrizione'), 'streaming')
    await filtra(user)
    expect(contaRighe()).toBe(1)

    await user.click(screen.getByRole('button', { name: 'Ripulisci' }))

    expect(screen.getByLabelText('Descrizione')).toHaveValue('')
    expect(contaRighe()).toBe(visibili.length)
  })

  it('il pulsante C azzera il campo accanto', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.selectOptions(screen.getByLabelText('Conto'), 'Cassa')
    expect(screen.getByLabelText('Conto')).toHaveValue('Cassa')

    await user.click(screen.getByRole('button', { name: 'Azzera Conto' }))

    expect(screen.getByLabelText('Conto')).toHaveValue('')
  })

  it('con "solo voci da pagare" mostra solo i non pagati', () => {
    renderWithOutlet(<RicercaVoce />, { soloDaPagare: true })

    expect(contaRighe()).toBe(visibili.filter((m) => !m.pagata).length)
  })

  it('seleziona e deseleziona le righe', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.click(screen.getByText('Toner Print S.n.c.'))
    await user.click(screen.getByRole('button', { name: 'Seleziona' }))
    expect(screen.getAllByLabelText('Selezionata')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Rimuovi sel.' }))
    expect(screen.queryAllByLabelText('Selezionata')).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: 'Seleziona tutte' }))
    expect(screen.getAllByLabelText('Selezionata')).toHaveLength(visibili.length)

    await user.click(screen.getByRole('button', { name: 'Deselez. tutte' }))
    expect(screen.queryAllByLabelText('Selezionata')).toHaveLength(0)
  })

  it('la scheda Selezionate mostra le righe scelte', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.click(screen.getByText('Toner Print S.n.c.'))
    await user.click(screen.getByRole('button', { name: 'Seleziona' }))
    await user.click(screen.getByRole('tab', { name: 'Selezionate' }))

    expect(await screen.findByRole('heading', { name: 'Voci selezionate' })).toBeInTheDocument()
    // la scheda precedente esce con una transizione: bisogna aspettare che venga rimossa
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Filtra' })).not.toBeInTheDocument())
    expect(contaRighe()).toBe(1)
    expect(screen.getByText('Toner Print S.n.c.')).toBeInTheDocument()
  })

  it('la vista Subtotali raggruppa per voce e sottovoce', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.click(screen.getByRole('button', { name: 'Subtotali' }))

    expect(screen.getByRole('columnheader', { name: 'Saldo' })).toBeInTheDocument()
    expect(tabella().getByText('Affitto/Mutuo')).toBeInTheDocument()
    expect(screen.queryByText('Toner Print S.n.c.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Normale' }))
    expect(screen.getByText('Toner Print S.n.c.')).toBeInTheDocument()
  })

  it('mostra i totali delle righe visibili', () => {
    renderWithOutlet(<RicercaVoce />)

    const totali = calcolaTotali(visibili)
    expect(screen.getByText('Totale uscite').nextElementSibling).toHaveTextContent(
      norm(formatEuro(totali.totaleUscite)),
    )
    expect(screen.getByText('Tot. da pagare').nextElementSibling).toHaveTextContent(
      norm(formatEuro(totali.usciteNonPagate)),
    )
  })

  it('i virtuali entrano nei totali solo con "Calc. virtuali"', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)
    const senzaVirtuali = calcolaTotali(visibili).usciteNonPagate
    const conVirtuali = calcolaTotali(movimentiRicerca).usciteNonPagate

    await user.click(screen.getByLabelText('Incl. virtuali'))
    await filtra(user)
    expect(screen.getByText('Tot. da pagare').nextElementSibling).toHaveTextContent(
      norm(formatEuro(senzaVirtuali)),
    )

    await user.click(screen.getByLabelText('Calc. virtuali'))
    await filtra(user)
    expect(screen.getByText('Tot. da pagare').nextElementSibling).toHaveTextContent(
      norm(formatEuro(conVirtuali)),
    )
  })
  it('i movimenti virtuali sono in grigio anche se non pagati', async () => {
    const user = userEvent.setup()
    renderWithOutlet(<RicercaVoce />)

    await user.click(screen.getByLabelText('Incl. virtuali'))
    await filtra(user)

    const riga = screen.getByText('Previsione spese trasferta').closest('tr')
    expect(riga).toHaveClass('row-muted')
    expect(riga).not.toHaveClass('table-danger')
  })
})