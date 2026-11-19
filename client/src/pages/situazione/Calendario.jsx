import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import dayjs from 'dayjs'
import { BsPrinter } from 'react-icons/bs'
import CalendarioGiorni from '../../components/CalendarioGiorni.jsx'
import DataTable from '../../components/DataTable.jsx'
import { movimenti } from '../../mocks/movimenti.js'
import { scadenze } from '../../mocks/scadenze.js'
import { etichettaGiorno, formatoISO } from '../../utils/calendario.js'
import { giorniConsecutivi, movimentiDelGiorno } from '../../utils/giornaliero.js'
import { formatEuro } from '../../utils/format.js'

const columns = [
  { key: 'data', label: 'Data', render: (m) => dayjs(m.data).format('DD/MM/YYYY') },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'operazione', label: 'Operazione' },
  { key: 'conto', label: 'Conto' },
  { key: 'entrata', label: 'Entrata', align: 'end', render: (m) => formatEuro(m.entrata) },
  { key: 'uscita', label: 'Uscita', align: 'end', render: (m) => formatEuro(m.uscita) },
  { key: 'pagata', label: 'Pag.', align: 'center', render: (m) => (m.pagata ? 'Sì' : 'No') },
]

const formatData = (iso) => dayjs(iso).format('DD/MM/YYYY')

function Calendario({ oggi = formatoISO(dayjs()) }) {
  const { soloDaPagare } = useOutletContext()
  const [giorno, setGiorno] = useState(oggi)
  const [cinqueGiorni, setCinqueGiorni] = useState(false)

  const tutti = [...movimenti, ...scadenze(oggi)]
  const giorni = giorniConsecutivi(giorno, cinqueGiorni ? 5 : 1)
  const righe = giorni
    .flatMap((iso) => movimentiDelGiorno(tutti, iso))
    .filter((m) => !soloDaPagare || !m.pagata)

  const titolo = cinqueGiorni
    ? `Dal ${formatData(giorni[0])} al ${formatData(giorni[giorni.length - 1])}`
    : etichettaGiorno(giorno)

  return (
    <>
      <h2 className='mb-3'>Situazione giornaliera</h2>

      <CalendarioGiorni value={giorno} onChange={setGiorno} oggi={oggi} />

      <div className='d-flex gap-2 my-3'>
        <Button
          type='button'
          variant={cinqueGiorni ? 'primary' : 'outline-secondary'}
          size='sm'
          aria-pressed={cinqueGiorni}
          onClick={() => setCinqueGiorni((v) => !v)}
        >
          Mostra 5 giorni consecutivi
        </Button>
        <Button type='button' variant='outline-secondary' size='sm'>
          <BsPrinter className='me-1' />
          Stampa
        </Button>
      </div>

      <h3 className='h5 mb-3'>{titolo}</h3>
      <DataTable columns={columns} rows={righe} rowClassName={(m) => (m.pagata ? undefined : 'table-danger')} />
    </>
  )
}

export default Calendario