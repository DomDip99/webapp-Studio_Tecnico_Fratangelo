import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Fatture from './Fatture.jsx'
import { fatture } from '../../mocks/fatture.js'

// Intl usa uno spazio non separabile prima di "€": lo si trasforma in spazio normale
const norm = (testo) => testo.replace(/\u00A0/g, ' ')

const tabella = () => within(screen.getByRole('table'))
const contaRighe = () => screen.getAllByRole('row').length - 1
const pannello = () => within(screen.getByRole('region', { name: 'Calcolo fattura' }))

// Valore mostrato accanto a una riga del pannello (es. "Sommano") o a una riga con casella di spunta
const valore = (testo) => norm(pannello().getByText(testo).nextElementSibling.textContent)
const valoreCasella = (etichetta) =>
  norm(pannello().getByLabelText(etichetta).closest('dt').nextElementSibling.textContent)

const fattureDi = (serie, anno) => fatture.filter((f) => f.serie === serie && f.anno === anno)

describe('Fatture', () => {
  it('parte dalla prima serie e dall\'anno più recente', () => {
    render(<Fatture />)

    expect(screen.getByLabelText('Serie')).toHaveValue('Mario Rossi')
    expect(screen.getByLabelText('Mostra anno')).toHaveValue('2026')
    expect(contaRighe()).toBe(fattureDi('Mario Rossi', 2026).length)
  })

  it('mostra nel form i dati della prima fattura', () => {
    render(<Fatture />)

    expect(screen.getByLabelText('Numero')).toHaveValue('31')
    expect(screen.getByLabelText('Anno')).toHaveValue('2026')
    expect(screen.getByLabelText('Data')).toHaveValue('15/01/2026')
    expect(screen.getByLabelText('Ragione sociale')).toHaveValue('Alfa Costruzioni S.r.l.')
    expect(screen.getByLabelText('Città')).toHaveValue('Torino')
    expect(screen.getByLabelText('Prestazione')).toHaveValue('Rilievo planimetrico e frazionamento')
  })

  it('selezionando una fattura cambiano form e calcolo', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.click(tabella().getByText('Certificazione energetica fabbricato'))

    expect(screen.getByLabelText('Numero')).toHaveValue('32')
    expect(screen.getByLabelText('Ragione sociale')).toHaveValue('Beta Servizi S.n.c.')
    // 800 + 5% + 22% = 1.024,80
    expect(valore('TOTALE')).toBe('1.024,80 €')
  })

  it('cambiando anno mostra le fatture di quell\'anno', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.selectOptions(screen.getByLabelText('Mostra anno'), '2025')

    expect(contaRighe()).toBe(1)
    expect(screen.getByLabelText('Numero')).toHaveValue('30')
  })

  it('cambiando serie mostra le fatture di quell\'utente', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.selectOptions(screen.getByLabelText('Serie'), 'Laura Bianchi')

    expect(contaRighe()).toBe(fattureDi('Laura Bianchi', 2026).length)
    expect(screen.getByLabelText('Numero')).toHaveValue('901')
  })

  it('senza fatture mostra un messaggio e nasconde il calcolo', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.selectOptions(screen.getByLabelText('Serie'), 'Paolo Verdi')
    await user.selectOptions(screen.getByLabelText('Mostra anno'), '2025')

    expect(screen.getByText('Nessun elemento')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Calcolo fattura' })).not.toBeInTheDocument()
  })

  it('l\'intestazione alternativa attiva si vede nel form', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.selectOptions(screen.getByLabelText('Serie'), 'Laura Bianchi')
    await user.click(tabella().getByText('Pratica edilizia ristrutturazione (acconto)'))

    expect(screen.getByLabelText('Intest. alternativa')).toHaveValue('Condominio Demo')
    expect(screen.getByLabelText('Attiva')).toBeChecked()
  })

  it('mostra il totale di ogni fattura e quello dell\'elenco', () => {
    render(<Fatture />)

    // 1.331,00 + 1.024,80 + prima fattura con ritenuta
    expect(tabella().getByText('1.331,00 €')).toBeInTheDocument()
    const attesi = fattureDi('Mario Rossi', 2026).length
    expect(contaRighe()).toBe(attesi)
    expect(screen.getByText('Totale fatture')).toBeInTheDocument()
  })
})

describe('Fatture: pannello di calcolo', () => {
  it('parte dai valori della fattura selezionata', () => {
    render(<Fatture />)

    expect(screen.getByLabelText('Onorario')).toHaveValue('1.000,00')
    expect(screen.getByLabelText('Spese')).toHaveValue('50,00')
    expect(valoreCasella('Maggiorazione (5%)')).toBe('50,00 €')
    expect(valore('Sommano')).toBe('1.050,00 €')
    expect(valoreCasella('IVA (22%)')).toBe('231,00 €')
    expect(valore('Totale')).toBe('1.281,00 €')
    expect(valoreCasella("Ritenuta d'acconto (20%)")).toBe('0,00 €')
    expect(valore('Totale parziale')).toBe('1.281,00 €')
    expect(valore('TOTALE')).toBe('1.331,00 €')
  })

  it('si ricalcola quando si cambia l\'onorario', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.clear(screen.getByLabelText('Onorario'))
    await user.type(screen.getByLabelText('Onorario'), '2.000,00')

    expect(valore('Sommano')).toBe('2.100,00 €')
    expect(valore('TOTALE')).toBe('2.612,00 €')
  })

  it('la ritenuta d\'acconto si sottrae dal totale', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.click(screen.getByLabelText("Ritenuta d'acconto (20%)"))

    expect(valoreCasella("Ritenuta d'acconto (20%)")).toBe('200,00 €')
    expect(valore('Totale parziale')).toBe('1.081,00 €')
    expect(valore('TOTALE')).toBe('1.131,00 €')
  })

  it('togliendo l\'IVA l\'importo torna a zero', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.click(screen.getByLabelText('IVA (22%)'))

    expect(valoreCasella('IVA (22%)')).toBe('0,00 €')
    expect(valore('TOTALE')).toBe('1.100,00 €')
  })

  it('un testo non valido vale zero', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.clear(screen.getByLabelText('Onorario'))
    await user.type(screen.getByLabelText('Onorario'), 'abc')

    expect(valore('Sommano')).toBe('0,00 €')
    expect(valore('TOTALE')).toBe('50,00 €')
  })

  it('cambiando fattura il pannello riparte dai suoi valori', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.clear(screen.getByLabelText('Onorario'))
    await user.type(screen.getByLabelText('Onorario'), '5.000,00')
    await user.click(tabella().getByText('Certificazione energetica fabbricato'))

    expect(screen.getByLabelText('Onorario')).toHaveValue('800,00')
  })

  it('si ricalcola quando si cambiano le spese', async () => {
    const user = userEvent.setup()
    render(<Fatture />)

    await user.clear(screen.getByLabelText('Spese'))
    await user.type(screen.getByLabelText('Spese'), '250,00')

  // le spese si sommano alla fine, fuori da IVA e ritenuta: 1.281,00 + 250,00
    expect(valore('Totale')).toBe('1.281,00 €')
    expect(valore('TOTALE')).toBe('1.531,00 €')
  })
})