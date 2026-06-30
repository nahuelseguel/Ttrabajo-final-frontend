import { useState } from 'react'
import Input   from '@/components/ui/Input'
import Button  from '@/components/ui/Button'
import Alert   from '@/components/ui/Alert'
import styles  from './Orders.module.css'

export default function OrderForm({ initial, onSave, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const form = event.target
    const data = {
      originName:          form.originName.value.trim(),
      originAddress:       form.originAddress.value.trim(),
      originCity:          form.originCity.value.trim(),
      destinationName:     form.destinationName.value.trim(),
      destinationAddress:  form.destinationAddress.value.trim(),
      destinationCity:     form.destinationCity.value.trim(),
      destinationPhone:    form.destinationPhone.value.trim(),
      description:         form.description.value.trim(),
      weightKg:            form.weightKg.value ? Number(form.weightKg.value) : undefined,
    }

    // Validación cliente
    if (!data.originName || !data.destinationName || !data.destinationPhone) {
      setError('Los campos de origen, destino y teléfono son obligatorios')
      return
    }

    setLoading(true)
    try {
      await onSave(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>
        {initial ? 'Editar pedido' : 'Nuevo pedido'}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <fieldset className={styles.fieldset}>
          <legend>Origen</legend>
          <div className={styles.grid2}>
            <Input label="Nombre / Empresa"  name="originName"    defaultValue={initial?.originName}    placeholder="Depósito Central" />
            <Input label="Ciudad de origen"  name="originCity"    defaultValue={initial?.originCity}    placeholder="Rosario" />
          </div>
          <Input label="Dirección de origen" name="originAddress" defaultValue={initial?.originAddress} placeholder="Av. Industrial 123" />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Destino</legend>
          <div className={styles.grid2}>
            <Input label="Nombre destinatario"    name="destinationName"  defaultValue={initial?.destinationName}  placeholder="Juan Pérez" />
            <Input label="Teléfono destinatario"  name="destinationPhone" defaultValue={initial?.destinationPhone} placeholder="+5491112345678" />
          </div>
          <div className={styles.grid2}>
            <Input label="Ciudad destino"         name="destinationCity"    defaultValue={initial?.destinationCity}    placeholder="Buenos Aires" />
            <Input label="Dirección destino"      name="destinationAddress" defaultValue={initial?.destinationAddress} placeholder="Calle Falsa 123" />
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Paquete</legend>
          <div className={styles.grid2}>
            <Input label="Peso (kg)"  name="weightKg"    type="number" step="0.1" min="0" defaultValue={initial?.weightKg}    placeholder="2.5" />
            <Input label="Descripción" name="description" defaultValue={initial?.description} placeholder="Contenido del paquete" />
          </div>
        </fieldset>

        <Alert message={error} type="error" />

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" loading={loading}>
            {initial ? 'Guardar cambios' : 'Crear pedido'}
          </Button>
        </div>
      </form>
    </div>
  )
}
