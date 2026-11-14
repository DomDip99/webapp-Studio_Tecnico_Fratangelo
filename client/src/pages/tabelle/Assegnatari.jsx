import EntityPage from '../../components/EntityPage.jsx'
import { assegnatari } from '../../mocks/tabelle.js'

const fields = [
  { name: 'codice', label: 'Codice', width: 2, readOnly: true },
  { name: 'nome', label: 'Nome', width: 6 },
]

const columns = [
  { key: 'codice', label: 'Codice' },
  { key: 'nome', label: 'Nome' },
]

function Assegnatari() {
  return <EntityPage title='Assegnatari' fields={fields} columns={columns} rows={assegnatari} />
}

export default Assegnatari