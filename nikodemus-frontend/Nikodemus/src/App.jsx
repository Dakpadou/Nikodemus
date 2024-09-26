import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Formation from './pages/formation'
import { Routes, Route } from "react-router-dom";
import AddFormationAdmin from './pages/admin/formation/add-formation'


function App() {
  const [count, setCount] = useState(0)

// route index  précise la racine de l'app

  return (
    <>
    <div className="App">
    < Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/formation" element={<Formation />} />
      <Route index element={<Home />} />
      <Route path="/admin/formation/add" element={<AddFormationAdmin />} />
    </Routes>
    </div>
    </>
  )
}

export default App
