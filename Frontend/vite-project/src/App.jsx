import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Dashboard from './Dashboard'
import Landing from './Landing'
import Signup from './Signup'
import Login from './Login'
import BarcodeScanner from './BarcodeScanner'

import './App.css'

function App() {


  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing></Landing>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/scanner" element={<BarcodeScanner></BarcodeScanner>}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
