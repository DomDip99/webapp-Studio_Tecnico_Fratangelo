import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import dayjs from 'dayjs'
import { BsArrowRepeat, BsFiles, BsGear, BsListCheck, BsPrinter } from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import FormFields from '../../components/FormFields.jsx'
import Toolbar from '../../components/Toolbar.jsx'
import Totale from '../../components/Totale.jsx'
import { clienti } from '../../mocks/clienti.js'
import { fatture } from '../../mocks/fatture.js'
import { calcolaFattura } from '../../utils/fatture.js'
import { formatEuro } from '../../utils/format.js'
import CalcoloFattura from './CalcoloFattura.jsx'

const serie = [...new Set(fatture.map((f) => f.serie))]
const anni = [...new Set(fatture.map((f) => f.anno))].sort((a, b) => b - a)
const nomeCliente = (id) => clienti.find((c) => c.id === id).nome

const fields = [
  { name: 'numero', label: 'Numero', width: 3 },
  { name: 'anno', label: 'Anno', width: 3 },
  { name: 'data', label: 'Data', width: 6 },
  { name: 'ragioneSociale', label: 'Ragione sociale', type: 'select', options: clienti.map((c) => c.nome), width: 12 },
  { name: 'intestazione', label: 'Intest. alternativa', width: 9 },
  { name: 'attivaIntestazione', label: 'Attiva', type: 'checkbox', width: 3 },
  { name: 'indirizzo', label: 'Indirizzo', width: 12 },
  { name: 'cap', label: 'CAP', width: 3 },
  { name: 'citta', label: 'Città', width: 6 },
  { name: 'provincia', label: 'Pr.', width: 3 },
  { name: 'cf', label: 'Codice Fiscale', width: 5 },
  { name: 'piva', label: 'P.IVA', width: 4 },
  { name: 'titolo', label: 'Titolo', width: 3 },
  { name: 'prestazione', label: 'Prestazione', type: 'textarea', width: 12 },
  { name: 'pagamento', label: 'Pagamento', type: 'textarea', width: 12 },
]

const columns = [
  { key: 'numero', label: 'Numero' },
  { key: 'anno', label: 'Anno' },
  { key: 'data', label: 'Data', render: (f) => dayjs(f.data).format('DD/MM/YYYY') },
  { key: 'ragioneSociale', label: 'Ragione sociale' },
  { key: 'prestazione', label: 'Descrizione' },
  { key: 'totale', label: 'Totale', align: 'end', render: (f) => formatEuro(f.totale) },
]

const azioniExtra = [
  { label: 'Duplica', icon: BsFiles },
  { label: 'Config.', icon: BsGear },
  { label: 'Parcella', icon: BsPrinter },
  { label: 'Riepil.', icon: BsListCheck },
  { label: 'Converti in fattura', icon: BsArrowRepeat },
]

function Fatture() {
  const [serieScelta, setSerieScelta] = useState(serie[0])
  const [anno, setAnno] = useState(anni[0])
  const [fatturaId, setFatturaId] = useState(null)

  const righe = fatture
    .filter((f) => f.serie === serieScelta && f.anno === anno)
    .sort((a, b) => a.numero - b.numero)
    .map((f) => ({ ...f, ragioneSociale: nomeCliente(f.clienteId), totale: calcolaFattura(f).totaleDocumento }))

  // Se la fattura selezionata non è più tra quelle mostrate, si ripiega sulla prima
  const fattura = righe.find((f) => f.id === fatturaId) ?? righe[0]
  const cliente = fattura && clienti.find((c) => c.id === fattura.clienteId)
  const totaleElenco = righe.reduce((somma, f) => somma + f.totale, 0)

  const valori = fattura && {
    numero: String(fattura.numero),
    anno: String(fattura.anno),
    data: dayjs(fattura.data).format('DD/MM/YYYY'),
    ragioneSociale: cliente.nome,
    intestazione: fattura.intestazione,
    attivaIntestazione: fattura.attivaIntestazione,
    indirizzo: cliente.indirizzo,
    cap: cliente.cap,
    citta: cliente.citta,
    provincia: cliente.provincia,
    cf: cliente.cf,
    piva: cliente.piva,
    titolo: cliente.titolo,
    prestazione: fattura.prestazione,
    pagamento: fattura.pagamento,
  }

  return (
    <>
      <h2 className='mb-3'>Gestione fatture</h2>

      <Row className='g-3 mb-3'>
        <Col sm={6} md={4}>
          <Form.Group controlId='serie'>
            <Form.Label>Serie</Form.Label>
            <Form.Select value={serieScelta} onChange={(e) => setSerieScelta(e.target.value)}>
              {serie.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={6} md={3}>
          <Form.Group controlId='anno-visualizzato'>
            <Form.Label>Mostra anno</Form.Label>
            <Form.Select value={anno} onChange={(e) => setAnno(Number(e.target.value))}>
              {anni.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Toolbar>
        {azioniExtra.map(({ label, icon: Icon }) => (
          <Button key={label} type='button' variant='outline-secondary' size='sm'>
            <Icon className='me-1' />
            {label}
          </Button>
        ))}
      </Toolbar>

      <Row className='g-4 mb-4'>
        <Col lg={8}>
          {/* "key" ricrea il form a ogni selezione, così mostra i valori della nuova fattura */}
          <Form key={fattura?.id ?? 'vuoto'} onSubmit={(e) => e.preventDefault()}>
            <FormFields fields={fields} values={valori} />
          </Form>
        </Col>
        <Col lg={4}>{fattura && <CalcoloFattura key={fattura.id} fattura={fattura} />}</Col>
      </Row>

      <DataTable columns={columns} rows={righe} selectedId={fattura?.id} onSelect={setFatturaId} />

      <dl className='d-flex justify-content-end border-top pt-3 mb-0'>
        <Totale label='Totale fatture' value={formatEuro(totaleElenco)} />
      </dl>
    </>
  )
}

export default Fatture