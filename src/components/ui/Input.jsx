import styles from './Input.module.css'

/**
 * Input — campo de texto base.
 * Acepta todas las props nativas de <input>.
 */
export default function Input({ label, error, ...props }) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.hasError : ''}`} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
