import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth.js'

// Used inside RequireAuth, user always exists
// If 'ruoli' is not specified everyone passes; users without role redirected to home
function RequireRole({ ruoli }) {
  const { user } = useAuth()

  if (ruoli && !ruoli.includes(user.ruolo)) return <Navigate to='/' replace />

  return <Outlet />
}

export default RequireRole