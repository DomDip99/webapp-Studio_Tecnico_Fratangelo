import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import dayjs from 'dayjs'
import 'dayjs/locale/it.js'
import './index.css'
import App from './App.jsx'

dayjs.locale('it');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
