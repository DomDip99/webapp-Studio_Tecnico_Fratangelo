import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthProvider.jsx'
import RequireAuth from '../auth/RequireAuth.jsx'
import Login from './Login.jsx'

function renderApp(percorso) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[percorso]}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route index element={<h1>Home</h1>} />
            <Route path='/privata' element={<h1>Area privata</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

async function accedi(user, username, password) {
  await user.type(screen.getByLabelText('Utente'), username)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Accedi' }))
}

describe('Login e rotte protette', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('senza accesso rimanda al login', () => {
    renderApp('/privata')

    expect(screen.getByRole('heading', { name: 'Accedi' })).toBeInTheDocument()
    expect(screen.queryByText('Area privata')).not.toBeInTheDocument()
  })

  it('dopo il login porta sempre alla home', async () => {
    const user = userEvent.setup()
    renderApp('/privata')

    await accedi(user, 'admin', 'admin123')

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByText('Area privata')).not.toBeInTheDocument()
  })

  it('con credenziali sbagliate mostra un errore e resta nel login', async () => {
    const user = userEvent.setup()
    renderApp('/privata')

    await accedi(user, 'admin', 'sbagliata')

    expect(await screen.findByRole('alert')).toHaveTextContent('Utente o password errati')
    expect(screen.queryByText('Area privata')).not.toBeInTheDocument()
  })

  it('chi è già dentro non vede il login', () => {
    sessionStorage.setItem(
      'stlf-user',
      JSON.stringify({ username: 'admin', nome: 'Admin Demo', ruolo: 'admin' }),
    )
    renderApp('/login')

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('il pulsante mostra e nasconde la password', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    const campo = screen.getByLabelText('Password')
    await user.type(campo, 'segreta')
    expect(campo).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostra password' }))
    expect(campo).toHaveAttribute('type', 'text')
    expect(campo).toHaveValue('segreta')

    await user.click(screen.getByRole('button', { name: 'Nascondi password' }))
    expect(campo).toHaveAttribute('type', 'password')
  })
})