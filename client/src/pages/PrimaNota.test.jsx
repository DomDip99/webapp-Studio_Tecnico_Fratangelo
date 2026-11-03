import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import PrimaNota from './PrimaNota.jsx'
import { movimenti } from '../mocks/movimenti.js'

// PrimaNota legge "soloDaPagare" dal Layout tramite l'Outlet.
// Nel test ricreo quel contesto con un Outlet minimale.
function renderPrimaNota(soloDaPagare = false) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={{ soloDaPagare }} />}>
          <Route index element={<PrimaNota />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('PrimaNota', () => {
  it('mostra il titolo', () => {
    renderPrimaNota()

    expect(screen.getByRole('heading', { name: 'Prima nota' })).toBeInTheDocument()
  })

  it('mostra tutti i movimenti', () => {
    renderPrimaNota()

    // una riga di intestazione + una per ogni movimento
    expect(screen.getAllByRole('row')).toHaveLength(movimenti.length + 1)
  })

  it('con il filtro attivo mostra solo i movimenti non pagati', () => {
    renderPrimaNota(true)

    const nonPagati = movimenti.filter((m) => !m.pagata)
    expect(screen.getAllByRole('row')).toHaveLength(nonPagati.length + 1)
  })

  it('evidenzia le righe non pagate', () => {
    renderPrimaNota()

    const nonPagati = movimenti.filter((m) => !m.pagata)
    const evidenziate = screen
      .getAllByRole('row')
      .filter((riga) => riga.classList.contains('table-danger'))
    expect(evidenziate).toHaveLength(nonPagati.length)
  })

  it('mostra importi e date formattati in italiano', () => {
    renderPrimaNota()

    expect(screen.getByText('1.500,00 €')).toBeInTheDocument()
    expect(screen.getByText('24/04/2026')).toBeInTheDocument()
  })
})