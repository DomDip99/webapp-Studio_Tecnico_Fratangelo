import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { NavLink, useLocation } from 'react-router-dom'
import { BsPersonCircle, BsBoxArrowRight } from 'react-icons/bs'
import dayjs from 'dayjs'
import { sezioniVisibili } from '../config/menu.js'
import { useAuth } from '../auth/useAuth.js'

function Sidebar({ soloDaPagare, onToggleSoloDaPagare }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  const sezioni = sezioniVisibili(user.ruolo)
  const sezioneAttiva =
    sezioni.find((s) => s.items.some((i) => i.path === pathname))?.id ?? 'gestione'

  return (
    <aside className='app-sidebar'>
      <NavLink to='/' className='p-3 fs-5 fw-bold text-body text-decoration-none'>
        STLF
      </NavLink>

      <Accordion defaultActiveKey={sezioneAttiva} flush>
        {sezioni.map((sezione) => (
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
        <div className='small text-muted text-center mb-3'>
          {dayjs().format('dddd D MMMM YYYY')}
        </div>
        <div className='d-flex align-items-center mb-2'>
          <BsPersonCircle className='me-2 fs-4' />
          <div className='lh-sm'>
            <div className='fw-semibold'>{user.nome}</div>
            <div className='small text-muted text-capitalize'>{user.ruolo}</div>
          </div>
        </div>
        <Button variant='outline-danger' size='sm' className='w-100' onClick={logout}>
          <BsBoxArrowRight className='me-2' />
          Esci
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar