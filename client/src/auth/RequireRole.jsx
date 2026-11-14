import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from './useAuth.js'

// Used inside RequireAuth, user always exists
// If 'ruoli' is not specified everyone passes; users without role redirected to home
function RequireRole({ ruoli }) {
  const { user } = useAuth()

  // pass to the pages the context received from Layout component
  const context = useOutletContext()

  if (ruoli && !ruoli.includes(user.ruolo)) return <Navigate to='/' replace />

  return <Outlet context={context}/>
}

export default RequireRole