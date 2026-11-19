import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import dayjs from 'dayjs'
import CalendarioGiorni from '../../components/CalendarioGiorni.jsx'
import DataTable from '../../components/DataTable.jsx'
import SelectList from '../../components/SelectList.jsx'
import { movimenti } from '../../mocks/movimenti.js'
import { scadenze } from '../../mocks/scadenze.js'
import { situazioniIniziali, trasferimenti } from '../../mocks/conti.js'
import { etichettaGiorno, formatoISO } from '../../utils/calendario.js'
import { formatEuro } from '../../utils/format.js'

const contiItems = situazioniIniziali.map((c) => ({ id: c.id, label: c.conto }))

const colonneMovimenti = [
  { key: 'descrizione', label: 'Prima nota' },
  { key: 'entrata', label: 'Entrata', align: 'end', render: (m) => formatEuro(m.entrata) },
  { key: 'uscita', label: 'Uscita', align: 'end', render: (m) => formatEuro(m.uscita) },
  { key: 'operazione', label: 'Operazione' },
]

const colonneTrasferimenti = [
  { key: 'descrizione', label: 'Movimento' },
  { key: 'contoUscita', label: 'Conto uscita' },
  { key: 'contoIngresso', label: 'Conto ingresso' },
  { key: 'importo', label: 'Importo', align: 'end', render: (t) => formatEuro(t.importo) },
]

function Storico({ oggi = formatoISO(dayjs()) }) {
  const [giorno, setGiorno] = useState(oggi)
  const [contoId, setContoId] = useState(situazioniIniziali[0].id)

  const conto = situazioniIniziali.find((c) => c.id === contoId).conto
  const tutti = [...movimenti, ...scadenze(oggi)]

  const delGiorno = tutti.filter((m) => m.data === giorno && m.conto === conto)
  const trasferimentiGiorno = trasferimenti.filter(
    (t) => t.data === giorno && (t.contoUscita === conto || t.contoIngresso === conto),
  )

  return (
    <>
      <h2 className='mb-3'>Storico voci contabilizzate</h2>

      <Row className='g-3 mb-3'>
        <Col lg={8}>
          <CalendarioGiorni value={giorno} onChange={setGiorno} oggi={oggi} />
        </Col>
        <Col lg={4}>
          <SelectList title='Conto' items={contiItems} selectedId={contoId} onSelect={setContoId} />
        </Col>
      </Row>

      <h3 className='h5 mb-3'>{etichettaGiorno(giorno)}</h3>

      <DataTable
        columns={colonneMovimenti}
        rows={delGiorno}
        rowClassName={(m) => (m.pagata ? undefined : 'table-danger')}
      />

      <h3 className='h6 mt-4 mb-2'>Trasferimenti</h3>
      <DataTable columns={colonneTrasferimenti} rows={trasferimentiGiorno} />
    </>
  )
}

export default Storico