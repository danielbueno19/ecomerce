import {CarritoItemEnriquecido} from "../types";
import styles from './CarritoItem.module.css'

interface Props {
    item: CarritoItemEnriquecido
    onRemover: (productoId: number) => void
}

export default function CarritoItem({item, onRemover}: Props) {
    return (
        <div className={styles.item}>
            {item.imagen && <img src={item.imagen} alt={item.nombre} className={styles.imagen}/>}
            <div className={styles.info}>
                <p className={styles.nombre}>{item.nombre}</p>
                <p className={styles.cantidad}>Cantidad: {item.cantidad}</p>
            </div>
            <p className={styles.subtotal}>${(item.precio * item.cantidad).toFixed(2)}</p>
            <button className={styles.btnEliminar} onClick={()=> onRemover(item.productoId)}>Eliminar</button>
        </div>
    )
}