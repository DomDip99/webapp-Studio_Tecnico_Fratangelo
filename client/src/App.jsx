import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Placeholder from './pages/Placeholder.jsx'
import { menu } from './config/menu.js'

const voci = menu.flatMap((sezione) => sezione.items)

function App() {
  return (
    <BrowserRouter>
      {/* Contenitore provvisorio: nel commit 2 lo sostituisce il Layout */}
      <div className='container py-4'>
        <Routes>
          <Route path='/' element={<Home />} />
          {voci.map(({ path, label }) => (
            <Route key={path} path={path} element={<Placeholder title={label} />} />
          ))}
          <Route
            path='*'
            element={<Placeholder title='Pagina non trovata' text='Questo indirizzo non esiste.' />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App