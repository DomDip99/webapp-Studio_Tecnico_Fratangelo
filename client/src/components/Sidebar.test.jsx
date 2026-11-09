import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthProvider.jsx'
import RequireAuth from '../auth/RequireAuth.jsx'
import Sidebar from './Sidebar.jsx'

const admin = { username: 'admin', nome: 'Admin Demo', ruolo: 'admin' }
const utente = { username: 'utente', nome: 'Utente Demo', ruolo: 'utente' }

function renderSidebar(user) {
  sessionStorage.setItem('stlf-user', JSON.stringify(user))

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/login' element={<h1>Accedi</h1>} />
          <Route element={<RequireAuth />}>
            <Route
              path='/'
              element={<Sidebar soloDaPagare={false} onToggleSoloDaPagare={() => {}} />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('mostra nome e ruolo dell\'utente', () => {
    renderSidebar(admin)

    expect(screen.getByText('Admin Demo')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('l\'admin vede la sezione Fatture', () => {
    renderSidebar(admin)

    expect(screen.getByRole('button', { name: 'Fatture' })).toBeInTheDocument()
  })

  it('l\'utente normale non vede la sezione Fatture', () => {
    renderSidebar(utente)

    expect(screen.queryByRole('button', { name: 'Fatture' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gestione' })).toBeInTheDocument()
  })

  it('il pulsante Esci riporta al login', async () => {
    const user = userEvent.setup()
    renderSidebar(admin)

    await user.click(screen.getByRole('button', { name: 'Esci' }))

    expect(await screen.findByRole('heading', { name: 'Accedi' })).toBeInTheDocument()
    expect(sessionStorage.getItem('stlf-user')).toBeNull()
  })
})