import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataCorrente from './DataCorrente.jsx'

describe('DataCorrente', () => {
  it('parte dalla data di oggi', () => {
    render(<DataCorrente oggi='2026-11-04' />)

    expect(screen.getByRole('alert')).toHaveTextContent('Data di lavoro: mercoledì 4 novembre 2026')
    expect(screen.getByLabelText('Nuova data di lavoro')).toHaveValue('2026-11-04')
  })

  it('imposta una nuova data di lavoro', async () => {
    const user = userEvent.setup()
    render(<DataCorrente oggi='2026-11-04' />)

    fireEvent.change(screen.getByLabelText('Nuova data di lavoro'), { target: { value: '2026-12-25' } })
    // finché non si preme Imposta la data di lavoro non cambia
    expect(screen.getByRole('alert')).toHaveTextContent('mercoledì 4 novembre 2026')

    await user.click(screen.getByRole('button', { name: 'Imposta' }))

    expect(screen.getByRole('alert')).toHaveTextContent('venerdì 25 dicembre 2026')
  })

  it('Ripristina oggi riporta la data di oggi', async () => {
    const user = userEvent.setup()
    render(<DataCorrente oggi='2026-11-04' />)

    fireEvent.change(screen.getByLabelText('Nuova data di lavoro'), { target: { value: '2026-12-25' } })
    await user.click(screen.getByRole('button', { name: 'Imposta' }))
    await user.click(screen.getByRole('button', { name: 'Ripristina oggi' }))

    expect(screen.getByRole('alert')).toHaveTextContent('mercoledì 4 novembre 2026')
    expect(screen.getByLabelText('Nuova data di lavoro')).toHaveValue('2026-11-04')
  })
})