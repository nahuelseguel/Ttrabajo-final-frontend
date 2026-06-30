import styles from './Button.module.css'

/**
 * Button — botón base de la app.
 * variant: 'primary' | 'secondary' | 'danger'
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  disabled,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        styles.btn,
        styles[variant],
        fullWidth ? styles.full : '',
      ].join(' ')}
    >
      {loading ? <span className={styles.spinner} /> : null}
      {children}
    </button>
  )
}
