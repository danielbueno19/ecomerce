import {EstadoOrden, OrdenDTO} from "../types";
import styles from './OrdenCard.module.css'

interface Props {
    orden: OrdenDTO
    destacada?: boolean
}

export default function OrdenCard({orden, destacada = false}: Props) {
    const fecha = new Date(orden.fechaCreacion).toLocaleDateString('es-AR', {
        day:'2-digit', month:'long', year:'numeric',
    })

    const totalOrden = orden.ordenItems.reduce(
        (acc, item) => acc + item.precio * item.cantidad, 0
    )

    return (
        <div className={`${styles.card} ${destacada ? styles.cardDestacada : ''}`}>
            {destacada && <p className={styles.confirmacion}>✓ Orden creada exitosamente</p>}

            <div className={styles.header}>
                <span className={styles.titulo}>Orden #{orden.id}</span>
                <span className={`${styles.badge} ${styles[`badge${orden.estado as EstadoOrden}`]}`}>
                    {orden.estado}
                </span>
            </div>

            <p className={styles.fecha}>{fecha}</p>
            <p className={styles.direccion}>📍 {orden.direccion} · 📞 {orden.telefono}</p>

            <table className={styles.tabla}>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {orden.ordenItems.map(item => (
                        <tr key={item.id}>
                            <td>Producto #{item.productoId}</td>
                            <td>{item.cantidad}</td>
                            <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className={styles.tablaFooter}>
                        <td colSpan={2}>Total</td>
                        <td>${totalOrden.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
