import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import dayjs from 'dayjs'
import { dataEstesa, formatoISO } from '../../utils/calendario.js'

function DataCorrente({ oggi = formatoISO(dayjs()) }) {
  const [valore, setValore] = useState(oggi)
  const [impostata, setImpostata] = useState(oggi)

  function imposta(event) {
    event.preventDefault()
    if (valore) setImpostata(valore)
  }

  function ripristina() {
    setValore(oggi)
    setImpostata(oggi)
  }

  return (
    <>
      <h2 className='mb-3'>Data corrente</h2>
      <p className='text-muted'>
        La data di lavoro usata dall&apos;app. Di norma è quella di oggi. Nel prototipo la data
        impostata qui non viene ancora applicata alle altre pagine.
      </p>

      <Alert variant='info'>
        Data di lavoro: <strong>{dataEstesa(impostata)}</strong>
      </Alert>

      <Form onSubmit={imposta} style={{ maxWidth: 360 }}>
        <Form.Group controlId='data-lavoro' className='mb-3'>
          <Form.Label>Nuova data di lavoro</Form.Label>
          <Form.Control type='date' required value={valore} onChange={(e) => setValore(e.target.value)} />
        </Form.Group>
        <div className='d-flex gap-2'>
          <Button type='submit'>Imposta</Button>
          <Button type='button' variant='outline-secondary' onClick={ripristina}>
            Ripristina oggi
          </Button>
        </div>
      </Form>
    </>
  )
}

export default DataCorrente