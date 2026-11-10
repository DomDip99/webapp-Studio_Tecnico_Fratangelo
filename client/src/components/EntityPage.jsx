import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import DataTable from './DataTable.jsx'
import Toolbar from './Toolbar.jsx'

function Campo({ campo, valore }) {
  const { name, label, type = 'text', options = [], readOnly } = campo

  if (type === 'checkbox') {
    return (
      <Form.Check
        id={`campo-${name}`}
        type='checkbox'
        label={label}
        defaultChecked={Boolean(valore)}
      />
    )
  }

  return (
    <Form.Group controlId={`campo-${name}`}>
      <Form.Label>{label}</Form.Label>
      {type === 'select' ? (
        <Form.Select defaultValue={valore ?? ''}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control type='text' defaultValue={valore ?? ''} readOnly={readOnly} />
      )}
    </Form.Group>
  )
}

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
        <Row className='g-3'>
          {fields.map((campo) => (
            <Col
              key={campo.name}
              md={campo.width ?? 4}
              className={campo.type === 'checkbox' ? 'd-flex align-items-end pb-2' : undefined}
            >
              <Campo campo={campo} valore={selected?.[campo.name]} />
            </Col>
          ))}
        </Row>
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