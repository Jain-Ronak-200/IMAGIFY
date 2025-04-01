import React, { useContext } from 'react'
import Home from './pages/Home'
import BuyCredit from './pages/BuyCredit'
import Result from './pages/Result'
import { Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { Appcontext } from './context/Appcontext'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import Verify from './pages/Verify'


const App = () => {
  const{showLogin} = useContext(Appcontext);
  return (
    <div className='px-4 sm:px-10  md:mx-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <Navbar/>
      <ToastContainer position='bottom-right'/>
      {
        showLogin && <Login/>
      }
      
      <Routes>
      <Route path='/' element={ <Home/>} />
      <Route path='/result' element={ <Result/>} />
      <Route path='/buy' element={ <BuyCredit/>} />
      <Route path="/success" element={<Verify />} />
      
      
      </Routes>
      <Footer/>
    </div>

  )

  
}

export default App
