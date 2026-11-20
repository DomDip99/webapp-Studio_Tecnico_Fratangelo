import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import dayjs from 'dayjs'
import { formatoISO } from '../../utils/calendario.js'

function AnnoEsercizio({ oggi = formatoISO(dayjs()) }) {
  const annoCorrente = dayjs(oggi).year()
  const anni = Array.from({ length: 5 }, (_, i) => annoCorrente - i)
  const [valore, setValore] = useState(annoCorrente)
  const [impostato, setImpostato] = useState(annoCorrente)

  function imposta(event) {
    event.preventDefault()
    setImpostato(valore)
  }

  return (
    <>
      <h2 className='mb-3'>Anno esercizio</h2>
      <p className='text-muted'>
        L&apos;anno di cui si consultano i dati. Nel prototipo l&apos;anno impostato qui non viene
        ancora applicato alle altre pagine.
      </p>

      <Alert variant='info'>
        Anno di esercizio: <strong>{impostato}</strong>
      </Alert>

      <Form onSubmit={imposta} style={{ maxWidth: 360 }}>
        <Form.Group controlId='anno-esercizio' className='mb-3'>
          <Form.Label>Anno</Form.Label>
          <Form.Select value={valore} onChange={(e) => setValore(Number(e.target.value))}>
            {anni.map((anno) => (
              <option key={anno} value={anno}>
                {anno}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button type='submit'>Imposta anno</Button>
      </Form>
    </>
  )
}

export default AnnoEsercizio