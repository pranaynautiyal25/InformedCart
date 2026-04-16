import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Dashboard from './Dashboard'
import Landing from './Landing'
import Signup from './Signup'
import Login from './Login'
import BarcodeScanner from './BarcodeScanner'
import ProtectedRoute from './ProtectedRoute'

import './App.css'

function App() {


  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing></Landing>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard></Dashboard>
            </ProtectedRoute>
          }></Route>
          <Route path="/scanner" element={
            <ProtectedRoute>
              <BarcodeScanner></BarcodeScanner>
            </ProtectedRoute>
          }></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
