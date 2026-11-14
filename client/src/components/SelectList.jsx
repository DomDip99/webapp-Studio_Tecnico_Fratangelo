import ListGroup from 'react-bootstrap/ListGroup'

// items: [{ id, label, muted? }]
function SelectList({ title, items, selectedId, onSelect }) {
  return (
    <section className='mb-3'>
      <h3 className='h6 text-uppercase text-muted'>{title}</h3>
      <ListGroup>
        {items.map(({ id, label, muted }) => (
          <ListGroup.Item
            key={id}
            as='button'
            type='button'
            action
            active={id === selectedId}
            aria-pressed={id === selectedId}
            className={muted ? 'fst-italic text-muted' : undefined}
            onClick={() => onSelect(id)}
          >
            {label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </section>
  )
}

export default SelectList