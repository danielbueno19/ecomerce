import {useCarrito} from "../context/CarritoContext";
import {useNavigate} from "react-router-dom";
import {useForm} from "../hooks/useForm";
import React, {useState} from "react";
import {crearOrden} from "../services/ordenes";

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

    if (items.length === 0){
        navigate('/carrito')
        return null
    }

    return (
        <div style={{maxWidth:500, margin:'0 auto'}} >
            <h2>Checkout</h2>

            {/* Resumen del pedido */}
            <section style={{background:'#696969', padding:'1rem', borderRadius:8, marginBottom:'1.5rem'}}>
                <h3 style={{marginTop:0}}>Resumen del pedido</h3>
                {items.map(item => (
                    <div key={item.productoId} style={{display:'flex', justifyContent:'space-between', padding:'0.25rem'}}>
                        <span>{item.nombre} x{item.cantidad}</span>
                        <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                ))}
                <hr/>
                <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold'}}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </section>

            {/* Formulario de envío */}
            <form onSubmit={handleSubmit}>
                <h3>Datos de envío</h3>
                <div style={{marginBottom: '0.75rem'}}>
                    <label>Dirección</label><br/>
                    <input
                        name="direccion"
                        value={values.direccion}
                        onChange={handleChange}
                        placeholder="Calle 123, Ciudad"
                        required
                        style={{width:'100%'}}
                    />
                </div>
                <div style={{marginBottom:'1rem'}}>
                    <label>Teléfono</label><br/>
                    <input
                        name="telefono"
                        value={values.telefono}
                        onChange={handleChange}
                        placeholder="+57 320 777 7777"
                        required
                        style={{width:'100%'}}
                    />
                </div>
                {error && <p style={{color:'red'}}>{error}</p>}
                <div style={{display:'flex', gap:'0.5rem'}}>
                    <button type='button' onClick={()=> navigate('/carrito')} disabled={loading}>
                        ← Volver al carrito
                    </button>
                    <button type='submit' disabled={loading}>
                        {loading ? 'Procesando...': 'Confirmar orden'}
                    </button>
                </div>
            </form>
        </div>
    )
}
