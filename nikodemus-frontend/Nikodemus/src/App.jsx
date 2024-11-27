import { useState } from 'react';
import './styles/App.css';
import Home from './pages/Home';
import Formation from './pages/formation';
import FormationsParCategorie from './pages/formation-in-category';
import { Routes, Route } from "react-router-dom";
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
import AdminHome from './pages/admin/HomeAdmin';
import UserHome from './pages/user/UserHome';
import TrainerHome from './pages/trainer/HomeTrainer';
import FormationContent from "./pages/FormationContent";
import CategoryById from "./pages/category-by-id";
import Categories from './pages/category';
import NotFound from './pages/NotFound';






function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <Routes>
          <Route
            path="/admin/category"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AdminCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <UserHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <TrainerHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/formations-par-categorie" element={<FormationsParCategorie />} />
          <Route path="/formation/:id" element={<FormationById />} />
          <Route path="/update/:id" element={<UpdateFormation />} />
          <Route path="/panier" element={<Basket />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/register-user" element={<UserRegister />} />
          <Route
            path="/register-admin"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AdminRegister />
              </ProtectedRoute>
            }
          />
          <Route path="/formation/content/:formationId" element={<FormationContent />} />
          <Route path="/category/:id" element={<CategoryById />} />
          <Route path="/category" element={<Categories />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
