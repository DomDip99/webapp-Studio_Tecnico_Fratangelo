export const STATI_PRATICA = ['In corso', 'Sospesa', 'Completata', 'Completata e saldata']
export const STATI_PAGAMENTO = ['Da incassare', 'Acconto ricevuto', 'Saldo completo']

// Una pratica è conclusa quando il lavoro è completato (anche se non ancora saldato)
export const isConclusa = (pratica) => pratica.statoPratica.startsWith('Completata')

// Importi in centesimi
export function totaliPratiche(pratiche) {
  const t = pratiche.reduce(
    (acc, p) => ({
      richiesto: acc.richiesto + p.importoRichiesto,
      incassato: acc.incassato + p.incassato,
      spese: acc.spese + p.speseSostenute,
    }),
    { richiesto: 0, incassato: 0, spese: 0 },
  )

  return { ...t, daIncassare: t.richiesto - t.incassato }
}