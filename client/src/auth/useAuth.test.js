import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from './useAuth.js'

describe('useAuth', () => {
  it('lancia un errore chiaro se usato fuori da AuthProvider', () => {
    // React stampa l'errore in console: lo si silenzia per non sporcare l'output dei test
    const silenzia = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useAuth())).toThrow('useAuth va usato dentro AuthProvider')

    silenzia.mockRestore()
  })
})