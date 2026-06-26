import {useCarrito} from "../context/CarritoContext";
import {useNavigate} from "react-router-dom";
import {useForm} from "../hooks/useForm";
import React, {useState} from "react";
import {crearOrden} from "../services/ordenes";
import styles from './CheckoutPage.module.css'

export default function CheckoutPage() {
    const {items, total, vaciar} = useCarrito()
    const navigate = useNavigate()
    const {values, handleChange} = useForm({direccion:'', telefono:''})
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const orden = await crearOrden(values.direccion, values.telefono)
            await vaciar()
            navigate('/ordenes', {state: {ordenId: orden.id}})
        } catch {
            setError('No se pudo procesar la orden, intenta de nuevo')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        navigate('/carrito')
        return null
    }

    return (
        <div className={styles.page}>
            <h2>Checkout</h2>

            <section className={styles.resumen}>
                <h3>Resumen del pedido</h3>
                {items.map(item => (
                    <div key={item.productoId} className={styles.resumenFila}>
                        <span>{item.nombre} x{item.cantidad}</span>
                        <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                ))}
                <div className={styles.resumenTotal}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </section>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h3>Datos de envío</h3>
                <div className={styles.field}>
                    <label>Dirección</label>
                    <input
                        name="direccion"
                        value={values.direccion}
                        onChange={handleChange}
                        placeholder="Calle 123, Ciudad"
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>Teléfono</label>
                    <input
                        name="telefono"
                        value={values.telefono}
                        onChange={handleChange}
                        placeholder="+57 320 777 7777"
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.acciones}>
                    <button type='button' className={styles.btnVolver} onClick={() => navigate('/carrito')} disabled={loading}>
                        ← Volver al carrito
                    </button>
                    <button type='submit' disabled={loading}>
                        {loading ? 'Procesando...' : 'Confirmar orden'}
                    </button>
                </div>
            </form>
        </div>
    )
}
