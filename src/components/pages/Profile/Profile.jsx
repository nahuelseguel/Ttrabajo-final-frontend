import { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { api }      from '@/lib/api'
import Input        from '@/components/ui/Input'
import Button       from '@/components/ui/Button'
import Alert        from '@/components/ui/Alert'
import Spinner      from '@/components/ui/Spinner'
import styles       from './Profile.module.css'

export default function Profile() {
  const { data: profile, loading, error } = useFetch('/users/me')
  const [success,  setSuccess]  = useState('')
  const [apiError, setApiError] = useState('')
  const [saving,   setSaving]   = useState(false)

  if (loading) return <Spinner fullPage />
  if (error)   return <Alert message={error} />

  async function handleUpdate(event) {
    event.preventDefault()
    setSuccess(''); setApiError('')
    const data = {
      firstName: event.target.firstName.value.trim(),
      lastName:  event.target.lastName.value.trim(),
    }
    setSaving(true)
    try {
      await api.patch(`/users/${profile.id}`, data)
      setSuccess('Perfil actualizado correctamente')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>Mi perfil</h1>

        <div className={styles.card}>
          <div className={styles.avatar}>
            {profile.firstName?.[0]}{profile.lastName?.[0]}
          </div>
          <p className={styles.name}>{profile.firstName} {profile.lastName}</p>
          <p className={styles.email}>{profile.email}</p>
          <span className={styles.role}>{profile.role}</span>
        </div>

        <div className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Editar datos</h2>
          <form onSubmit={handleUpdate} className={styles.form}>
            <div className={styles.row}>
              <Input label="Nombre"   name="firstName" defaultValue={profile.firstName} />
              <Input label="Apellido" name="lastName"  defaultValue={profile.lastName}  />
            </div>
            <Input label="Email" name="email" defaultValue={profile.email} disabled />

            <Alert message={apiError} type="error" />
            <Alert message={success}  type="success" />

            <Button type="submit" loading={saving}>Guardar cambios</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
