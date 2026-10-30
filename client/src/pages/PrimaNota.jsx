import { useOutletContext } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import dayjs from 'dayjs'
import { movimenti } from '../mocks/movimenti.js'
import { formatEuro } from '../utils/format.js'

function PrimaNota() {
  const { soloDaPagare } = useOutletContext()
  const righe = soloDaPagare ? movimenti.filter((m) => !m.pagata) : movimenti

  return (
    <>
      <h2 className='mb-3'>Prima nota</h2>
      <Table hover responsive size='sm' className='align-middle'>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrizione</th>
            <th>Note</th>
            <th>Operazione</th>
            <th>Conto</th>
            <th className='text-end'>Entrata</th>
            <th className='text-end'>Uscita</th>
            <th className='text-center'>Pag.</th>
            <th className='text-center'>Doc.</th>
          </tr>
        </thead>
        <tbody>
          {righe.length === 0 && (
            <tr>
              <td colSpan={9} className='text-center text-muted py-4'>
                Nessun movimento
              </td>
            </tr>
          )}
          {righe.map((m) => (
            <tr key={m.id} className={m.pagata ? '' : 'table-danger'}>
              <td>{dayjs(m.data).format('DD/MM/YYYY')}</td>
              <td>{m.descrizione}</td>
              <td>{m.note}</td>
              <td>{m.operazione}</td>
              <td>{m.conto}</td>
              <td className='text-end'>{formatEuro(m.entrata)}</td>
              <td className='text-end'>{formatEuro(m.uscita)}</td>
              <td className='text-center'>{m.pagata ? 'Sì' : 'No'}</td>
              <td className='text-center'>{m.doc ? 'Sì' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default PrimaNota