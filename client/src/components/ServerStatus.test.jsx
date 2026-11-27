import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ServerStatus from './ServerStatus.jsx'

// Sostituisce fetch con una funzione finta, così il test non dipende dal server vero
const rispondeCon = (risposta) => vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(risposta)))

describe('ServerStatus', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('mostra "Server online" se il server risponde', async () => {
    rispondeCon({ ok: true, json: () => Promise.resolve({ status: 'ok' }) })
    render(<ServerStatus />)

    expect(await screen.findByText('Server online')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/health')
  })

  it('mostra un errore se il server risponde con un codice di errore', async () => {
    rispondeCon({ ok: false, status: 500 })
    render(<ServerStatus />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Server non raggiungibile: Server Error: status code 500',
    )
  })

  it('mostra un errore se la rete non risponde', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Failed to fetch'))))
    render(<ServerStatus />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Server non raggiungibile: Failed to fetch',
    )
  })

  it('finché attende la risposta non mostra né successo né errore', () => {
    // una promessa che non si risolve mai simula una richiesta ancora in corso
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
    render(<ServerStatus />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})