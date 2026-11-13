import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import dayjs from 'dayjs'
import DataTable from '../../../components/DataTable.jsx'
import FormFields from '../../../components/FormFields.jsx'
import Toolbar from '../../../components/Toolbar.jsx'
import Totale from '../../../components/Totale.jsx'
import { piani, rate } from '../../../mocks/rate.js'
import { voci } from '../../../mocks/voci.js'
import { assegnatari, conti } from '../../../mocks/tabelle.js'
import { MESI } from '../../../utils/calendario.js'
import { calcolaTotali } from '../../../utils/totali.js'
import { formatEuro } from '../../../utils/format.js'

const mesiNelPeriodo = (n) => ['', ...Array.from({ length: n }, (_, i) => `${i + 1}° mese`)]
const sottovoci = [...new Set(voci.flatMap((v) => v.sottovoci.map((s) => s.nome)))]

const fields = [
  { name: 'tipoRata', label: 'Tipo rata', type: 'select', options: ['Mensile', 'Bimestrale', 'Trimestrale', 'Semestrale'], width: 3 },
  { name: 'dataInizio', label: 'Data inizio', width: 3 },
  { name: 'dataFine', label: 'Data fine', width: 3 },
  { name: 'tipoVirtuale', label: 'Tipo virt.', type: 'select', options: ['Non virtuali'], width: 3 },
  { name: 'giorno', label: 'Giorno', width: 2 },
  { name: 'mese', label: 'Mese', type: 'select', options: ['', ...MESI], width: 2 },
  { name: 'tipoBim', label: 'Tipo bim.', type: 'select', options: mesiNelPeriodo(2), width: 2 },
  { name: 'tipoTrim', label: 'Tipo trim.', type: 'select', options: mesiNelPeriodo(3), width: 2 },
  { name: 'tipoSem', label: 'Tipo sem.', type: 'select', options: mesiNelPeriodo(6), width: 2 },
  { name: 'descrizione', label: 'Descrizione', width: 6 },
  { name: 'titolare', label: 'Titolare', type: 'select', options: ['', ...assegnatari.map((a) => a.nome)], width: 6 },
  { name: 'note', label: 'Note', width: 12 },
  { name: 'importo', label: 'Importo rata', width: 3 },
  { name: 'voce', label: 'Voce', type: 'select', options: voci.map((v) => v.nome), width: 3 },
  { name: 'sottovoce', label: 'Sottovoce', type: 'select', options: sottovoci, width: 3 },
  { name: 'conto', label: 'Conto', type: 'select', options: conti.map((c) => c.nome), width: 3 },
  { name: 'generazioneEntrata', label: 'Generazione rate in entrata', type: 'checkbox', width: 6 },
  { name: 'generazioneArchiv', label: 'Generaz. archiv.', type: 'checkbox', width: 6 },
]

const colonnePiani = [
  { key: 'tipoRata', label: 'Tipo rata' },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'descrizioneRateo', label: 'Descrizione generazione rateo' },
  { key: 'tipoVirtuale', label: 'Tipo virtuale' },
]

const colonneRate = [
  { key: 'data', label: 'Data', render: (r) => dayjs(r.data).format('DD/MM/YYYY') },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'conto', label: 'Conto' },
  { key: 'entrata', label: 'Entrata', align: 'end', render: (r) => formatEuro(r.entrata) },
  { key: 'uscita', label: 'Uscita', align: 'end', render: (r) => formatEuro(r.uscita) },
  { key: 'pagata', label: 'Pag.', align: 'center', render: (r) => (r.pagata ? 'Sì' : 'No') },
]

const formatData = (data) => (data ? dayjs(data).format('DD/MM/YYYY') : '')

function PianiRate({ pianoId, onSelectPiano }) {
  const { soloDaPagare } = useOutletContext()
  const [mostraArchiviate, setMostraArchiviate] = useState(false)

  const visibili = piani.filter((p) => mostraArchiviate || !p.archiviato)
  const selezionato = visibili.find((p) => p.id === pianoId) ?? visibili[0]

  const righe = rate.filter((r) => r.pianoId === selezionato?.id && (!soloDaPagare || !r.pagata))
  const totali = calcolaTotali(righe)

  const valori = selezionato && {
    ...selezionato,
    dataInizio: formatData(selezionato.dataInizio),
    dataFine: formatData(selezionato.dataFine),
    giorno: String(selezionato.giorno),
    importo: formatEuro(selezionato.importo),
  }

  // Nascondendo le archiviate, se era selezionato un piano archiviato si torna al primo attivo
  function toggleArchiviate() {
    if (mostraArchiviate && selezionato?.archiviato) {
      onSelectPiano(piani.find((p) => !p.archiviato).id)
    }
    setMostraArchiviate((v) => !v)
  }

  return (
    <>
      <Toolbar />

      {/* "key" ricrea il form a ogni selezione, così mostra i valori del nuovo piano */}
      <Form key={selezionato?.id ?? 'vuoto'} className='mb-3' onSubmit={(e) => e.preventDefault()}>
        <FormFields fields={fields} values={valori} />
      </Form>

      <div className='mb-2'>
        <Button
          type='button'
          variant={mostraArchiviate ? 'secondary' : 'outline-secondary'}
          size='sm'
          aria-pressed={mostraArchiviate}
          onClick={toggleArchiviate}
        >
          Archiviate
        </Button>
      </div>

      <DataTable
        columns={colonnePiani}
        rows={visibili}
        selectedId={selezionato?.id}
        onSelect={onSelectPiano}
        rowClassName={(p) => (p.archiviato ? 'row-muted' : undefined)}
      />

      <h3 className='h5 mt-4 mb-3'>Rate generate</h3>
      <DataTable
        columns={colonneRate}
        rows={righe}
        rowClassName={(r) => (r.pagata ? undefined : 'table-success')}
      />

      <dl className='d-flex justify-content-end gap-5 border-top pt-3 mb-0'>
        <Totale label='Totale entrate' value={formatEuro(totali.totaleEntrate)} />
        <Totale label='Totale uscite' value={formatEuro(totali.totaleUscite)} />
      </dl>
    </>
  )
}

export default PianiRate