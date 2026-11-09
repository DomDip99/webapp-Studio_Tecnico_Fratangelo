import dayjs from 'dayjs'
import ServerStatus from '../components/ServerStatus.jsx'
import { useAuth } from '../auth/useAuth.js'

function Home() {
  const { user } = useAuth()

  return (
    <>
      <h1>Benvenuto, {user.nome}</h1>
      <p className='text-muted'>{dayjs().format('dddd D MMMM YYYY')}</p>
      <ServerStatus />
    </>
  )
}

export default Home