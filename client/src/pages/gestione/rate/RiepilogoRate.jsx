import dayjs from 'dayjs'
import DataTable from '../../../components/DataTable.jsx'
import Totale from '../../../components/Totale.jsx'
import { piani, rate } from '../../../mocks/rate.js'
import { riepilogoPiano } from '../../../utils/rate.js'
import { calcolaTotali } from '../../../utils/totali.js'
import { formatEuro } from '../../../utils/format.js'
import { useOutletContext } from 'react-router-dom'

const columns = [
  { key: 'descrizione', label: 'Piano' },
  { key: 'tipoRata', label: 'Tipo rata' },
  { key: 'rate', label: 'Rate pagate', align: 'center', render: (r) => `${r.pagate}/${r.totale}` },
  { key: 'saldato', label: 'Saldato', align: 'end', render: (r) => formatEuro(r.saldato) },
  { key: 'residuo', label: 'Residuo', align: 'end', render: (r) => formatEuro(r.residuo) },
  {
    key: 'prossimaScadenza',
    label: 'Prossima scadenza',
    render: (r) => (r.prossimaScadenza ? dayjs(r.prossimaScadenza).format('DD/MM/YYYY') : '—'),
  },
]

function RiepilogoRate({ pianoId, onSelectPiano }) {
  const { soloDaPagare } = useOutletContext()
  const attivi = piani.filter((p) => !p.archiviato)

  const righe = attivi.map((p) => ({
    id: p.id,
    descrizione: p.descrizione,
    tipoRata: p.tipoRata,
    ...riepilogoPiano(rate.filter((r) => r.pianoId === p.id)),
  })).filter((r) => !soloDaPagare || r.pagate < r.totale)

  const daSaldare = calcolaTotali(
    rate.filter((r) => !r.pagata && attivi.some((p) => p.id === r.pianoId)),
  )

  return (
    <>
      <h3 className='h5 mb-3'>Riepilogo piani</h3>
      <DataTable columns={columns} rows={righe} selectedId={pianoId} onSelect={onSelectPiano} />

      <dl className='d-flex justify-content-end gap-5 border-top pt-3 mb-0'>
        <Totale label='Da pagare' value={formatEuro(daSaldare.usciteNonPagate)} />
        <Totale label='Da incassare' value={formatEuro(daSaldare.entrateNonIncassate)} />
      </dl>
    </>
  )
}

export default RiepilogoRate