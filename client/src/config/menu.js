import {
  BsSun, BsCalendar3, BsSearch, BsJournalText, BsListNested, BsCreditCard,
  BsFolder2Open, BsBank, BsArrowLeftRight, BsClockHistory, BsTags, BsPeople,
  BsGear, BsPersonBadge, BsBarChart, BsTools, BsReceipt,
} from 'react-icons/bs'

export const menu = [
  {
    id: 'situazione',
    label: 'Situazione',
    items: [
      { label: 'Oggi', path: '/situazione/oggi', icon: BsSun },
      { label: 'Calendario', path: '/situazione/calendario', icon: BsCalendar3 },
      { label: 'Ricerca voce', path: '/situazione/ricerca-voce', icon: BsSearch },
    ],
  },
  {
    id: 'gestione',
    label: 'Gestione',
    items: [
      { label: 'Prima nota', path: '/gestione/prima-nota', icon: BsJournalText },
      { label: 'Per voci di spesa', path: '/gestione/per-voci-di-spesa', icon: BsListNested },
      { label: 'Gestione rate', path: '/gestione/rate', icon: BsCreditCard },
      { label: 'Pratiche', path: '/gestione/pratiche', icon: BsFolder2Open },
    ],
  },
  {
    id: 'conti',
    label: 'Conti',
    items: [
      { label: 'Situazione conti', path: '/conti/situazione', icon: BsBank },
      { label: 'Movimenti', path: '/conti/movimenti', icon: BsArrowLeftRight },
      { label: 'Storico', path: '/conti/storico', icon: BsClockHistory },
    ],
  },
  {
    id: 'tabelle',
    label: 'Tabelle',
    items: [
      { label: 'Voci di spesa', path: '/tabelle/voci-di-spesa', icon: BsTags },
      { label: 'Clienti', path: '/tabelle/clienti', icon: BsPeople },
      { label: 'Operazioni', path: '/tabelle/operazioni', icon: BsGear },
      { label: 'Conti', path: '/tabelle/conti', icon: BsBank },
      { label: 'Assegnatari', path: '/tabelle/assegnatari', icon: BsPersonBadge },
    ],
  },
  {
    id: 'statistiche',
    label: 'Statistiche',
    items: [{ label: 'Statistiche', path: '/statistiche', icon: BsBarChart }],
  },
  {
    id: 'utilita',
    label: 'Utilità',
    items: [{ label: 'Utilità', path: '/utilita', icon: BsTools }],
  },
  {
    id: 'fatture',
    label: 'Fatture',
    items: [{ label: 'Fatture', path: '/fatture', icon: BsReceipt }],
  },
]