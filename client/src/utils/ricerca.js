export const FILTRI_VUOTI = {
  descrizione: '',
  dataInizio: '',
  dataFine: '',
  voce: '',
  sottovoce: '',
  titolare: '',
  operazione: '',
  conto: '',
  pagati: false,
  nonPagati: false,
  rateo: false,
  pratica: false,
  incasCli: false,
  inclVirtuali: false,
  soloVirtuali: false,
  calcVirtuali: false,
}

// Le date sono in formato ISO, quindi si confrontano anche come testo
export function filtraMovimenti(movimenti, f, soloDaPagare = false) {
  const testo = f.descrizione.trim().toLowerCase()

  return movimenti.filter((m) => {
    if (testo && !m.descrizione.toLowerCase().includes(testo)) return false
    if (f.dataInizio && m.data < f.dataInizio) return false
    if (f.dataFine && m.data > f.dataFine) return false
    if (f.voce && m.voce !== f.voce) return false
    if (f.sottovoce && m.sottovoce !== f.sottovoce) return false
    if (f.titolare && m.titolare !== f.titolare) return false
    if (f.operazione && m.operazione !== f.operazione) return false
    if (f.conto && m.conto !== f.conto) return false

    // Pag. e Non pag.: con una sola casella si restringe, con entrambe o nessuna no
    if (f.pagati !== f.nonPagati && m.pagata !== f.pagati) return false
    if (soloDaPagare && m.pagata) return false

    if (f.rateo && !m.rateo) return false
    if (f.pratica && !m.pratica) return false
    if (f.incasCli && !m.incasCli) return false

    // I movimenti virtuali si vedono solo se richiesti
    if (f.soloVirtuali && !m.virtuale) return false
    if (m.virtuale && !f.inclVirtuali && !f.soloVirtuali) return false

    return true
  })
}

// Entrate e uscite raggruppate per voce e sottovoce (importi in centesimi)
export function subtotaliPerVoce(movimenti) {
  const gruppi = new Map()

  for (const m of movimenti) {
    const id = `${m.voce} / ${m.sottovoce}`
    const gruppo = gruppi.get(id) ?? { id, voce: m.voce, sottovoce: m.sottovoce, entrate: 0, uscite: 0 }
    gruppo.entrate += m.entrata ?? 0
    gruppo.uscite += m.uscita ?? 0
    gruppi.set(id, gruppo)
  }

  return [...gruppi.values()]
    .map((g) => ({ ...g, saldo: g.entrate - g.uscite }))
    .sort((a, b) => a.voce.localeCompare(b.voce) || a.sottovoce.localeCompare(b.sottovoce))
}