import Button from 'react-bootstrap/Button'
import {
  BsFileEarmarkPlus,
  BsPencilSquare,
  BsCheck2Square,
  BsXCircle,
  BsTrash,
  BsArrowClockwise,
} from 'react-icons/bs'

const azioni = [
  { id: 'nuovo', label: 'Nuovo', icon: BsFileEarmarkPlus },
  { id: 'modifica', label: 'Modifica', icon: BsPencilSquare },
  { id: 'registra', label: 'Registra', icon: BsCheck2Square },
  { id: 'annulla', label: 'Annulla', icon: BsXCircle },
  { id: 'elimina', label: 'Elimina', icon: BsTrash },
  { id: 'refresh', label: 'Refresh', icon: BsArrowClockwise },
]

// "disabled" elenca gli id delle azioni da disattivare; "children" permette di aggiungere pulsanti propri
function Toolbar({ disabled = ['registra', 'annulla'], label = 'Azioni', children }) {
  return (
    <div className='d-flex flex-wrap gap-1 mb-3' role='toolbar' aria-label={label}>
      {azioni.map(({ id, label, icon: Icon }) => (
        <Button key={id} type='button' variant='outline-secondary' size='sm' disabled={disabled.includes(id)}>
          <Icon className='me-1' />
          {label}
        </Button>
      ))}
      {children}
    </div>
  )
}

export default Toolbar