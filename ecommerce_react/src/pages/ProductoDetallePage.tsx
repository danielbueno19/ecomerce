import { useNavigate, useParams } from 'react-router-dom'
import ProductoDetalle from '../components/ProductoDetalle'

export default function ProductoDetallePage() {
	const { id } = useParams()
	const navigate = useNavigate()

	if (!id) return <p>Producto no encontrado</p>

	return (
		<ProductoDetalle productoId={Number(id)} onVolver={() => navigate('/productos')}/>
	)
}