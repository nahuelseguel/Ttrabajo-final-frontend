import { useState } from 'react'
import Input  from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import styles from './Login.module.css'

export default function LoginForm({ onSubmit, error, loading }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        required
      />

      <div className={styles.passwordWrapper}>
        <Input
          label="Contraseña"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowPassword(p => !p)}
          tabIndex={-1}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <div className={styles.options}>
        <label className={styles.rememberLabel}>
          <input type="checkbox" name="remindMe" />
          <span>Recordarme</span>
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" loading={loading} fullWidth>
        Iniciar sesión
      </Button>
    </form>
  )
}
