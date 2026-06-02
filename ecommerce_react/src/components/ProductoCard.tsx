import type {ProductoListDTO} from '../types'

interface Props {
	producto: ProductoListDTO
	onVerDetalle: (id:number) => void
}
export default function ProductoCard({producto, onVerDetalle}: Props) {
	return (
		<div style = {{border: '1px solid #ccc', padding: '1rem', borderRadius: '8px'}}>
			{producto.imagen && (
				<img src={producto.imagen} alt={producto.nombre} width={200}/>
			)}
			<h3>{producto.nombre}</h3>
			<p>{producto.descripcion}</p>
			<p><strong>${producto.price}</strong></p>
			<p>Stock: {producto.cantidad}</p>
			<button onClick={()=> onVerDetalle(producto.id)}>Ver detalle</button>
		</div>
	)
}