export const assegnatari = [
  { id: 1, codice: 1, nome: 'Mario Rossi' },
  { id: 2, codice: 2, nome: 'Laura Bianchi' },
  { id: 3, codice: 3, nome: 'Paolo Verdi' },
  { id: 4, codice: 4, nome: 'Anna Neri' },
]

export const conti = [
  { id: 1, nome: 'Cassa', numero: '', archiviato: false },
  { id: 2, nome: 'Conto corrente', numero: '000123', archiviato: false },
  { id: 3, nome: 'Carta di credito', numero: '000456', archiviato: false },
  { id: 4, nome: 'Conto deposito', numero: '000789', archiviato: true },
]

export const operazioni = [
  { id: 1, nome: 'Acconto', tipo: 'Entrata' },
  { id: 2, nome: 'Incasso bonifico bancario', tipo: 'Entrata' },
  { id: 3, nome: 'Incasso in contanti', tipo: 'Entrata' },
  { id: 4, nome: 'Addebito in Banca', tipo: 'Uscita' },
  { id: 5, nome: 'Carta Di Credito', tipo: 'Uscita' },
  { id: 6, nome: 'Contanti', tipo: 'Uscita' },
  { id: 7, nome: 'Pagamento con assegno', tipo: 'Uscita' },
  { id: 8, nome: 'Pagobancomat', tipo: 'Uscita' },
  { id: 9, nome: 'PagoPA', tipo: 'Uscita' },
  { id: 10, nome: 'Ricevuta Bancaria', tipo: 'Uscita' },
]