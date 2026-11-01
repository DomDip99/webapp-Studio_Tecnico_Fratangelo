import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

function Layout() {
  const [soloDaPagare, setSoloDaPagare] = useState(false)

  return (
    <div className='app-shell'>
      <Sidebar
        soloDaPagare={soloDaPagare}
        onToggleSoloDaPagare={() => setSoloDaPagare((v) => !v)}
      />
      <main className='app-main p-4'>
        <Outlet context={{ soloDaPagare }} />
      </main>
    </div>
  )
}

export default Layout