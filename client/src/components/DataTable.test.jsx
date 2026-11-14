import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from './DataTable.jsx'

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'tipo', label: 'Tipo' },
]

const rows = [
  { id: 1, nome: 'Acconto', tipo: 'Entrata' },
  { id: 2, nome: 'Contanti', tipo: 'Uscita' },
]

describe('DataTable', () => {
  it('mostra intestazioni e righe', () => {
    render(<DataTable columns={columns} rows={rows} />)

    expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument()
    // una riga di intestazione + una per ogni elemento
    expect(screen.getAllByRole('row')).toHaveLength(rows.length + 1)
  })

  it('comunica quale riga è stata cliccata', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<DataTable columns={columns} rows={rows} onSelect={onSelect} />)

    await user.click(screen.getByText('Contanti'))

    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('evidenzia la riga selezionata', () => {
    render(<DataTable columns={columns} rows={rows} selectedId={1} />)

    const riga = screen.getByText('Acconto').closest('tr')
    expect(riga).toHaveClass('table-active')
  })

  it('usa la funzione render di una colonna', () => {
    const colonne = [{ key: 'nome', label: 'Nome', render: (r) => r.nome.toUpperCase() }]
    render(<DataTable columns={colonne} rows={rows} />)

    expect(screen.getByText('ACCONTO')).toBeInTheDocument()
  })

  it('mostra un messaggio se non ci sono elementi', () => {
    render(<DataTable columns={columns} rows={[]} />)

    expect(screen.getByText('Nessun elemento')).toBeInTheDocument()
  })
})