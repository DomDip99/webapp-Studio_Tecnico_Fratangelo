import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import DataTable from './DataTable.jsx'
import FormFields from './FormFields.jsx'
import Toolbar from './Toolbar.jsx'

// fields: [{ name, label, type?, options?, width?, readOnly? }]
function EntityPage({ title, fields, columns, rows, rowClassName }) {
  const [selectedId, setSelectedId] = useState(rows[0]?.id ?? null)
  const selected = rows.find((r) => r.id === selectedId)

  return (
    <>
      <h2 className='mb-3'>{title}</h2>
      <Toolbar />

      {/* "key" ricrea il form a ogni selezione, così mostra i valori del nuovo record */}
      <Form key={selectedId} className='mb-4' onSubmit={(e) => e.preventDefault()}>
        <FormFields fields={fields} values={selected} />
      </Form>

      <DataTable
        columns={columns}
        rows={rows}
        selectedId={selectedId}
        onSelect={setSelectedId}
        rowClassName={rowClassName}
      />
    </>
  )
}

export default EntityPage