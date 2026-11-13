import { useState } from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import ModificaRate from './rate/ModificaRate.jsx'
import PianiRate from './rate/PianiRate.jsx'
import RiepilogoRate from './rate/RiepilogoRate.jsx'
import { piani } from '../../mocks/rate.js'

function GestioneRate() {
  // Il piano selezionato è condiviso tra le tre schede
  const [pianoId, setPianoId] = useState(piani.find((p) => !p.archiviato).id)

  return (
    <>
      <h2 className='mb-3'>Gestione rate</h2>

      <Tabs defaultActiveKey='gestione' mountOnEnter unmountOnExit className='mb-3'>
        <Tab eventKey='gestione' title='Gestione rate'>
          <PianiRate pianoId={pianoId} onSelectPiano={setPianoId} />
        </Tab>
        <Tab eventKey='modifica' title='Modifica rate'>
          <ModificaRate pianoId={pianoId} onSelectPiano={setPianoId} />
        </Tab>
        <Tab eventKey='riepilogo' title='Riepilogo'>
          <RiepilogoRate pianoId={pianoId} onSelectPiano={setPianoId} />
        </Tab>
      </Tabs>
    </>
  )
}

export default GestioneRate