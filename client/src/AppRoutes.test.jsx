import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider.jsx'
import AppRoutes from './AppRoutes.jsx'
import { menu } from './config/menu.js'
import { movimenti } from './mocks/movimenti.js'

const admin = { username: 'admin', nome: 'Admin Demo', ruolo: 'admin' }
const utente = { username: 'utente', nome: 'Utente Demo', ruolo: 'utente'}

const percorsi = menu.flatMap((sezione) => sezione.items.map((voce) => voce.path))

// Disegna l'app vera a partire dall'indirizzo dato, con o senza un utente già entrato
function renderApp(percorso, user) {
  if (user) sessionStorage.setItem('stlf-user', JSON.stringify(user))

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[percorso]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  )
}

// Limita la ricerca all'area principale: la barra laterale ha anch'essa dei titoli
const main = () => within(screen.getByRole('main'))

describe('App: rotte', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it.each(percorsi)('senza accesso la pagina %s rimanda al login', (percorso) => {
    renderApp(percorso)

    expect(screen.getByRole('heading', { name: 'Accedi' })).toBeInTheDocument()
  })

  it.each(percorsi)('la pagina %s si apre senza errori', (percorso) => {
    renderApp(percorso, admin)

    const titolo = main().getByRole('heading', { level: 2 })
    expect(titolo).not.toHaveTextContent('Pagina non trovata')
  })

  it('un indirizzo inesistente mostra "Pagina non trovata"', () => {
    renderApp('/boh', admin)

    expect(main().getByRole('heading', { level: 2, name: 'Pagina non trovata' })).toBeInTheDocument()
  })
})

describe('App: flussi', () => {
  beforeEach(() => {
    sessionStorage.clear()
    // La home controlla il server: nei test lo simuliamo online
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'ok' }) })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('flusso completo: accesso, navigazione, uscita', async () => {
    const user = userEvent.setup()
    renderApp('/gestione/prima-nota')

    await user.type(screen.getByLabelText('Utente'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin123')
    await user.click(screen.getByRole('button', { name: 'Accedi' }))

    expect(await screen.findByRole('heading', { name: 'Benvenuto, Admin Demo' })).toBeInTheDocument()
    await screen.findByText('Server online')

    await user.click(screen.getByRole('link', { name: 'Prima nota' }))
    expect(main().getByRole('heading', { level: 2, name: 'Prima nota' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Esci' }))
    expect(await screen.findByRole('heading', { name: 'Accedi' })).toBeInTheDocument()
  })

  it('si naviga tra le sezioni dal menu laterale', async () => {
    const user = userEvent.setup()
    renderApp('/', admin)
    await screen.findByText('Server online')

    await user.click(screen.getByRole('button', { name: 'Tabelle' }))
    await user.click(screen.getByRole('link', { name: 'Conti' }))

    expect(main().getByRole('heading', { level: 2, name: 'Conti' })).toBeInTheDocument()
  })

  it('il filtro della barra laterale arriva alla pagina', async () => {
    const user = userEvent.setup()
    renderApp('/gestione/prima-nota', admin)
    const righe = () => main().getAllByRole('row').length - 1

    expect(righe()).toBe(movimenti.length)

    await user.click(screen.getByRole('button', { name: 'Solo voci da pagare' }))

    expect(righe()).toBe(movimenti.filter((m) => !m.pagata).length)
  })

  it("l'admin entra in Fatture", () => {
    renderApp('/fatture', admin)

    expect(main().getByRole('heading', { level: 2, name: 'Gestione fatture' })).toBeInTheDocument()
  })

  it('un utente senza il ruolo admin viene rimandato alla home da Fatture', async () => {
    renderApp('/fatture', utente)

    expect(await screen.findByRole('heading', { name: 'Benvenuto, Utente Demo' })).toBeInTheDocument()
    await screen.findByText('Server online')
  })
})