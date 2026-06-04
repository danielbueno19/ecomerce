import {useState, useEffect} from 'react'
import type {ProductoDTO} from '../types'
import {getProducto} from '../services/productos'
import {useAuth} from "../context/AuthContext";
import {useCarrito} from "../context/CarritoContext";
import {useNavigate} from "react-router-dom";
import ComentarioList from "./ComentarioList";

interface Props {
	productoId: number
	onVolver: () => void
}

export default function ProductoDetalle({productoId, onVolver}: Props) {
	const {token} = useAuth()
	const {agregar} = useCarrito()
	const navigate = useNavigate()
	const [producto, setProducto] = useState<ProductoDTO | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [agregando, setAgregando] = useState(false)
	const [confirmacion, setConfirmacion] = useState(false)

	useEffect(() => {
		setLoading(true)
		setError(null)
		getProducto(productoId)
		.then(setProducto)
		.catch(()=> setError('No se pudo cargar el producto'))
		.finally(()=> setLoading(false))
	}, [productoId])

	const handleAgregar = async () => {
	  if(!token){navigate('/login'); return}
		setAgregando(true)
		try {
			await agregar(productoId, 1)
			setConfirmacion(true)
			setTimeout(()=> setConfirmacion(false), 2000)
		} finally {
			setAgregando(false)
		}
	}

	if (loading) return <p>Cargando...</p>
	if (error) return <p>{error}</p>
	if (!producto) return null

	return (
		<div>
			<button onClick={onVolver}>← Volver</button>

			<div style={{marginTop:'1rem'}}>
				{producto.imagen && (<img src={producto.imagen} alt={producto.nombre} width={300}/>)}
				<h2>{producto.nombre}</h2>
				<p>{producto.descripcion}</p>
				<p><strong>Precio: ${producto.precio}</strong></p>
				<p>Stock disponible: {producto.cantidad}</p>
				<button onClick={handleAgregar} disabled={agregando || producto.cantidad === 0}>
					{agregando ? 'Agregando': 'Agregar al carrito'}
				</button>
				{confirmacion && <p style={{color:'green'}}>✓ Agregado al carrito</p>}
			</div>

			<ComentarioList productoId={productoId}/>
		</div>
	)
}
