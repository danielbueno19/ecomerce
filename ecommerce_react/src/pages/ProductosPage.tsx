import { useNavigate } from 'react-router-dom'
import ProductoList from '../components/ProductoList'
import styles from './ProductosPage.module.css'

export default function ProductosPage() {
	const navigate = useNavigate()
	return (
		<div className={styles.page}>
			<h2>Productos</h2>
			<ProductoList onVerDetalle={id => navigate(`/productos/${id}`)}/>
		</div>
	)
}