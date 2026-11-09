import { useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { users } from './users.js'

const STORAGE_KEY = 'stlf-user'

function loadUser() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveUser(user) {
  try {
    if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // lo storage può non essere disponibile: l'app funziona comunque, senza ricordare la sessione
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  // È async di proposito: il login vero chiamerà il server e i chiamanti non dovranno cambiare
  async function login(username, password) {
    const found = users.find((u) => u.username === username && u.password === password)
    if (!found) return { ok: false, error: 'Utente o password errati' }

    const safeUser = { username: found.username, nome: found.nome, ruolo: found.ruolo }
    setUser(safeUser)
    saveUser(safeUser)
    return { ok: true }
  }

  function logout() {
    setUser(null)
    saveUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}