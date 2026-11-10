import EntityPage from '../../components/EntityPage.jsx'
import { operazioni } from '../../mocks/tabelle.js'

const fields = [
  { name: 'nome', label: 'Nome', width: 6 },
  { name: 'tipo', label: 'Tipo', type: 'select', options: ['Entrata', 'Uscita'], width: 3 },
]

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'tipo', label: 'Tipo' },
]

function Operazioni() {
  return <EntityPage title='Operazioni' fields={fields} columns={columns} rows={operazioni} />
}

export default Operazioni