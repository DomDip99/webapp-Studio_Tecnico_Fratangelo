import { useOutletContext } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import dayjs from 'dayjs'
import { BsPrinter } from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import { movimenti } from '../../mocks/movimenti.js'
import { scadenze } from '../../mocks/scadenze.js'
import { dataEstesa, formatoISO } from '../../utils/calendario.js'
import { etichettaRelativa, giorniConsecutivi, movimentiDelGiorno } from '../../utils/giornaliero.js'
import { formatEuro } from '../../utils/format.js'

const columns = [
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'operazione', label: 'Operazione' },
  { key: 'conto', label: 'Conto' },
  { key: 'entrata', label: 'Entrata', align: 'end', render: (m) => formatEuro(m.entrata) },
  { key: 'uscita', label: 'Uscita', align: 'end', render: (m) => formatEuro(m.uscita) },
  { key: 'pagata', label: 'Pag.', align: 'center', render: (m) => (m.pagata ? 'Sì' : 'No') },
]

function Oggi({ oggi = formatoISO(dayjs()) }) {
  const { soloDaPagare } = useOutletContext()
  const tutti = [...movimenti, ...scadenze(oggi)]

  return (
    <>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h2 className='mb-0'>Riepilogo giornaliero</h2>
        <Button type='button' variant='outline-secondary' size='sm'>
          <BsPrinter className='me-1' />
          Stampa
        </Button>
      </div>

      {giorniConsecutivi(oggi, 5).map((iso) => {
        const righe = movimentiDelGiorno(tutti, iso).filter((m) => !soloDaPagare || !m.pagata)

        return (
          <section key={iso} className='mb-4'>
            <h3 className='h6 border-bottom pb-1'>{`${etichettaRelativa(iso, oggi)} - ${dataEstesa(iso)}`}</h3>
            {righe.length > 0 ? (
              <DataTable columns={columns} rows={righe} rowClassName={(m) => (m.pagata ? undefined : 'table-danger')} />
            ) : (
              <p className='small text-muted'>Nessun movimento</p>
            )}
          </section>
        )
      })}
    </>
  )
}

export default Oggi