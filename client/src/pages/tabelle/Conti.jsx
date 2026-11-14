import EntityPage from '../../components/EntityPage.jsx'
import { conti } from '../../mocks/tabelle.js'

const fields = [
  { name: 'nome', label: 'Nome', width: 5 },
  { name: 'numero', label: 'Num. conto', width: 4 },
  { name: 'archiviato', label: 'Archiviato', type: 'checkbox', width: 3 },
]

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'numero', label: 'Numero conto' },
]

function Conti() {
  return (
    <EntityPage
      title='Conti'
      fields={fields}
      columns={columns}
      rows={conti}
      rowClassName={(conto) => (conto.archiviato ? 'row-muted' : undefined)}
    />
  )
}

export default Conti