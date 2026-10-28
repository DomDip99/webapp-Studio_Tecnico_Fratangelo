import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import { getHealth } from '../api/health.js'

function ServerStatus() {
  const [state, setState] = useState({ loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    getHealth()
      .then(() => {
        if (!cancelled) setState({ loading: false, error: null })
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message })
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (state.loading) return <Spinner animation='border' size='sm' />
  if (state.error) {
    return <Alert variant='danger'>Server non raggiungibile: {state.error}</Alert>
  }
  return <Alert variant='success'>Server online</Alert>
}

export default ServerStatus