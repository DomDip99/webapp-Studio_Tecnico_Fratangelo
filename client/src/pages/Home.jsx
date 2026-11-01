import dayjs from 'dayjs'
import ServerStatus from '../components/ServerStatus.jsx'

function Home() {
  return (
    <>
      <h1>Pagina principale</h1>
      <p className='text-muted'>{dayjs().format('dddd D MMMM YYYY')}</p>
      <ServerStatus />
    </>
  )
}

export default Home