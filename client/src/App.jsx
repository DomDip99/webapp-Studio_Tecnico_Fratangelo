import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RequireAuth from './auth/RequireAuth.jsx'
import RequireRole from './auth/RequireRole.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import PrimaNota from './pages/PrimaNota.jsx'
import Placeholder from './pages/Placeholder.jsx'
import Assegnatari from './pages/tabelle/Assegnatari.jsx'
import Conti from './pages/tabelle/Conti.jsx'
import Operazioni from './pages/tabelle/Operazioni.jsx'
import Clienti from './pages/tabelle/Clienti.jsx'
import VociDiSpesa from './pages/tabelle/VociDiSpesa.jsx'
import PerVociDiSpesa from './pages/gestione/PerVociDiSpesa.jsx'
import GestioneRate from './pages/gestione/GestioneRate.jsx'
import Pratiche from './pages/gestione/Pratiche.jsx'
import Calendario from './pages/situazione/Calendario.jsx'
import Oggi from './pages/situazione/Oggi.jsx'
import Movimenti from './pages/conti/Movimenti.jsx'
import SituazioneConti from './pages/conti/SituazioneConti.jsx'
import Storico from './pages/conti/Storico.jsx'
import { menu } from './config/menu.js'

// Pagine già realizzate: tutte le altre voci del menu usano il segnaposto
const pagine = {
  '/situazione/calendario': Calendario,
  '/situazione/oggi': Oggi,
  '/gestione/prima-nota': PrimaNota,
  '/gestione/per-voci-di-spesa': PerVociDiSpesa,
  '/gestione/rate': GestioneRate,
  '/gestione/pratiche': Pratiche,
  '/conti/situazione': SituazioneConti,
  '/conti/movimenti': Movimenti,
  '/conti/storico': Storico,
  '/tabelle/assegnatari': Assegnatari,
  '/tabelle/conti': Conti,
  '/tabelle/operazioni': Operazioni,
  '/tabelle/clienti': Clienti,
  '/tabelle/voci-di-spesa': VociDiSpesa,
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            {menu.map((sezione) => (
              <Route key={sezione.id} element={<RequireRole ruoli={sezione.ruoli} />}>
                {sezione.items.map(({ path, label }) => {
                  const Pagina = pagine[path]
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={Pagina ? <Pagina /> : <Placeholder title={label} />}
                    />
                  )
                })}
              </Route>
            ))}

            <Route
              path='*'
              element={<Placeholder title='Pagina non trovata' text='Questo indirizzo non esiste.' />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App