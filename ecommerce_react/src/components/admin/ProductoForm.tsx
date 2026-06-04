import {ProductoDTO} from "../../types";
import {useForm} from "../../hooks/useForm";
import React, {useState} from "react";

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
        <form onSubmit={handleSubmit} style={{maxWidth:500}}>
            <div style={{marginBottom:'0.75rem'}}>
                <label>Nombre</label>
                <input name="nombre" value={values.nombre} onChange={handleChange} required style={{width:'100%'}}/>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
                <label>Descripción</label><br />
                <textarea name="descripcion" value={values.descripcion} onChange={handleChange} required rows={3} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
                <label>Precio</label><br />
                <input name="precio" type="number" step="0.01" value={values.precio} onChange={handleChange} required style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
                <label>Stock</label><br />
                <input name="cantidad" type="number" value={values.cantidad} onChange={handleChange} required style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>Imagen {productoInicial?.imagen && '(actual: ' + productoInicial.imagen + ')'}</label><br />
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImagen(e.target.files?.[0])}
                />
            </div>

            {error && <p style={{color:'red'}}>{error}</p>}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={onCancelar} disabled={loading}>Cancelar</button>
                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (productoInicial ? 'Actualizar' : 'Crear')}
                </button>
            </div>
        </form>
    )
}
