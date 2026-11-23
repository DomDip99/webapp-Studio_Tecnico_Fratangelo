import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Totale from '../../components/Totale.jsx'
import { ALIQUOTE, calcolaFattura } from '../../utils/fatture.js'
import { formatEuro, formatNumero, parseEuro } from '../../utils/format.js'

function RigaCheck({ id, label, checked, onChange, importo }) {
  return (
    <div className='d-flex justify-content-between gap-4 mb-1'>
      <dt className='fw-normal'>
        <Form.Check
          id={id}
          type='checkbox'
          label={label}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </dt>
      <dd className='mb-0 text-end'>{formatEuro(importo)}</dd>
    </div>
  )
}

// Parte dai valori della fattura e si ricalcola mentre si modifica. Le modifiche non vengono salvate.
function CalcoloFattura({ fattura }) {
  const [onorario, setOnorario] = useState(formatNumero(fattura.onorario))
  const [spese, setSpese] = useState(formatNumero(fattura.spese))
  const [conMaggiorazione, setConMaggiorazione] = useState(fattura.conMaggiorazione)
  const [conIva, setConIva] = useState(fattura.conIva)
  const [conRitenuta, setConRitenuta] = useState(fattura.conRitenuta)

  const c = calcolaFattura({
    onorario: parseEuro(onorario),
    spese: parseEuro(spese),
    conMaggiorazione,
    conIva,
    conRitenuta,
  })

  return (
    <section aria-label='Calcolo fattura' className='border rounded p-3'>
      <Form.Group controlId='onorario' className='mb-3'>
        <Form.Label>Onorario</Form.Label>
        <Form.Control
          inputMode='decimal'
          className='text-end'
          value={onorario}
          onChange={(e) => setOnorario(e.target.value)}
        />
      </Form.Group>

      <dl className='mb-3'>
        <RigaCheck
          id='con-maggiorazione'
          label={`Maggiorazione (${ALIQUOTE.maggiorazione}%)`}
          checked={conMaggiorazione}
          onChange={setConMaggiorazione}
          importo={c.maggiorazione}
        />
        <Totale label='Sommano' value={formatEuro(c.sommano)} />
        <RigaCheck
          id='con-iva'
          label={`IVA (${ALIQUOTE.iva}%)`}
          checked={conIva}
          onChange={setConIva}
          importo={c.iva}
        />
        <Totale label='Totale' value={formatEuro(c.totale)} />
        <RigaCheck
          id='con-ritenuta'
          label={`Ritenuta d'acconto (${ALIQUOTE.ritenuta}%)`}
          checked={conRitenuta}
          onChange={setConRitenuta}
          importo={c.ritenuta}
        />
        <Totale label='Totale parziale' value={formatEuro(c.totaleParziale)} />
      </dl>

      <Form.Group controlId='spese' className='mb-3'>
        <Form.Label>Spese</Form.Label>
        <Form.Control
          inputMode='decimal'
          className='text-end'
          value={spese}
          onChange={(e) => setSpese(e.target.value)}
        />
      </Form.Group>

      <dl className='border-top pt-2 mb-0 fs-5 fw-bold text-danger'>
        <Totale label='TOTALE' value={formatEuro(c.totaleDocumento)} />
      </dl>
    </section>
  )
}

export default CalcoloFattura