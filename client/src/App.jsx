import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Placeholder from './pages/Placeholder.jsx'
import { menu } from './config/menu.js'

const voci = menu.flatMap((sezione) => sezione.items)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {voci.map(({ path, label }) => (
            <Route key={path} path={path} element={<Placeholder title={label} />} />
          ))}
          <Route
            path='*'
            element={<Placeholder title='Pagina non trovata' text='Questo indirizzo non esiste.' />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App