import EntityPage from '../../components/EntityPage.jsx'
import { clienti } from '../../mocks/clienti.js'
import { assegnatari } from '../../mocks/tabelle.js'

const fields = [
  { name: 'nome', label: 'Nome', width: 6 },
  { name: 'titolo', label: 'Titolo', width: 3 },
  { name: 'archiviato', label: 'Archiviato', type: 'checkbox', width: 3 },
  { name: 'indirizzo', label: 'Indirizzo', width: 5 },
  { name: 'cap', label: 'CAP', width: 2 },
  { name: 'citta', label: 'Città', width: 3 },
  { name: 'provincia', label: 'Provincia', width: 2 },
  { name: 'cf', label: 'C.F.', width: 4 },
  { name: 'piva', label: 'P.IVA', width: 4 },
  {
    name: 'intestatario',
    label: 'Intestatario',
    type: 'select',
    options: ['', ...assegnatari.map((a) => a.nome)],
    width: 4,
  },
  { name: 'tel1', label: 'Tel. 1', width: 3 },
  { name: 'tel2', label: 'Tel. 2', width: 3 },
  { name: 'fax', label: 'Fax', width: 3 },
  { name: 'email', label: 'E-mail', width: 3 },
]

const columns = [
  { key: 'nome', label: 'Nome cliente' },
  { key: 'citta', label: 'Città' },
]

function Clienti() {
  return (
    <EntityPage
      title='Clienti'
      fields={fields}
      columns={columns}
      rows={clienti}
      rowClassName={(cliente) => (cliente.archiviato ? 'row-muted' : undefined)}
    />
  )
}

export default Clienti