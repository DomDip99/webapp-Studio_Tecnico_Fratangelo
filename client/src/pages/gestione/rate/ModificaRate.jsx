import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import dayjs from 'dayjs'
import DataTable from '../../../components/DataTable.jsx'
import FormFields from '../../../components/FormFields.jsx'
import Toolbar from '../../../components/Toolbar.jsx'
import SelezionePiano from './SelezionePiano.jsx'
import { rate } from '../../../mocks/rate.js'
import { conti } from '../../../mocks/tabelle.js'
import { formatEuro } from '../../../utils/format.js'
import { useOutletContext } from 'react-router-dom'

const fields = [
  { name: 'data', label: 'Data', width: 3 },
  { name: 'descrizione', label: 'Descrizione', width: 5 },
  { name: 'importo', label: 'Importo', width: 4 },
  { name: 'conto', label: 'Conto', type: 'select', options: conti.map((c) => c.nome), width: 4 },
  { name: 'pagata', label: 'Pagata', type: 'checkbox', width: 3 },
]

const columns = [
  { key: 'data', label: 'Data', render: (r) => dayjs(r.data).format('DD/MM/YYYY') },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'conto', label: 'Conto' },
  { key: 'entrata', label: 'Entrata', align: 'end', render: (r) => formatEuro(r.entrata) },
  { key: 'uscita', label: 'Uscita', align: 'end', render: (r) => formatEuro(r.uscita) },
  { key: 'pagata', label: 'Pag.', align: 'center', render: (r) => (r.pagata ? 'Sì' : 'No') },
]

function ModificaRate({ pianoId, onSelectPiano }) {
  const { soloDaPagare } = useOutletContext()
  const [rataId, setRataId] = useState(null)

  const righe = rate.filter((r) => r.pianoId === pianoId && (!soloDaPagare || !r.pagata))
  // Se la rata selezionata appartiene a un altro piano, si ripiega sulla prima
  const selezionata = righe.find((r) => r.id === rataId) ?? righe[0]

  const valori = selezionata && {
    data: dayjs(selezionata.data).format('DD/MM/YYYY'),
    descrizione: selezionata.descrizione,
    importo: formatEuro(selezionata.entrata ?? selezionata.uscita),
    conto: selezionata.conto,
    pagata: selezionata.pagata,
  }

  return (
    <>
      <SelezionePiano pianoId={pianoId} onSelect={onSelectPiano} />
      <Toolbar />

      <Form key={selezionata?.id ?? 'vuoto'} className='mb-4' onSubmit={(e) => e.preventDefault()}>
        <FormFields fields={fields} values={valori} />
      </Form>

      <DataTable
        columns={columns}
        rows={righe}
        selectedId={selezionata?.id}
        onSelect={setRataId}
        rowClassName={(r) => (r.pagata ? undefined : 'table-success')}
      />
    </>
  )
}

export default ModificaRate