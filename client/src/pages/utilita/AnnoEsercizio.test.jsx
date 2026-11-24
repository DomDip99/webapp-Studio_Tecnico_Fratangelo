import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnnoEsercizio from './AnnoEsercizio.jsx'

describe('AnnoEsercizio', () => {
  it('offre gli ultimi cinque anni e parte da quello corrente', () => {
    render(<AnnoEsercizio oggi='2026-11-04' />)

    const anni = screen.getAllByRole('option').map((o) => o.textContent)
    expect(anni).toEqual(['2026', '2025', '2024', '2023', '2022'])
    expect(screen.getByLabelText('Anno')).toHaveValue('2026')
    expect(screen.getByRole('alert')).toHaveTextContent('Anno di esercizio: 2026')
  })

  it("imposta l'anno scelto solo premendo Imposta anno", async () => {
    const user = userEvent.setup()
    render(<AnnoEsercizio oggi='2026-11-04' />)

    await user.selectOptions(screen.getByLabelText('Anno'), '2024')
    expect(screen.getByRole('alert')).toHaveTextContent('Anno di esercizio: 2026')

    await user.click(screen.getByRole('button', { name: 'Imposta anno' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Anno di esercizio: 2024')
  })
})