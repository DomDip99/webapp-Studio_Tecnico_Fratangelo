import dayjs from 'dayjs'

// Dati inventati. Importi in centesimi.
export const piani = [
  { id: 1, tipoRata: 'Mensile', descrizione: 'Affitto casa', descrizioneRateo: 'Rata affitto', tipoVirtuale: 'Non virtuali', dataInizio: '2026-01-02', dataFine: '', giorno: 2, mese: '', tipoBim: '', tipoTrim: '', tipoSem: '', titolare: 'Mario Rossi', note: '', importo: 75000, voce: 'Casa', sottovoce: 'Affitto/Mutuo', conto: 'Conto corrente', generazioneEntrata: false, generazioneArchiv: false, archiviato: false },
  { id: 2, tipoRata: 'Bimestrale', descrizione: 'Bolletta acqua ufficio', descrizioneRateo: 'Bolletta acqua', tipoVirtuale: 'Non virtuali', dataInizio: '2026-01-15', dataFine: '', giorno: 15, mese: '', tipoBim: '1° mese', tipoTrim: '', tipoSem: '', titolare: 'Laura Bianchi', note: 'Fatturazione ogni due mesi', importo: 8700, voce: 'Ufficio', sottovoce: 'Acqua', conto: 'Conto corrente', generazioneEntrata: false, generazioneArchiv: false, archiviato: false },
  { id: 3, tipoRata: 'Trimestrale', descrizione: 'Abbonamento telefonia', descrizioneRateo: 'Canone telefonia', tipoVirtuale: 'Non virtuali', dataInizio: '2026-02-10', dataFine: '', giorno: 10, mese: '', tipoBim: '', tipoTrim: '2° mese', tipoSem: '', titolare: 'Laura Bianchi', note: '', importo: 4560, voce: 'Ufficio', sottovoce: 'Telefono', conto: 'Carta di credito', generazioneEntrata: false, generazioneArchiv: false, archiviato: false },
  { id: 4, tipoRata: 'Semestrale', descrizione: 'Licenza software', descrizioneRateo: 'Rata licenza', tipoVirtuale: 'Non virtuali', dataInizio: '2026-03-20', dataFine: '2027-09-20', giorno: 20, mese: 'Marzo', tipoBim: '', tipoTrim: '', tipoSem: '1° mese', titolare: 'Paolo Verdi', note: 'Rinnovo annuale in due rate', importo: 25000, voce: 'Ufficio', sottovoce: 'Acquisto Attrezzature', conto: 'Conto corrente', generazioneEntrata: false, generazioneArchiv: false, archiviato: false },
  { id: 5, tipoRata: 'Mensile', descrizione: 'Canone cliente Alfa', descrizioneRateo: 'Canone mensile', tipoVirtuale: 'Non virtuali', dataInizio: '2026-01-05', dataFine: '', giorno: 5, mese: '', tipoBim: '', tipoTrim: '', tipoSem: '', titolare: 'Mario Rossi', note: '', importo: 20000, voce: 'Clienti', sottovoce: 'Parcelle', conto: 'Conto corrente', generazioneEntrata: true, generazioneArchiv: false, archiviato: false },
  { id: 6, tipoRata: 'Mensile', descrizione: 'Finanziamento stampante (concluso)', descrizioneRateo: 'Rata finanziamento', tipoVirtuale: 'Non virtuali', dataInizio: '2025-01-10', dataFine: '2025-12-10', giorno: 10, mese: '', tipoBim: '', tipoTrim: '', tipoSem: '', titolare: 'Anna Neri', note: '', importo: 15000, voce: 'Ufficio', sottovoce: 'Acquisto Attrezzature', conto: 'Carta di credito', generazioneEntrata: false, generazioneArchiv: true, archiviato: true },
]

// Le rate di un piano: una ogni "ogniMesi" mesi, a partire da "inizio"
function genera({ piano, ogniMesi, quante, pagate }) {
  return Array.from({ length: quante }, (_, i) => ({
    id: `${piano.id}-${i + 1}`,
    pianoId: piano.id,
    data: dayjs(piano.dataInizio).add(i * ogniMesi, 'month').format('YYYY-MM-DD'),
    descrizione: `${piano.descrizioneRateo} ${i + 1}/${quante}`,
    conto: piano.conto,
    entrata: piano.generazioneEntrata ? piano.importo : null,
    uscita: piano.generazioneEntrata ? null : piano.importo,
    pagata: i < pagate,
  }))
}

const piano = (id) => piani.find((p) => p.id === id)

export const rate = [
  ...genera({ piano: piano(1), ogniMesi: 1, quante: 12, pagate: 10 }),
  ...genera({ piano: piano(2), ogniMesi: 2, quante: 6, pagate: 5 }),
  ...genera({ piano: piano(3), ogniMesi: 3, quante: 4, pagate: 4 }),
  ...genera({ piano: piano(4), ogniMesi: 6, quante: 2, pagate: 1 }),
  ...genera({ piano: piano(5), ogniMesi: 1, quante: 12, pagate: 9 }),
  ...genera({ piano: piano(6), ogniMesi: 1, quante: 12, pagate: 12 }),
]