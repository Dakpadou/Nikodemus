import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Formation from './pages/formation';
import Categories from './pages/category';
import FormationsParCategorie from './pages/formation-in-category';
import { Routes, Route } from "react-router-dom";
import AddFormationAdmin from './pages/admin/formation/add-formation';
import FormationById from './pages/formation-by-id';
import UpdateFormation from './pages/admin/formation/update-formation';
import AdminCategory from './pages/admin/category/admin-category';
import ProtectedRoute from "./components/ProtectedRoute";
import Basket from './pages/basket';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/login'
import UserRegister from './pages/user/SubUser';
import AdminRegister from './pages/admin/SubAdmin';
import MyFormations from './components/myformations';





function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <div className="App">
        < Routes>
          <Route
            path="/admin/formation/add"
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <AddFormationAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/category"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AdminCategory />
              </ProtectedRoute>
            }
          />
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/formations-par-categorie" element={<FormationsParCategorie />} />
          <Route path="/formation/:id" element={<FormationById />} />
          <Route path="/update/:id" element={<UpdateFormation />} />
          <Route path="/panier" element={<Basket />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/register-user" element={<UserRegister />} />
          <Route path="/register-admin" element={<AdminRegister />} />
          <Route path="/myformations" element={<MyFormations />} />
        </Routes>
      </div>
    </>
  )
}

export default App
