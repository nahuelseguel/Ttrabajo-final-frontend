import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { api } from '@/lib/api'
import styles from './Header.module.css'

export default function Header() {
  const { user, isLoggedIn, isAdmin, logoutUser } = useUser()
  const navigate = useNavigate()

  async function handleLogout() {
    try { await api.post('/auth/logout') } catch { /* ignorar error de red */ }
    logoutUser()
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          📦 LogiTrack
        </Link>

        <nav className={styles.nav}>
          {isLoggedIn ? (
            <>
              <Link to="/orders"   className={styles.link}>Pedidos</Link>
              <Link to="/tracking" className={styles.link}>Rastrear</Link>
              {isAdmin && <Link to="/admin" className={styles.link}>Admin</Link>}
              <Link to="/profile"  className={styles.link}>Mi perfil</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className={styles.link}>Ingresar</Link>
              <Link to="/register" className={styles.linkBtn}>Registrarse</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
