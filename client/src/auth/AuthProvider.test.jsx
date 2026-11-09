import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider } from './AuthProvider.jsx'
import { useAuth } from './useAuth.js'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('parte senza utente', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
  })

  it('accetta credenziali corrette', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    let esito
    await act(async () => {
      esito = await result.current.login('admin', 'admin123')
    })

    expect(esito.ok).toBe(true)
    expect(result.current.user.ruolo).toBe('admin')
    expect(result.current.user).not.toHaveProperty('password')
  })

  it('rifiuta credenziali sbagliate', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    let esito
    await act(async () => {
      esito = await result.current.login('admin', 'sbagliata')
    })

    expect(esito.ok).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('esce con il logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('utente', 'utente123')
    })
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })

  it('ripristina l\'utente dalla sessione', async () => {
    const primo = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await primo.result.current.login('admin', 'admin123')
    })
    primo.unmount()

    const secondo = renderHook(() => useAuth(), { wrapper })

    expect(secondo.result.current.user.username).toBe('admin')
  })
})