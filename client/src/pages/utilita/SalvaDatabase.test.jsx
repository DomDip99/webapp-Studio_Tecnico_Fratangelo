import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SalvaDatabase from './SalvaDatabase.jsx'
import { backup } from '../../mocks/backup.js'

describe('SalvaDatabase', () => {
  it('elenca i salvataggi precedenti', () => {
    render(<SalvaDatabase />)

    expect(screen.getAllByRole('row')).toHaveLength(backup.length + 1)
    expect(screen.getByText('backup-2026-11-01.zip')).toBeInTheDocument()
    expect(screen.getByText('01/11/2026')).toBeInTheDocument()
  })

  it('mostra le dimensioni in megabyte', () => {
    render(<SalvaDatabase />)

    expect(screen.getByText('2,5 MB')).toBeInTheDocument()
    expect(screen.getByText('2,3 MB')).toBeInTheDocument()
  })

  it('ha il pulsante per salvare e avvisa che è un prototipo', () => {
    render(<SalvaDatabase />)

    expect(screen.getByRole('button', { name: 'Salva database' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Prototipo')
  })
})