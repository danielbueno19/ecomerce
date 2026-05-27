import {useState, useEffect} from 'react'
import type {ProductoListDTO} from '../types'
import {getProductos} from '../services/productos'
import ProductoCard from './ProductoCard'

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

	if (loading) return <p>Cargando productos ...</p>
	if (error) return <p>{error}</p>

	return (
		<div style = {{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap:'1rem'}}>
		{productos.map(p => (
			<ProductoCard key = {p.id} producto={p} onVerDetalle = {onVerDetalle}/>
		))}
		</div>
	)
}