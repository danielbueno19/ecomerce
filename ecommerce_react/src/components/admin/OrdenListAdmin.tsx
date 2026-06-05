import type {EstadoOrden, OrdenDTO} from "../../types";

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
        <div>
            {/* Filtro por estado */}
            <div style={{marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                {(['TODOS', ...ESTADOS] as const).map(e => (
                    <button
                        key={e}
                        onClick={() => onFiltro(e)}
                        style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: 999,
                            border: 'none',
                            cursor: 'pointer',
                            background: filtro === e ? '#1f2937' : '#e5e7eb',
                            color: filtro === e ? '#fff' : '#374151',
                        }}
                    >
                        {e}
                    </button>
                ))}
            </div>

            {ordenesFiltradas.length === 0 && (
                <p style={{color: '#6b7280'}}>No hay órdenes con ese estado.</p>
            )}

            {ordenesFiltradas.map(orden => {
                const fecha = new Date(orden.fechaCreacion).toLocaleDateString('es-AR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                })
                const total = orden.ordenItems.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

                return (
                    <div key={orden.id} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        padding: '1rem',
                        marginBottom: '0.75rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>

                            <div>
                                <span style={{fontWeight: 'bold'}}>Orden #{orden.id}</span>
                                <span style={{color: '#6b7280', marginLeft: '0.75rem'}}>{fecha}</span>
                            </div>

                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <span style={{
                                    background: colorEstado[orden.estado],
                                    color: '#fff',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: 999,
                                    fontSize: '0.8rem',
                                }}>
                                  {orden.estado}
                                </span>
                                <select
                                    value={orden.estado}
                                    onChange={e => onCambiarEstado(orden.id, e.target.value as EstadoOrden)}
                                >
                                    {ESTADOS.map(est => (
                                        <option key={est} value={est}>{est}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <p style={{margin: '0.5rem 0 0', color: '#374151'}}>
                            📍 {orden.direccion} ·
                            📞 {orden.telefono} · <strong>${total.toFixed(2)}</strong> · {orden.ordenItems.length} item(s)
                        </p>
                    </div>
                )
            })}
        </div>
    )
}