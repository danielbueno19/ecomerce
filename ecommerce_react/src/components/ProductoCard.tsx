import type {ProductoListDTO} from '../types'
import styles from './ProductoCard.module.css'

interface Props {
	producto: ProductoListDTO
	onVerDetalle: (id:number) => void
}
export default function ProductoCard({producto, onVerDetalle}: Props) {
	return (
		<div className={styles.card}>
			{producto.imagen && (
				<img src={producto.imagen} alt={producto.nombre} className={styles.imagen}/>
			)}
			<div className={styles.body}>
				<h3 className={styles.nombre}>{producto.nombre}</h3>
				<p className={styles.descripcion}>{producto.descripcion}</p>
				<p className={styles.precio}>${producto.price}</p>
				<p className={styles.stock}>Stock: {producto.cantidad}</p>
				<button className={styles.btn} onClick={()=> onVerDetalle(producto.id)}>Ver detalle</button>
			</div>
		</div>
	)
}