import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { NavLink, useLocation } from 'react-router-dom'
import { BsPersonCircle } from 'react-icons/bs'
import dayjs from 'dayjs'
import { menu } from '../config/menu.js'

function Sidebar({ soloDaPagare, onToggleSoloDaPagare }) {
  const { pathname } = useLocation()
  const sezioneAttiva =
    menu.find((s) => s.items.some((i) => i.path === pathname))?.id ?? 'gestione'

  return (
    <aside className='app-sidebar'>
      <NavLink to='/' className='p-3 fs-5 fw-bold text-body text-decoration-none'>
        STLF
      </NavLink>

      <Accordion defaultActiveKey={sezioneAttiva} flush>
        {menu.map((sezione) => (
          <Accordion.Item key={sezione.id} eventKey={sezione.id}>
            <Accordion.Header>{sezione.label}</Accordion.Header>
            <Accordion.Body className='p-0'>
              <ListGroup variant='flush'>
                {sezione.items.map(({ label, path, icon: Icon }) => (
                  <ListGroup.Item key={path} as={NavLink} to={path} action>
                    <Icon className='me-2' />
                    {label}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div className='mt-auto p-3 border-top'>
        <Button
          variant={soloDaPagare ? 'primary' : 'outline-secondary'}
          size='sm'
          className='w-100 mb-3'
          aria-pressed={soloDaPagare}
          onClick={onToggleSoloDaPagare}
        >
          Solo voci da pagare
        </Button>
        <div className='small text-muted text-center mb-2'>
          {dayjs().format('dddd D MMMM YYYY')}
        </div>
        <div className='small'>
          <BsPersonCircle className='me-1' />
          Utente demo
        </div>
      </div>
    </aside>
  )
}

export default Sidebar