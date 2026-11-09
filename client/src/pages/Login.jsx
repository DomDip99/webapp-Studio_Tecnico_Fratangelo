import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useAuth } from '../auth/useAuth.js'

function Login() {
  const { user, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)

  // Già entrato: si va alla home
  if (user) return <Navigate to='/' replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const esito = await login(username.trim(), password)
    if (!esito.ok) setError(esito.error)
  }

  return (
    <div className='min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary p-3'>
      <Card style={{ width: '100%', maxWidth: 380 }}>
        <Card.Body className='p-4'>
          <h1 className='h3 text-center mb-1'>STLF</h1>
          <h2 className='h6 text-center text-muted mb-4'>Accedi</h2>

          {error && <Alert variant='danger'>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='username'>
              <Form.Label>Utente</Form.Label>
              <Form.Control
                type='text'
                autoComplete='username'
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-4' controlId='password'>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type='button'
                  variant='outline-secondary'
                  aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button type='submit' className='w-100'>
              Accedi
            </Button>
          </Form>

          <p className='small text-muted text-center mt-4 mb-0'>
            Demo: admin / admin123 oppure utente / utente123
          </p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login