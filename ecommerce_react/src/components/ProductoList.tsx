import {useState, useEffect} from 'react'
import type {ProductoListDTO} from '../types'
import {getProductos} from '../services/productos'
import ProductoCard from './ProductoCard'
import styles from './ProductoList.module.css'

interface Props {
	onVerDetalle: (id: number) => void
}

export default function ProductoList({onVerDetalle}: Props) {
	const [productos, setProductos] = useState<ProductoListDTO[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		getProductos()
		.then(page => setProductos(page.content))
		.catch(() => setError("No se pudieron cargar los productos"))
		.finally(() => setLoading(false))
	}, [] )

	if (loading) return <p className={styles.mensaje}>Cargando productos ...</p>
	if (error) return <p className={styles.mensaje}>{error}</p>

	return (
		<div className={styles.grid}>
		{productos.map(p => (
			<ProductoCard key={p.id} producto={p} onVerDetalle={onVerDetalle}/>
		))}
		</div>
	)
}