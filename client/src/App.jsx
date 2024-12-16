import { useState } from 'react'
import './App.css'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
        <Routes>
          <Route index element ={<Register />} />
          <Route path='/Login' element={< Login/>}/>
        </Routes>
        </BrowserRouter>
    </>
  )
}

export default App;
