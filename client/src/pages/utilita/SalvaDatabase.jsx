import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import dayjs from 'dayjs'
import { BsDownload } from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import { backup } from '../../mocks/backup.js'

const formatDimensione = (kb) => `${(kb / 1024).toFixed(1).replace('.', ',')} MB`

const columns = [
  { key: 'nome', label: 'File' },
  { key: 'data', label: 'Data', render: (b) => dayjs(b.data).format('DD/MM/YYYY') },
  { key: 'dimensioneKb', label: 'Dimensione', align: 'end', render: (b) => formatDimensione(b.dimensioneKb) },
]

function SalvaDatabase() {
  return (
    <>
      <h2 className='mb-3'>Salva database</h2>
      <p className='text-muted'>Esporta tutti i dati in un file zip, da conservare come copia di sicurezza.</p>

      <Alert variant='warning'>
        Prototipo: il salvataggio vero arriverà quando ci sarà il database.
      </Alert>

      <Button type='button' className='mb-4'>
        <BsDownload className='me-2' />
        Salva database
      </Button>

      <h3 className='h5 mb-3'>Salvataggi precedenti</h3>
      <DataTable columns={columns} rows={backup} />
    </>
  )
}

export default SalvaDatabase