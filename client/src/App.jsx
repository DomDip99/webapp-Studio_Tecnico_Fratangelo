//import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { BsFileEarmarkText } from 'react-icons/bs'
import dayjs from 'dayjs';
import ServerStatus from './components/ServerStatus';

function App() {
  //const [count, setCount] = useState(0)
  const today = dayjs().format('dddd D MMMM YYYY');

  return (
    <>
      <div className='container py-4'>
        <h1>STLF</h1>
        <p className='text-muted'>{today}</p>
        <ServerStatus/>
        <Button variant='primary'>
          <BsFileEarmarkText className='me-2'/>
          Test Bootstrap
        </Button>
      </div>
    </>
  )
}

export default App
