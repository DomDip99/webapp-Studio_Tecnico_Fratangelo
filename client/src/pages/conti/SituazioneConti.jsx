import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import dayjs from 'dayjs'
import { BsCalculator, BsPrinter } from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import { movimenti } from '../../mocks/movimenti.js'
import { situazioniIniziali, trasferimenti } from '../../mocks/conti.js'
import { calcolaSaldo } from '../../utils/conti.js'
import { formatEuro } from '../../utils/format.js'

const formatData = (iso) => (iso ? dayjs(iso).format('DD/MM/YYYY') : '')

const colonneConti = [
  { key: 'conto', label: 'Conto' },
  { key: 'numero', label: 'Numero' },
  { key: 'dataIniziale', label: 'Situazione iniziale: data', render: (c) => formatData(c.dataIniziale) },
  { key: 'importoIniziale', label: 'Situazione iniziale: importo', align: 'end', render: (c) => formatEuro(c.importoIniziale) },
  { key: 'dataVerifica', label: 'Verifica: data', render: (c) => formatData(c.dataVerifica) },
  { key: 'importoVerifica', label: 'Verifica: importo', align: 'end', render: (c) => formatEuro(c.importoVerifica) },
]

const colonneMovimenti = [
  { key: 'data', label: 'Data', render: (m) => formatData(m.data) },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'operazione', label: 'Operazione' },
  { key: 'entrata', label: 'Entrata', align: 'end', render: (m) => formatEuro(m.entrata) },
  { key: 'uscita', label: 'Uscita', align: 'end', render: (m) => formatEuro(m.uscita) },
]

const colonneTrasferimenti = [
  { key: 'data', label: 'Data', render: (t) => formatData(t.data) },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'contoUscita', label: 'Conto uscita' },
  { key: 'contoIngresso', label: 'Conto ingresso' },
  { key: 'importo', label: 'Importo', align: 'end', render: (t) => formatEuro(t.importo) },
]

function SituazioneConti() {
  const { soloDaPagare } = useOutletContext()
  const [contoId, setContoId] = useState(null)

  const conto = situazioniIniziali.find((c) => c.id === contoId) ?? situazioniIniziali[0]

  const movimentiConto = movimenti
    .filter((m) => m.conto === conto.conto && (!soloDaPagare || !m.pagata))
    .map((m) => ({ ...m, rowId: m.id }))
  const trasferimentiConto = trasferimenti.filter(
    (t) => t.contoUscita === conto.conto || t.contoIngresso === conto.conto,
  )

  const saldoFinale = calcolaSaldo(conto.importoIniziale, movimenti, trasferimenti, conto.conto)

  return (
    <>
      <h2 className='mb-3'>Situazione conti</h2>

      <DataTable columns={colonneConti} rows={situazioniIniziali} selectedId={conto.id} onSelect={setContoId} />

      <Tabs defaultActiveKey='prima-nota' mountOnEnter unmountOnExit className='my-3'>
        <Tab eventKey='prima-nota' title='Prima nota'>
          <DataTable
            columns={colonneMovimenti}
            rows={movimentiConto}
            rowClassName={(m) => (m.pagata ? undefined : 'table-danger')}
          />
        </Tab>
        <Tab eventKey='movimenti' title='Movimenti'>
          <DataTable columns={colonneTrasferimenti} rows={trasferimentiConto} />
        </Tab>
      </Tabs>

      <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 border-top pt-3'>
        <div>
          <h3 className='h5 text-primary mb-1'>{conto.conto}</h3>
          <dl className='d-flex gap-5 mb-0'>
            <div>
              <dt className='fw-normal small'>Situazione iniziale</dt>
              <dd className='mb-0'>{formatEuro(conto.importoIniziale)}</dd>
            </div>
            <div>
              <dt className='fw-normal small'>Situazione finale</dt>
              <dd className='mb-0 fw-bold'>{formatEuro(saldoFinale)}</dd>
            </div>
          </dl>
        </div>

        <div className='d-flex gap-2'>
          <Button type='button' variant='outline-secondary' size='sm'>
            <BsCalculator className='me-1' />
            Ricalcola situazione
          </Button>
          <Button type='button' variant='outline-secondary' size='sm'>
            <BsPrinter className='me-1' />
            Stampa estratto conto
          </Button>
        </div>
      </div>
    </>
  )
}

export default SituazioneConti