import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import dayjs from 'dayjs'
import {
  BsFiles,
  BsArrowsMove,
  BsPrinter,
  BsClipboard,
  BsPaperclip,
  BsBoxArrowUpRight,
} from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import FormFields from '../../components/FormFields.jsx'
import SelectList from '../../components/SelectList.jsx'
import Toolbar from '../../components/Toolbar.jsx'
import { movimenti } from '../../mocks/movimenti.js'
import { voci } from '../../mocks/voci.js'
import { assegnatari, conti, operazioni } from '../../mocks/tabelle.js'
import { calcolaTotali } from '../../utils/totali.js'
import { formatEuro } from '../../utils/format.js'

const MESI = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]

const vociItems = voci.map((v) => ({ id: v.id, label: v.nome }))
const mesiItems = [
  { id: 0, label: 'Tutti i mesi' },
  ...MESI.map((nome, i) => ({ id: i + 1, label: nome })),
]

const fields = [
  { name: 'data', label: 'Data', width: 3 },
  { name: 'descrizione', label: 'Descrizione', width: 5 },
  { name: 'titolare', label: 'Titolare', type: 'select', options: ['', ...assegnatari.map((a) => a.nome)], width: 4 },
  { name: 'note', label: 'Note', width: 8 },
  { name: 'importo', label: 'Importo', width: 4 },
  { name: 'operazione', label: 'Operazione', type: 'select', options: operazioni.map((o) => o.nome), width: 4 },
  { name: 'conto', label: 'Conto', type: 'select', options: conti.map((c) => c.nome), width: 4 },
]

const columns = [
  { key: 'data', label: 'Data', render: (m) => dayjs(m.data).format('DD/MM/YYYY') },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'note', label: 'Note' },
  { key: 'operazione', label: 'Operazione' },
  { key: 'conto', label: 'Conto' },
  { key: 'entrata', label: 'Entrata', align: 'end', render: (m) => formatEuro(m.entrata) },
  { key: 'uscita', label: 'Uscita', align: 'end', render: (m) => formatEuro(m.uscita) },
  { key: 'pagata', label: 'Pag.', align: 'center', render: (m) => (m.pagata ? 'Sì' : 'No') },
  { key: 'doc', label: 'Doc.', align: 'center', render: (m) => (m.doc ? 'Sì' : 'No') },
]

const azioniExtra = [
  { label: 'Duplica', icon: BsFiles },
  { label: 'Copia/Sposta', icon: BsArrowsMove },
  { label: 'Stampa', icon: BsPrinter },
  { label: 'Incolla doc.', icon: BsClipboard },
  { label: 'Documenti', icon: BsPaperclip },
  { label: 'Apri doc.', icon: BsBoxArrowUpRight },
]

function Totale({ label, value }) {
  return (
    <div className='d-flex justify-content-between gap-4'>
      <dt className='fw-normal'>{label}</dt>
      <dd className='mb-0 text-end'>{value}</dd>
    </div>
  )
}

function PerVociDiSpesa() {
  const { soloDaPagare } = useOutletContext()
  const [voceId, setVoceId] = useState(voci[0].id)
  const [sottovoceId, setSottovoceId] = useState(0) // 0 = tutte
  const [mese, setMese] = useState(0) // 0 = tutti
  const [filtroDescrizione, setFiltroDescrizione] = useState('')
  const [filtroNote, setFiltroNote] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const voce = voci.find((v) => v.id === voceId)
  const sottovoce = voce.sottovoci.find((s) => s.id === sottovoceId)
  const sottovociItems = [
    { id: 0, label: 'Tutte le sottovoci' },
    ...voce.sottovoci.map((s) => ({ id: s.id, label: s.nome, muted: s.archiviata })),
  ]

  const rows = movimenti.filter(
    (m) =>
      m.voce === voce.nome &&
      (!sottovoce || m.sottovoce === sottovoce.nome) &&
      (mese === 0 || dayjs(m.data).month() + 1 === mese) &&
      (!soloDaPagare || !m.pagata) &&
      m.descrizione.toLowerCase().includes(filtroDescrizione.toLowerCase()) &&
      m.note.toLowerCase().includes(filtroNote.toLowerCase()),
  )

  // Se la riga selezionata non è più tra quelle filtrate, si ripiega sulla prima
  const selezionato = rows.find((m) => m.id === selectedId) ?? rows[0]
  const totali = calcolaTotali(rows)

  const valori = selezionato && {
    data: dayjs(selezionato.data).format('DD/MM/YYYY'),
    descrizione: selezionato.descrizione,
    note: selezionato.note,
    importo: formatEuro(selezionato.entrata ?? selezionato.uscita),
    operazione: selezionato.operazione,
    conto: selezionato.conto,
  }

  // Cambiando voce, la sottovoce torna a "tutte"
  function selezionaVoce(id) {
    setVoceId(id)
    setSottovoceId(0)
  }

  return (
    <>
      <h2 className='mb-3'>Per voci di spesa</h2>

      <Row>
        <Col md={3} lg={2}>
          <SelectList title='Voci' items={vociItems} selectedId={voceId} onSelect={selezionaVoce} />
          <SelectList
            title='Sottovoci'
            items={sottovociItems}
            selectedId={sottovoceId}
            onSelect={setSottovoceId}
          />
          <SelectList title='Mese' items={mesiItems} selectedId={mese} onSelect={setMese} />
        </Col>

        <Col md={9} lg={10}>
          <Toolbar>
            {azioniExtra.map(({ label, icon: Icon }) => (
              <Button key={label} type='button' variant='outline-secondary' size='sm'>
                <Icon className='me-1' />
                {label}
              </Button>
            ))}
          </Toolbar>

          {selezionato && (
            <div className='mb-2'>
              <Badge bg={selezionato.pagata ? 'success' : 'danger'}>
                {selezionato.pagata ? 'Pagata' : 'Non pagata'}
              </Badge>
            </div>
          )}

          {/* "key" ricrea il form a ogni selezione, così mostra i valori del nuovo movimento */}
          <Form key={selezionato?.id ?? 'vuoto'} className='mb-3' onSubmit={(e) => e.preventDefault()}>
            <FormFields fields={fields} values={valori} />
          </Form>

          <Row className='g-3 mb-3'>
            <Col md={6}>
              <Form.Group controlId='filtro-descrizione'>
                <Form.Label>Filtro descrizione</Form.Label>
                <Form.Control
                  type='text'
                  value={filtroDescrizione}
                  onChange={(e) => setFiltroDescrizione(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='filtro-note'>
                <Form.Label>Filtro note</Form.Label>
                <Form.Control
                  type='text'
                  value={filtroNote}
                  onChange={(e) => setFiltroNote(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <DataTable
            columns={columns}
            rows={rows}
            selectedId={selezionato?.id}
            onSelect={setSelectedId}
            rowClassName={(m) => (m.pagata ? undefined : 'table-danger')}
          />

          <dl className='d-flex flex-wrap justify-content-end gap-5 border-top pt-3 mb-0'>
            <div>
              <Totale label='Entrate incassate' value={formatEuro(totali.entrateIncassate)} />
              <Totale label='Entrate non incassate' value={formatEuro(totali.entrateNonIncassate)} />
              <Totale label='Totale entrate' value={formatEuro(totali.totaleEntrate)} />
            </div>
            <div>
              <Totale label='Uscite pagate' value={formatEuro(totali.uscitePagate)} />
              <Totale label='Uscite non pagate' value={formatEuro(totali.usciteNonPagate)} />
              <Totale label='Totale uscite' value={formatEuro(totali.totaleUscite)} />
            </div>
          </dl>
        </Col>
      </Row>
    </>
  )
}

export default PerVociDiSpesa