import { useNavigate, useParams } from 'react-router-dom'
import ProductoDetalle from '../components/ProductoDetalle'
import styles from './ProductoDetallePage.module.css'

export default function ProductoDetallePage() {
	const { id } = useParams()
	const navigate = useNavigate()

	if (!id) return <div className={styles.page}><p className={styles.message}>Producto no encontrado</p></div>

	return (
		<div className={styles.page}>
			<ProductoDetalle productoId={Number(id)} onVolver={() => navigate('/productos')}/>
		</div>
	)
}