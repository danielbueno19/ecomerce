import { useNavigate } from 'react-router-dom'
import ProductoList from '../components/ProductoList'

export default function ProductosPage() {
	const navigate = useNavigate()
	return (
		<div>
			<h2>Productos</h2>
			<ProductoList onVerDetalle={id => navigate(`/productos/${id}`)}/>
		</div>
	)
}