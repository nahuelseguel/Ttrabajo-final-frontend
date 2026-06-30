import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)  // evita flash de "no logueado"

  // Al montar: restaurar sesión desde storage
  useEffect(() => {
    const stored =
      localStorage.getItem('currentUser') ||
      sessionStorage.getItem('currentUser')

    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* storage corrupto */ }
    }
    setLoading(false)
  }, [])

  function loginUser(userData, remindMe = false) {
    setUser(userData)
    const storage = remindMe ? localStorage : sessionStorage
    storage.setItem('currentUser', JSON.stringify(userData))
  }

  function logoutUser() {
    setUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('token')
  }

  const isLoggedIn = !!user
  const isAdmin    = user?.role === 'admin'
  const isOperator = user?.role === 'operator'

  return (
    <UserContext.Provider value={{ user, loading, isLoggedIn, isAdmin, isOperator, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook para usar el contexto — más cómodo que importar useContext en cada archivo
export function useUser() {
  return useContext(UserContext)
}
