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

  let controllo
  if (type === 'select') {
    controllo = (
      <Form.Select defaultValue={valore ?? ''}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Form.Select>
    )
  } else if (type === 'textarea') {
    controllo = <Form.Control as='textarea' rows={3} defaultValue={valore ?? ''} readOnly={readOnly} />
  } else {
    controllo = <Form.Control type='text' defaultValue={valore ?? ''} readOnly={readOnly} />
  }

  return (
    <Form.Group controlId={`campo-${name}`}>
      <Form.Label>{label}</Form.Label>
      {controllo}
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