import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

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

// fields: [{ name, label, type?, options?, width?, readOnly? }]   values: oggetto con i valori iniziali
function FormFields({ fields, values }) {
  return (
    <Row className='g-3'>
      {fields.map((campo) => (
        <Col
          key={campo.name}
          md={campo.width ?? 4}
          className={campo.type === 'checkbox' ? 'd-flex align-items-end pb-2' : undefined}
        >
          <Campo campo={campo} valore={values?.[campo.name]} />
        </Col>
      ))}
    </Row>
  )
}

export default FormFields