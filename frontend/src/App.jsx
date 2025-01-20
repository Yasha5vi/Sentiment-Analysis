import React from 'react'
import Navbar from './Components/Navbar.jsx'
import Sidebar from './Components/Sidebar.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
    <Sidebar/>
    <div className='rightSide bg-white-800'>
      <Navbar/>
      <Outlet/>
    </div>
    </>
  )
}

export default App
