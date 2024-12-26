import { useState } from 'react'
import './App.css'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Invoices from './pages/Invoices/Invoices'
import OfferPDF from './pages/OfferPDF/OfferPDF'
import {BrowserRouter, Routes, Route} from 'react-router-dom'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
        <Routes>
          <Route index element ={<Register />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={< Login/>}/>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/invoices' element={<Invoices />} />
          <Route path='/offerPDF' element={<OfferPDF />} />
        </Routes>
        </BrowserRouter>
    </>
  )
}

export default App;
