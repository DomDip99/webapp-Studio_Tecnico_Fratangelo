import Table from 'react-bootstrap/Table'

// columns: [{ key, label, align?, render? }]  rows: [{ id, ... }]
function DataTable({ columns, rows, selectedId, onSelect, rowClassName }) {
  return (
    <Table hover responsive size='sm' className='align-middle'>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} className={c.align ? `text-${c.align}` : undefined}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className='text-center text-muted py-4'>
              Nessun elemento
            </td>
          </tr>
        )}
        {rows.map((row) => {
          const classi = [rowClassName?.(row), row.id === selectedId ? 'table-active' : null]
            .filter(Boolean)
            .join(' ')

          return (
            <tr
              key={row.id}
              className={classi || undefined}
              style={onSelect ? { cursor: 'pointer' } : undefined}
              onClick={() => onSelect?.(row.id)}
            >
              {columns.map((c) => (
                <td key={c.key} className={c.align ? `text-${c.align}` : undefined}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default DataTable