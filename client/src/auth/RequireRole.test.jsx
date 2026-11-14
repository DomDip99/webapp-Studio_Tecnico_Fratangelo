import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthProvider.jsx'
import RequireAuth from './RequireAuth.jsx'
import RequireRole from './RequireRole.jsx'
import { Outlet, useOutletContext } from 'react-router-dom'

function renderRiservata(user) {
  sessionStorage.setItem('stlf-user', JSON.stringify(user))

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/riservata']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route index element={<h1>Home</h1>} />
            <Route element={<RequireRole ruoli={['admin']} />}>
              <Route path='/riservata' element={<h1>Area riservata</h1>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('RequireRole', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('lascia passare chi ha il ruolo richiesto', () => {
    renderRiservata({ username: 'admin', nome: 'Admin Demo', ruolo: 'admin' })

    expect(screen.getByRole('heading', { name: 'Area riservata' })).toBeInTheDocument()
  })

  it('rimanda alla home chi non ha il ruolo', () => {
    renderRiservata({ username: 'utente', nome: 'Utente Demo', ruolo: 'utente' })

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByText('Area riservata')).not.toBeInTheDocument()
  })
})

function LeggiContesto() {
  const { soloDaPagare } = useOutletContext()
  return <p>soloDaPagare: {String(soloDaPagare)}</p>
}

describe('RequireRole e contesto del Layout', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('passa alle pagine il contesto ricevuto dal Layout', () => {
    sessionStorage.setItem(
      'stlf-user',
      JSON.stringify({ username: 'admin', nome: 'Admin Demo', ruolo: 'admin' }),
    )

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/riservata']}>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route element={<Outlet context={{ soloDaPagare: true }} />}>
                <Route element={<RequireRole ruoli={['admin']} />}>
                  <Route path='/riservata' element={<LeggiContesto />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    )

    expect(screen.getByText('soloDaPagare: true')).toBeInTheDocument()
  })
})