import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import dayjs from 'dayjs'
import { BsArchive, BsClockHistory, BsPersonLinesFill, BsPrinter } from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import FormFields from '../../components/FormFields.jsx'
import Toolbar from '../../components/Toolbar.jsx'
import Totale from '../../components/Totale.jsx'
import { clienti } from '../../mocks/clienti.js'
import { pratiche } from '../../mocks/pratiche.js'
import { assegnatari } from '../../mocks/tabelle.js'
import { voci } from '../../mocks/voci.js'
import { STATI_PAGAMENTO, STATI_PRATICA, isConclusa, totaliPratiche } from '../../utils/pratiche.js'
import { formatEuro } from '../../utils/format.js'

const sottovociClienti = voci.find((v) => v.nome === 'Clienti').sottovoci.map((s) => s.nome)

const fields = [
  { name: 'descrizione', label: 'Descrizione', width: 6 },
  { name: 'prat', label: 'Prat.', width: 2 },
  { name: 'num', label: 'Num.', width: 2 },
  { name: 'anno', label: 'Anno', width: 2 },
  { name: 'importoRichiesto', label: 'Importo richiesto', width: 3 },
  { name: 'inizioLavori', label: 'Inizio lavori', width: 3 },
  { name: 'fineLavori', label: 'Fine lavori', width: 3 },
  { name: 'assegnatario', label: 'Assegnatario', type: 'select', options: assegnatari.map((a) => a.nome), width: 3 },
  { name: 'voce', label: 'Voce', type: 'select', options: voci.map((v) => v.nome), width: 3 },
  { name: 'sottovoce', label: 'Sottovoce', type: 'select', options: ['Tutti gli altri', ...sottovociClienti], width: 3 },
  { name: 'statoPratica', label: 'Stato pratica', type: 'select', options: STATI_PRATICA, width: 3 },
  { name: 'dataScadenza', label: 'Data scadenza', width: 3 },
  { name: 'statoPagamento', label: 'Stato pagamento', type: 'select', options: STATI_PAGAMENTO, width: 3 },
  { name: 'dataCompletamento', label: 'Data complet.', width: 3 },
]

const colonneClienti = [
  { key: 'nome', label: 'Nome cliente' },
  { key: 'citta', label: 'Città cliente' },
  { key: 'nPratiche', label: 'Pr.', align: 'center' },
  { key: 'richiesto', label: 'Imp. richiesto', align: 'end', render: (c) => formatEuro(c.richiesto) },
  { key: 'incassato', label: 'Già incassato', align: 'end', render: (c) => formatEuro(c.incassato) },
  { key: 'spese', label: 'Spese sosten.', align: 'end', render: (c) => formatEuro(c.spese) },
  { key: 'daIncassare', label: 'Imp. residuo', align: 'end', render: (c) => formatEuro(c.daIncassare) },
]

const colonnePratiche = [
  { key: 'prat', label: 'Prat.' },
  { key: 'num', label: 'Num.' },
  { key: 'anno', label: 'Anno' },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'statoPratica', label: 'Stato pratica' },
  { key: 'statoPagamento', label: 'Stato pagamento' },
  { key: 'importoRichiesto', label: 'Imp. richiesto', align: 'end', render: (p) => formatEuro(p.importoRichiesto) },
]

const azioniExtra = [
  { label: 'Cambia cliente', icon: BsPersonLinesFill },
  { label: 'Sta. pratica', icon: BsPrinter },
  { label: 'Storia prat.', icon: BsClockHistory },
  { label: 'Sta. storia', icon: BsPrinter },
  { label: 'Archivia', icon: BsArchive },
]

const formatData = (data) => (data ? dayjs(data).format('DD/MM/YYYY') : '')

function Pratiche() {
  // In questa pagina il filtro della barra laterale significa "solo pratiche non concluse"
  const { soloDaPagare: soloNonConcluse } = useOutletContext()
  const [ricerca, setRicerca] = useState('')
  const [mostraArchiviate, setMostraArchiviate] = useState(false)
  const [clienteId, setClienteId] = useState(null)
  const [praticaId, setPraticaId] = useState(null)

  const visibili = pratiche.filter(
    (p) => (mostraArchiviate || !p.archiviata) && (!soloNonConcluse || !isConclusa(p)),
  )

  const righeClienti = clienti
    .filter((c) => c.nome.toLowerCase().includes(ricerca.toLowerCase()))
    .map((c) => {
      const sue = visibili.filter((p) => p.clienteId === c.id)
      return {
        id: c.id,
        nome: c.nome,
        citta: c.citta,
        archiviato: c.archiviato,
        nPratiche: sue.length,
        haArchiviate: pratiche.some((p) => p.clienteId === c.id && p.archiviata && (!soloNonConcluse || !isConclusa(p))),
        ...totaliPratiche(sue),
      }
    })
    .filter((c) => !soloNonConcluse || c.nPratiche > 0)

  // Se la selezione non è più tra le righe visibili, si ripiega sulla prima
  const cliente = righeClienti.find((c) => c.id === clienteId) ?? righeClienti[0]
  const delCliente = visibili.filter((p) => p.clienteId === cliente?.id)
  const pratica = delCliente.find((p) => p.id === praticaId) ?? delCliente[0]
  const totali = totaliPratiche(delCliente)

  function selezionaCliente(id) {
    setClienteId(id)
    setMostraArchiviate(false)
  }

  function cambiaRicerca(valore) {
    setRicerca(valore)
    setMostraArchiviate(false)
  }

  const valori = pratica && {
    ...pratica,
    prat: String(pratica.prat),
    num: String(pratica.num),
    anno: String(pratica.anno),
    importoRichiesto: formatEuro(pratica.importoRichiesto),
    inizioLavori: formatData(pratica.inizioLavori),
    fineLavori: formatData(pratica.fineLavori),
    dataScadenza: formatData(pratica.dataScadenza),
    dataCompletamento: formatData(pratica.dataCompletamento),
  }

  return (
    <>
      <h2 className='mb-3'>Gestione pratiche</h2>

      <Row className='mb-2'>
        <Col md={5}>
          <Form.Group controlId='ricerca-cliente'>
            <Form.Label>Cerca cliente</Form.Label>
            <Form.Control type='search' value={ricerca} onChange={(e) => cambiaRicerca(e.target.value)} />
          </Form.Group>
        </Col>
      </Row>

      <DataTable
        columns={colonneClienti}
        rows={righeClienti}
        selectedId={cliente?.id}
        onSelect={selezionaCliente}
        rowClassName={(c) => (c.archiviato ? 'row-muted' : undefined)}
      />

      <Toolbar>
        {azioniExtra.map(({ label, icon: Icon }) => (
          <Button key={label} type='button' variant='outline-secondary' size='sm'>
            <Icon className='me-1' />
            {label}
          </Button>
        ))}
      </Toolbar>

      {/* "key" ricrea il form a ogni selezione, così mostra i valori della nuova pratica */}
      <Form key={pratica?.id ?? 'vuoto'} className='mb-3' onSubmit={(e) => e.preventDefault()}>
        <FormFields fields={fields} values={valori} />
      </Form>

      <div className='d-flex gap-2 mb-3'>
        <Button type='button' variant='outline-secondary' size='sm'>
          Mostra storia pratica
        </Button>
        {cliente?.haArchiviate && (
            <Button
                type='button'
                variant={mostraArchiviate ? 'secondary' : 'outline-secondary'}
                size='sm'
                aria-pressed={mostraArchiviate}
                onClick={() => setMostraArchiviate((v) => !v)}
            >
                Archiviate
            </Button>
        )}
      </div>

      <DataTable
        columns={colonnePratiche}
        rows={delCliente}
        selectedId={pratica?.id}
        onSelect={setPraticaId}
        rowClassName={(p) => (p.archiviata ? 'row-muted' : undefined)}
      />

      <dl className='d-flex flex-wrap justify-content-end gap-5 border-top pt-3 mb-0'>
        <Totale label='Totale richiesto' value={formatEuro(totali.richiesto)} />
        <Totale label='Totale ricevuto' value={formatEuro(totali.incassato)} />
        <Totale label='Spese sostenute' value={formatEuro(totali.spese)} />
        <Totale label='Residuo da incassare' value={formatEuro(totali.daIncassare)} />
      </dl>
    </>
  )
}

export default Pratiche