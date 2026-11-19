import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import dayjs from 'dayjs'
import {
  BsCalculator,
  BsCheck2,
  BsCheckAll,
  BsCheckSquareFill,
  BsEraser,
  BsFunnel,
  BsListUl,
  BsSquare,
  BsTrash,
  BsX,
} from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import Totale from '../../components/Totale.jsx'
import { movimentiRicerca } from '../../mocks/ricerca.js'
import { assegnatari, conti, operazioni } from '../../mocks/tabelle.js'
import { voci } from '../../mocks/voci.js'
import { formatEuro } from '../../utils/format.js'
import { FILTRI_VUOTI, filtraMovimenti, subtotaliPerVoce } from '../../utils/ricerca.js'
import { calcolaTotali } from '../../utils/totali.js'

const formatData = (iso) => dayjs(iso).format('DD/MM/YYYY')

const nomiVoci = voci.map((v) => v.nome)
const tutteLeSottovoci = [...new Set(voci.flatMap((v) => v.sottovoci.map((s) => s.nome)))]
const nomiTitolari = assegnatari.map((a) => a.nome)
const nomiOperazioni = operazioni.map((o) => o.nome)
const nomiConti = conti.map((c) => c.nome)

function CampoSelect({ id, label, value, options, onChange }) {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <InputGroup size='sm'>
        <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value=''>(tutte)</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Form.Select>
        <Button type='button' variant='outline-secondary' aria-label={`Azzera ${label}`} onClick={() => onChange('')}>
          C
        </Button>
      </InputGroup>
    </Form.Group>
  )
}

function CampoData({ id, label, value, onChange }) {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <InputGroup size='sm'>
        <Form.Control type='date' value={value} onChange={(e) => onChange(e.target.value)} />
        <Button type='button' variant='outline-secondary' aria-label={`Azzera ${label}`} onClick={() => onChange('')}>
          C
        </Button>
      </InputGroup>
    </Form.Group>
  )
}

function Casella({ id, label, checked, onChange }) {
  return (
    <Form.Check id={id} type='checkbox' label={label} checked={checked} onChange={(e) => onChange(e.target.checked)} />
  )
}

function RicercaVoce() {
  const { soloDaPagare } = useOutletContext()
  const [bozza, setBozza] = useState(FILTRI_VUOTI) // i valori scritti nel form
  const [applicati, setApplicati] = useState(FILTRI_VUOTI) // quelli usati dopo "Filtra"
  const [vista, setVista] = useState('normale')
  const [correnteId, setCorrenteId] = useState(null)
  const [selezionate, setSelezionate] = useState([])

  const risultati = filtraMovimenti(movimentiRicerca, applicati, soloDaPagare)
  const corrente = risultati.find((m) => m.id === correnteId) ?? risultati[0]
  // I movimenti virtuali entrano nei calcoli solo con "Calc. virtuali"
  const daCalcolare = risultati.filter((m) => applicati.calcVirtuali || !m.virtuale)
  const totali = calcolaTotali(daCalcolare)
  const elencoSelezionate = movimentiRicerca.filter((m) => selezionate.includes(m.id))

  const imposta = (campo) => (valore) => setBozza((b) => ({ ...b, [campo]: valore }))
  const cambiaVoce = (voce) => setBozza((b) => ({ ...b, voce, sottovoce: '' }))
  const sottovoci = bozza.voce
    ? voci.find((v) => v.nome === bozza.voce).sottovoci.map((s) => s.nome)
    : tutteLeSottovoci

  function ripulisci() {
    setBozza(FILTRI_VUOTI)
    setApplicati(FILTRI_VUOTI)
  }

  const seleziona = () => corrente && setSelezionate((prec) => [...new Set([...prec, corrente.id])])
  const rimuovi = () => corrente && setSelezionate((prec) => prec.filter((id) => id !== corrente.id))
  const selezionaTutte = () =>
    setSelezionate((prec) => [...new Set([...prec, ...risultati.map((m) => m.id)])])

  const colonne = [
    {
      key: 'sel',
      label: 'Sel.',
      align: 'center',
      render: (m) => (selezionate.includes(m.id) ? <BsCheckSquareFill aria-label='Selezionata' /> : null),
    },
    { key: 'data', label: 'Data', render: (m) => formatData(m.data) },
    { key: 'descrizione', label: 'Descrizione' },
    { key: 'operazione', label: 'Operazione' },
    { key: 'conto', label: 'Conto' },
    { key: 'entrata', label: 'Entrata', align: 'end', render: (m) => formatEuro(m.entrata) },
    { key: 'uscita', label: 'Uscita', align: 'end', render: (m) => formatEuro(m.uscita) },
    { key: 'pagata', label: 'Pag.', align: 'center', render: (m) => (m.pagata ? 'Sì' : 'No') },
    { key: 'virtuale', label: 'Virt.', align: 'center', render: (m) => (m.virtuale ? 'Sì' : '') },
    { key: 'voce', label: 'Voce' },
    { key: 'sottovoce', label: 'Sottovoce' },
  ]

  const colonneSelezionate = [
    { key: 'data', label: 'Data', render: (m) => formatData(m.data) },
    { key: 'descrizione', label: 'Descrizione' },
    { key: 'voce', label: 'Voce' },
    { key: 'sottovoce', label: 'Sottovoce' },
    { key: 'entrata', label: 'Entrata', align: 'end', render: (m) => formatEuro(m.entrata) },
    { key: 'uscita', label: 'Uscita', align: 'end', render: (m) => formatEuro(m.uscita) },
  ]

  const colonneSubtotali = [
    { key: 'voce', label: 'Voce' },
    { key: 'sottovoce', label: 'Sottovoce' },
    { key: 'entrate', label: 'Entrate', align: 'end', render: (r) => formatEuro(r.entrate) },
    { key: 'uscite', label: 'Uscite', align: 'end', render: (r) => formatEuro(r.uscite) },
    { key: 'saldo', label: 'Saldo', align: 'end', render: (r) => formatEuro(r.saldo) },
  ]

  function classeRiga(m) {
    if (m.virtuale) return 'row-muted'
    return m.pagata ? undefined : 'table-danger'
  }

  return (
    <>
      <h2 className='mb-3'>Ricerca voce</h2>

      <Tabs defaultActiveKey='ricerca' mountOnEnter unmountOnExit className='mb-3'>
        <Tab eventKey='ricerca' title='Ricerca'>
          <div className='d-flex flex-wrap gap-1 mb-3' role='toolbar' aria-label='Azioni ricerca'>
            <Button type='button' variant='outline-secondary' size='sm' onClick={() => setApplicati(bozza)}>
              <BsFunnel className='me-1' />
              Filtra
            </Button>
            <Button type='button' variant='outline-secondary' size='sm' onClick={ripulisci}>
              <BsEraser className='me-1' />
              Ripulisci
            </Button>
            <Button type='button' variant='outline-secondary' size='sm' onClick={seleziona}>
              <BsCheck2 className='me-1' />
              Seleziona
            </Button>
            <Button type='button' variant='outline-secondary' size='sm' onClick={rimuovi}>
              <BsX className='me-1' />
              Rimuovi sel.
            </Button>
            <Button type='button' variant='outline-secondary' size='sm' onClick={selezionaTutte}>
              <BsCheckAll className='me-1' />
              Seleziona tutte
            </Button>
            <Button type='button' variant='outline-secondary' size='sm' onClick={() => setSelezionate([])}>
              <BsSquare className='me-1' />
              Deselez. tutte
            </Button>
            <Button
              type='button'
              variant={vista === 'normale' ? 'secondary' : 'outline-secondary'}
              size='sm'
              aria-pressed={vista === 'normale'}
              onClick={() => setVista('normale')}
            >
              <BsListUl className='me-1' />
              Normale
            </Button>
            <Button
              type='button'
              variant={vista === 'subtotali' ? 'secondary' : 'outline-secondary'}
              size='sm'
              aria-pressed={vista === 'subtotali'}
              onClick={() => setVista('subtotali')}
            >
              <BsCalculator className='me-1' />
              Subtotali
            </Button>
            <Button type='button' variant='outline-secondary' size='sm'>
              <BsTrash className='me-1' />
              Elimina
            </Button>
          </div>

          <Form className='mb-3' onSubmit={(e) => e.preventDefault()}>
            <Row className='g-3'>
              <Col md={6}>
                <Form.Group controlId='filtro-descrizione'>
                  <Form.Label>Descrizione</Form.Label>
                  <Form.Control
                    size='sm'
                    type='text'
                    value={bozza.descrizione}
                    onChange={(e) => imposta('descrizione')(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <CampoData id='filtro-data-inizio' label='Data inizio' value={bozza.dataInizio} onChange={imposta('dataInizio')} />
              </Col>
              <Col md={3}>
                <CampoData id='filtro-data-fine' label='Data fine' value={bozza.dataFine} onChange={imposta('dataFine')} />
              </Col>

              <Col md={3}>
                <CampoSelect id='filtro-voce' label='Voce' value={bozza.voce} options={nomiVoci} onChange={cambiaVoce} />
              </Col>
              <Col md={3}>
                <CampoSelect id='filtro-sottovoce' label='Sottovoce' value={bozza.sottovoce} options={sottovoci} onChange={imposta('sottovoce')} />
              </Col>
              <Col md={3}>
                <CampoSelect id='filtro-titolare' label='Titolare' value={bozza.titolare} options={nomiTitolari} onChange={imposta('titolare')} />
              </Col>
              <Col md={3} />

              <Col md={3}>
                <CampoSelect id='filtro-operazione' label='Operazione' value={bozza.operazione} options={nomiOperazioni} onChange={imposta('operazione')} />
              </Col>
              <Col md={3}>
                <CampoSelect id='filtro-conto' label='Conto' value={bozza.conto} options={nomiConti} onChange={imposta('conto')} />
              </Col>
              <Col md={3}>
                <Casella id='filtro-pagati' label='Pag.' checked={bozza.pagati} onChange={imposta('pagati')} />
                <Casella id='filtro-non-pagati' label='Non pag.' checked={bozza.nonPagati} onChange={imposta('nonPagati')} />
                <Casella id='filtro-rateo' label='Rateo' checked={bozza.rateo} onChange={imposta('rateo')} />
                <Casella id='filtro-pratica' label='Pratica' checked={bozza.pratica} onChange={imposta('pratica')} />
              </Col>
              <Col md={3}>
                <Casella id='filtro-incas-cli' label='Incas. cli.' checked={bozza.incasCli} onChange={imposta('incasCli')} />
                <Casella id='filtro-incl-virtuali' label='Incl. virtuali' checked={bozza.inclVirtuali} onChange={imposta('inclVirtuali')} />
                <Casella id='filtro-solo-virtuali' label='Solo virtuali' checked={bozza.soloVirtuali} onChange={imposta('soloVirtuali')} />
                <Casella id='filtro-calc-virtuali' label='Calc. virtuali' checked={bozza.calcVirtuali} onChange={imposta('calcVirtuali')} />
              </Col>
            </Row>
          </Form>

          <p className='small text-muted mb-2'>{risultati.length} voci trovate</p>

          {vista === 'normale' ? (
            <DataTable
              columns={colonne}
              rows={risultati}
              selectedId={corrente?.id}
              onSelect={setCorrenteId}
              rowClassName={classeRiga}
            />
          ) : (
            <DataTable columns={colonneSubtotali} rows={subtotaliPerVoce(daCalcolare)} />
          )}

          <dl className='d-flex flex-wrap justify-content-end gap-5 border-top pt-3 mb-0'>
            <div>
              <Totale label='Totale entrate' value={formatEuro(totali.totaleEntrate)} />
              <Totale label='Totale uscite' value={formatEuro(totali.totaleUscite)} />
              <Totale label='Differenza' value={formatEuro(totali.totaleEntrate - totali.totaleUscite)} />
            </div>
            <div>
              <Totale label='Tot. incassato' value={formatEuro(totali.entrateIncassate)} />
              <Totale label='Tot. pagato' value={formatEuro(totali.uscitePagate)} />
              <Totale label='Differenza pagati' value={formatEuro(totali.entrateIncassate - totali.uscitePagate)} />
            </div>
            <div>
              <Totale label='Tot. da incassare' value={formatEuro(totali.entrateNonIncassate)} />
              <Totale label='Tot. da pagare' value={formatEuro(totali.usciteNonPagate)} />
              <Totale
                label='Differenza da pagare'
                value={formatEuro(totali.entrateNonIncassate - totali.usciteNonPagate)}
              />
            </div>
          </dl>
        </Tab>

        <Tab eventKey='selezionate' title='Selezionate'>
          <h3 className='h5 mb-3'>Voci selezionate</h3>
          <DataTable columns={colonneSelezionate} rows={elencoSelezionate} />
        </Tab>
      </Tabs>
    </>
  )
}

export default RicercaVoce