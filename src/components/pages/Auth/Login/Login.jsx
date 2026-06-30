import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { api }     from '@/lib/api'
import LoginForm   from './LoginForm'
import styles      from './Login.module.css'

export default function Login() {
  const { loginUser } = useUser()
  const navigate      = useNavigate()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setError('')

    const email     = event.target.email.value.trim()
    const password  = event.target.password.value.trim()
    const remindMe  = event.target.remindMe.checked

    // Validación básica en el cliente
    if (!email || !password) {
      setError('Completá todos los campos')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/login', { email, password })
      const { accessToken, user } = response

      // Guardar token según preferencia del usuario
      const storage = remindMe ? localStorage : sessionStorage
      storage.setItem('token', accessToken)

      loginUser(user, remindMe)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Bienvenido</h1>
          <p className={styles.subtitle}>Ingresá a tu cuenta para continuar</p>
        </div>

        <LoginForm onSubmit={handleLogin} error={error} loading={loading} />

        <p className={styles.footer}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" className={styles.link}>Registrarse</Link>
        </p>
      </div>
    </section>
  )
}
