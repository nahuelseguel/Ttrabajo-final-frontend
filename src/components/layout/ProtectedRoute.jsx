import { Navigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import Spinner from '@/components/ui/Spinner'

/**
 * ProtectedRoute — protege rutas que requieren autenticación.
 * adminOnly: si true, además exige rol admin.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, loading } = useUser()

  if (loading) return <Spinner fullPage />
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />

  return children
}
