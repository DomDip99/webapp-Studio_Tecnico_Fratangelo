import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'

// Disegna una pagina dentro un Outlet che le passa il contesto del Layout (es. { soloDaPagare })
export function renderWithOutlet(ui, context = { soloDaPagare: false }) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={context} />}>
          <Route index element={ui} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}