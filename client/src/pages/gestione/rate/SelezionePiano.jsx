import Form from 'react-bootstrap/Form'
import { piani } from '../../../mocks/rate.js'

// Mostra anche il piano selezionato se è archiviato, altrimenti il menu non lo troverebbe
function SelezionePiano({ pianoId, onSelect }) {
  return (
    <Form.Group controlId='piano' className='mb-3' style={{ maxWidth: 480 }}>
      <Form.Label>Piano</Form.Label>
      <Form.Select value={pianoId} onChange={(e) => onSelect(Number(e.target.value))}>
        {piani
          .filter((p) => !p.archiviato || p.id === pianoId)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.descrizione}
            </option>
          ))}
      </Form.Select>
    </Form.Group>
  )
}

export default SelezionePiano