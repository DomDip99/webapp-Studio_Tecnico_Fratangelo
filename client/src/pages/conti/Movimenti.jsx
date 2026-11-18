import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import dayjs from 'dayjs'
import { BsCalculator, BsFunnel, BsPrinter } from 'react-icons/bs'
import DataTable from '../../components/DataTable.jsx'
import FormFields from '../../components/FormFields.jsx'
import Toolbar from '../../components/Toolbar.jsx'
import Totale from '../../components/Totale.jsx'
import { trasferimenti } from '../../mocks/conti.js'
import { conti } from '../../mocks/tabelle.js'
import { formatEuro } from '../../utils/format.js'

const nomiConti = ['', ...conti.map((c) => c.nome)]

const fields = [
  { name: 'data', label: 'Data', width: 3 },
  { name: 'contoUscita', label: 'Conto uscita', type: 'select', options: nomiConti, width: 4 },
  { name: 'contoIngresso', label: 'Conto ingresso', type: 'select', options: nomiConti, width: 4 },
  { name: 'descrizione', label: 'Descrizione', width: 8 },
  { name: 'importo', label: 'Importo', width: 4 },
]

const columns = [
  { key: 'data', label: 'Data', render: (t) => dayjs(t.data).format('DD/MM/YYYY') },
  { key: 'contoUscita', label: 'Conto uscita' },
  { key: 'contoIngresso', label: 'Conto ingresso' },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'importo', label: 'Importo', align: 'end', render: (t) => formatEuro(t.importo) },
]

function Movimenti() {
  const [selectedId, setSelectedId] = useState(trasferimenti[0]?.id ?? null)
  const selezionato = trasferimenti.find((t) => t.id === selectedId)

  const valori = selezionato && {
    ...selezionato,
    data: dayjs(selezionato.data).format('DD/MM/YYYY'),
    importo: formatEuro(selezionato.importo),
  }
  const totale = trasferimenti.reduce((somma, t) => somma + t.importo, 0)

  return (
    <>
      <h2 className='mb-3'>Movimenti conti</h2>

      <Toolbar>
        <Button type='button' variant='outline-secondary' size='sm'>
          <BsFunnel className='me-1' />
          Filtra movimenti
        </Button>
        <Button type='button' variant='outline-secondary' size='sm'>
          <BsPrinter className='me-1' />
          Stampa
        </Button>
      </Toolbar>

      {/* "key" ricrea il form a ogni selezione, così mostra i valori del nuovo movimento */}
      <Form key={selezionato?.id ?? 'vuoto'} className='mb-4' onSubmit={(e) => e.preventDefault()}>
        <FormFields fields={fields} values={valori} />
      </Form>

      <DataTable columns={columns} rows={trasferimenti} selectedId={selectedId} onSelect={setSelectedId} />

      <div className='d-flex align-items-center justify-content-between border-top pt-3'>
        <Button type='button' variant='outline-secondary' size='sm'>
          <BsCalculator className='me-1' />
          Ricalcola
        </Button>
        <dl className='mb-0'>
          <Totale label='Totale' value={formatEuro(totale)} />
        </dl>
      </div>
    </>
  )
}

export default Movimenti