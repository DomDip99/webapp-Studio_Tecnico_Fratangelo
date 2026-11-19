import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import dayjs from 'dayjs'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import {
  GIORNI_BREVI,
  etichettaGiorno,
  formatoISO,
  giorniDelMese,
  nomeMese,
  settimaneDelMese,
} from '../utils/calendario.js'

const nomeCompleto = (iso) => `${dayjs(iso).date()} ${nomeMese(iso).toLowerCase()} ${dayjs(iso).year()}`

// Componente controllato: "value" è il giorno selezionato (ISO), "onChange" riceve il nuovo giorno
function CalendarioGiorni({ value, onChange, oggi = formatoISO(dayjs()) }) {
  const corrente = dayjs(value)

  return (
    <Row className='g-3'>
      <Col xs='auto'>
        <div className='border rounded p-2'>
          <div className='d-flex align-items-center justify-content-between mb-2'>
            <Button
              type='button'
              size='sm'
              variant='outline-secondary'
              aria-label='Mese precedente'
              onClick={() => onChange(formatoISO(corrente.subtract(1, 'month')))}
            >
              <BsChevronLeft />
            </Button>
            <strong>
              {nomeMese(value).toLowerCase()} {corrente.year()}
            </strong>
            <Button
              type='button'
              size='sm'
              variant='outline-secondary'
              aria-label='Mese successivo'
              onClick={() => onChange(formatoISO(corrente.add(1, 'month')))}
            >
              <BsChevronRight />
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 2.25rem)', gap: 2 }}>
            {GIORNI_BREVI.map((g) => (
              <div key={g} className='text-center small text-muted'>
                {g}
              </div>
            ))}
            {settimaneDelMese(value)
              .flat()
              .map(({ iso, delMese }) => (
                <Button
                  key={iso}
                  type='button'
                  size='sm'
                  variant={iso === value ? 'primary' : iso === oggi ? 'outline-primary' : 'link'}
                  className={`p-1 text-decoration-none ${delMese ? '' : 'text-muted'}`}
                  aria-label={nomeCompleto(iso)}
                  aria-pressed={iso === value}
                  onClick={() => onChange(iso)}
                >
                  {dayjs(iso).date()}
                </Button>
              ))}
          </div>

          <Button
            type='button'
            size='sm'
            variant='outline-secondary'
            className='w-100 mt-2'
            onClick={() => onChange(oggi)}
          >
            Oggi: {dayjs(oggi).format('DD/MM/YYYY')}
          </Button>
        </div>
      </Col>

      <Col>
        <ListGroup style={{ maxHeight: 250, overflowY: 'auto' }}>
          {giorniDelMese(value).map((iso) => (
            <ListGroup.Item
              key={iso}
              as='button'
              type='button'
              action
              active={iso === value}
              aria-pressed={iso === value}
              onClick={() => onChange(iso)}
            >
              {etichettaGiorno(iso)}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Row>
  )
}

export default CalendarioGiorni