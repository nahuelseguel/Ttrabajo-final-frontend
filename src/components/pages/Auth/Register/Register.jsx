import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { api }     from '@/lib/api'
import Input       from '@/components/ui/Input'
import Button      from '@/components/ui/Button'
import Alert       from '@/components/ui/Alert'
import styles      from './Register.module.css'

export default function Register() {
  const { loginUser } = useUser()
  const navigate      = useNavigate()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // Validación en el cliente antes de llamar al backend
  function validate(fields) {
    if (!fields.firstName || !fields.lastName) return 'El nombre y apellido son obligatorios'
    if (!fields.email)    return 'El email es obligatorio'
    if (!fields.password) return 'La contraseña es obligatoria'
    if (fields.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (!/[A-Z]/.test(fields.password)) return 'La contraseña debe tener al menos una mayúscula'
    if (!/\d/.test(fields.password))    return 'La contraseña debe tener al menos un número'
    if (!/[@$!%*?&]/.test(fields.password)) return 'La contraseña debe tener al menos un caracter especial'
    if (fields.password !== fields.confirm) return 'Las contraseñas no coinciden'
    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const fields = {
      firstName: event.target.firstName.value.trim(),
      lastName:  event.target.lastName.value.trim(),
      email:     event.target.email.value.trim(),
      password:  event.target.password.value,
      confirm:   event.target.confirm.value,
    }

    const validationError = validate(fields)
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      const response = await api.post('/auth/register', {
        firstName: fields.firstName,
        lastName:  fields.lastName,
        email:     fields.email,
        password:  fields.password,
      })

      const { accessToken, user } = response
      sessionStorage.setItem('token', accessToken)
      loginUser(user, false)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>Empezá a rastrear tus pedidos hoy</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row}>
            <Input label="Nombre"   name="firstName" type="text" placeholder="Juan" required />
            <Input label="Apellido" name="lastName"  type="text" placeholder="Pérez" required />
          </div>

          <Input label="Email" name="email" type="email"
            autoComplete="email" placeholder="tu@email.com" required />

          <Input label="Contraseña" name="password" type="password"
            autoComplete="new-password" placeholder="Mín. 8 chars, 1 mayúscula, 1 número, 1 símbolo" required />

          <Input label="Confirmar contraseña" name="confirm" type="password"
            autoComplete="new-password" placeholder="Repetí la contraseña" required />

          <Alert message={error} type="error" />

          <Button type="submit" loading={loading} fullWidth>
            Crear cuenta
          </Button>
        </form>

        <p className={styles.footer}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className={styles.link}>Ingresar</Link>
        </p>
      </div>
    </section>
  )
}
