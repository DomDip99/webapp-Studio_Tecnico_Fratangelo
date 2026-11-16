import { useState } from 'react'
import dayjs from 'dayjs'
import CalendarioGiorni from '../../components/CalendarioGiorni.jsx'
import { etichettaGiorno, formatoISO } from '../../utils/calendario.js'

function Calendario({ oggi = formatoISO(dayjs()) }) {
  const [giorno, setGiorno] = useState(oggi)

  return (
    <>
      <h2 className='mb-3'>Situazione giornaliera</h2>

      <CalendarioGiorni value={giorno} onChange={setGiorno} oggi={oggi} />

      <h3 className='h5 mt-4'>{etichettaGiorno(giorno)}</h3>
      <p className='text-muted'>Nessun movimento.</p>
    </>
  )
}

export default Calendario