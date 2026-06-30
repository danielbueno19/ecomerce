import type { ProductoListDTO } from '../../types'
import styles from './ProductoListAdmin.module.css'

interface Props {
    productos: ProductoListDTO[]
    onEditar: (id: number) => void
    onEliminar: (id: number) => void
}

export default function ProductoListAdmin({ productos, onEditar, onEliminar }: Props) {
    return (
        <table className={styles.table}>
            <thead>
            <tr className={styles.headerRow}>
                <th className={styles.headerCell}>ID</th>
                <th className={styles.headerCell}>Nombre</th>
                <th className={styles.headerCell}>Precio</th>
                <th className={styles.headerCell}>Stock</th>
                <th className={styles.headerCell}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {productos.map(p => (
                <tr key={p.id} className={styles.row}>
                    <td className={styles.cell}>{p.id}</td>
                    <td className={styles.cell}>{p.nombre}</td>
                    <td className={styles.cell}>${p.price}</td>
                    <td className={styles.cell}>{p.cantidad}</td>
                    <td className={styles.cell}>
                        <div className={styles.actions}>
                            <button onClick={() => onEditar(p.id)} className={styles.editBtn}>Editar</button>
                            <button onClick={() => onEliminar(p.id)} className={styles.deleteBtn}>Eliminar</button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
