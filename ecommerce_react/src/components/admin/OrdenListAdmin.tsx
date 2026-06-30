import type {EstadoOrden, OrdenDTO} from "../../types";
import styles from './OrdenListAdmin.module.css'

const ESTADOS: EstadoOrden[] = ['PREPARANDO', 'ENTREGANDO', 'ENTREGADO', 'CANCELADO']

const colorEstado: Record<EstadoOrden, string> = {
    PREPARANDO: '#f59e0b',
    ENTREGANDO: '#3b82f6',
    ENTREGADO:  '#22c55e',
    CANCELADO:  '#ef4444',
}

interface Props {
    ordenes: OrdenDTO[]
    onCambiarEstado: (ordenId: number, estado: EstadoOrden) => Promise<void>
    filtro: EstadoOrden | 'TODOS'
    onFiltro: (filtro: EstadoOrden | 'TODOS') => void
}

export default function OrdenListAdmin({ordenes, onCambiarEstado, filtro, onFiltro}: Props) {
    const ordenesFiltradas = filtro === 'TODOS'
    ? ordenes: ordenes.filter(o => o.estado === filtro)

    return (
        <div className={styles.container}>
            {/* Filtro por estado */}
            <div className={styles.filters}>
                {(['TODOS', ...ESTADOS] as const).map(e => (
                    <button
                        key={e}
                        onClick={() => onFiltro(e)}
                        className={`${styles.filterButton} ${filtro === e ? styles.activeFilterButton : ''}`}
                    >
                        {e}
                    </button>
                ))}
            </div>

            {ordenesFiltradas.length === 0 && (
                <p className={styles.emptyState}>No hay órdenes con ese estado.</p>
            )}

            {ordenesFiltradas.map(orden => {
                const fecha = new Date(orden.fechaCreacion).toLocaleDateString('es-AR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                })
                const total = orden.ordenItems.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

                return (
                    <div key={orden.id} className={styles.card}>
                        <div className={styles.header}>
                            <div className={styles.orderMeta}>
                                <span className={styles.orderId}>Orden #{orden.id}</span>
                                <span className={styles.date}>{fecha}</span>
                            </div>

                            <div className={styles.actions}>
                                <span className={styles.badge} style={{ background: colorEstado[orden.estado] }}>
                                  {orden.estado}
                                </span>
                                <select
                                    className={styles.select}
                                    value={orden.estado}
                                    onChange={e => onCambiarEstado(orden.id, e.target.value as EstadoOrden)}
                                >
                                    {ESTADOS.map(est => (
                                        <option key={est} value={est}>{est}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <p className={styles.summary}>
                            📍 {orden.direccion} ·
                            📞 {orden.telefono} · <strong>${total.toFixed(2)}</strong> · {orden.ordenItems.length} item(s)
                        </p>
                    </div>
                )
            })}
        </div>
    )
}