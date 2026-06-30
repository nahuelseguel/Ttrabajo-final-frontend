import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from '@/context/UserContext'
import Header        from '@/components/layout/Header'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

// Pages
import Home     from '@/components/pages/Home/Home'
import Login    from '@/components/pages/Auth/Login/Login'
import Register from '@/components/pages/Auth/Register/Register'
import Orders   from '@/components/pages/Orders/Orders'
import Tracking from '@/components/pages/Tracking/Tracking'
import Profile  from '@/components/pages/Profile/Profile'
import Admin    from '@/components/pages/Admin/Admin'

function AppRoutes() {
  const { isLoggedIn } = useUser()

  return (
    <>
      <Header />
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Home />} />
        <Route path="/tracking" element={<Tracking />} />

        {/* Solo para no autenticados */}
        <Route path="/login"    element={!isLoggedIn ? <Login />    : <Navigate to="/" replace />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />} />

        {/* Protegidas — cualquier usuario logueado */}
        <Route path="/orders"  element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Solo admins */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  )
}
