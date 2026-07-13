import { useState, useRef, useEffect } from 'react'
import { ARGENTINA_CITIES } from '@/data/argentina-cities'
import styles from './CitySelect.module.css'

export default function CitySelect({ value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const filtered = query
    ? ARGENTINA_CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : ARGENTINA_CITIES

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(city) {
    setQuery(city)
    onChange(city)
    setOpen(false)
  }

  function handleInput(e) {
    setQuery(e.target.value)
    setOpen(true)
    if (value && e.target.value !== value) onChange('')
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <input
        className={styles.input}
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || 'Buscar ciudad...'}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className={styles.list}>
          {filtered.map(city => (
            <li
              key={city}
              className={`${styles.item} ${city === value ? styles.selected : ''}`}
              onClick={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && query && (
        <ul className={styles.list}>
          <li className={styles.empty}>Sin resultados</li>
        </ul>
      )}
    </div>
  )
}
