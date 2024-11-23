import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Formation from './pages/formation'
import Categories from './pages/category'
import FormationsParCategorie from './pages/formation-in-category'
import { Routes, Route } from "react-router-dom";
import AddFormationAdmin from './pages/admin/formation/add-formation'
import FormationById from './pages/formation-by-id'
import UpdateFormation from './pages/admin/formation/update-formation'
import AdminCategory from './pages/admin/category/admin-category'
import ProtectedRoute from "./components/ProtectedRoute";

import Login from './pages/login'




function App() {
  const [count, setCount] = useState(0)


  return (
    <>
    <div className="App">
    < Routes>          
    <Route
            path="/admin/formation/add"
            element={
              <ProtectedRoute allowedRoles={[1, 2]}> {/* Exemple : Admin (1) ou Modérateur (2) */}
                <AddFormationAdmin />
              </ProtectedRoute>
            }
          />
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} /> 
      <Route path="/formation" element={<Formation />} />
      <Route path="/category" element={<Categories />} />
      <Route path="/formations-par-categorie" element={<FormationsParCategorie />} />
      <Route path="/admin/formation/add" element={<AddFormationAdmin />} />
      <Route path="/admin/category" element={<AdminCategory />} />
      <Route path="/formation/:id" element={<FormationById />} />
      <Route path="/update/:id" element={<UpdateFormation />} />

    </Routes>
    </div>
    </>
  )
}

export default App
