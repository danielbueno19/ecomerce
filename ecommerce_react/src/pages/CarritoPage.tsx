import {useCarrito} from "../context/CarritoContext";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import CarritoItem from "../components/CarritoItem";

export default function CarritoPage() {
    const {items, loading, remover, vaciar, total} = useCarrito()
    const navigate = useNavigate()
    const [operando, setOperando] = useState(false)

    const handleRemover = async (productoId: number)=> {
        setOperando(true)
        try {
            await remover(productoId)
        }finally {
            setOperando(false)
        }
    }

    const handleVaciar = async ()=> {
        setOperando(true)
        try {
            await vaciar()
        } finally {
            setOperando(false)
        }
    }

    if (loading) return <p>Cargando carrito...</p>

    if (items.length === 0) return (
        <div>
            <h2>Tu carrito está vacío</h2>
            <button onClick={()=> navigate('/productos')}>Ver productos</button>
        </div>
    )

    return (
        <div style={{maxWidth:600, margin:'0 auto'}}>
            <h2>Tu carrito</h2>
            {items.map(item => (
                <CarritoItem key={item.productoId} item={item} onRemover={handleRemover}/>
            ))}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1.5rem'}}>
                <strong>Total: ${total.toFixed(2)}</strong>
                <div style={{display:'flex', gap:'0.5rem'}}>
                    <button onClick={handleVaciar} disabled={operando}>Vaciar carrito</button>
                    <button onClick={()=> navigate('/checkout')} disabled={operando}>Ir al checkout</button>
                </div>
            </div>
        </div>
    )
}