import {ProductoDTO} from "../../types";
import {useForm} from "../../hooks/useForm";
import React, {useState} from "react";
import styles from './ProductoForm.module.css'

interface Props {
    productoInicial?: ProductoDTO
    onSubmit: (data: Omit<ProductoDTO, "id" | "comentarios">, imagen?: File) => Promise<void>
    onCancelar: () => void
}

export default function ProductoForm({productoInicial, onSubmit, onCancelar}: Props) {
    const {values, handleChange} = useForm({
        nombre: productoInicial?.nombre ?? '',
        descripcion: productoInicial?.descripcion ?? '',
        precio: String(productoInicial?.precio ?? ''),
        cantidad: String(productoInicial?.cantidad ?? ''),
    })
    const [imagen, setImagen] = useState<File>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await onSubmit({
                nombre: values.nombre,
                descripcion: values.descripcion,
                precio: Number(values.precio),
                cantidad: Number(values.cantidad),
                imagen: productoInicial?.imagen ?? null,
            }, imagen)
        } catch {
            setError('Error al guardar producto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Nombre</label>
                <input className={styles.input} name="nombre" value={values.nombre} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea className={styles.textarea} name="descripcion" value={values.descripcion} onChange={handleChange} required rows={3} />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Precio</label>
                <input className={styles.input} name="precio" type="number" step="0.01" value={values.precio} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Stock</label>
                <input className={styles.input} name="cantidad" type="number" value={values.cantidad} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Imagen {productoInicial?.imagen && '(actual: ' + productoInicial.imagen + ')'}</label>
                <input
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    onChange={e => setImagen(e.target.files?.[0])}
                />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
                <button className={styles.cancelBtn} type="button" onClick={onCancelar} disabled={loading}>Cancelar</button>
                <button className={styles.submitBtn} type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (productoInicial ? 'Actualizar' : 'Crear')}
                </button>
            </div>
        </form>
    )
}
