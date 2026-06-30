import {useState, useEffect} from 'react'
import type {ProductoDTO} from '../types'
import {getProducto} from '../services/productos'
import {useAuth} from "../context/AuthContext";
import {useCarrito} from "../context/CarritoContext";
import {useNavigate} from "react-router-dom";
import ComentarioList from "./ComentarioList";
import styles from './ProductoDetalle.module.css'
import { resolveImageUrl } from '../utils/imagenes'

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

	if (loading) return <p className={styles.mensaje}>Cargando...</p>
	if (error) return <p className={styles.mensaje}>{error}</p>
	if (!producto) return null

	const imagenSrc = producto.imagen ? resolveImageUrl(producto.imagen) : undefined

	return (
		<div className={styles.container}>
			<button className={styles.btnVolver} onClick={onVolver}>← Volver</button>

			<div className={styles.detalle}>
				{imagenSrc && <img src={imagenSrc} alt={producto.nombre} className={styles.imagen}/>}
				<div className={styles.info}>
					<h2>{producto.nombre}</h2>
					<p>{producto.descripcion}</p>
					<p className={styles.precio}>${producto.precio}</p>
					<p className={styles.stock}>Stock disponible: {producto.cantidad}</p>
					<button className={styles.btnCarrito} onClick={handleAgregar} disabled={agregando || producto.cantidad === 0}>
						{agregando ? 'Agregando...' : 'Agregar al carrito'}
					</button>
					{confirmacion && <p className={styles.confirmacion}>✓ Agregado al carrito</p>}
				</div>
			</div>

			<ComentarioList productoId={productoId}/>
		</div>
	)
}
