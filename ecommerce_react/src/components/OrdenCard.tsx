import {EstadoOrden, OrdenDTO} from "../types";

const colorEstado: Record<EstadoOrden, string> = {
    PREPARANDO: '#f59e0b',
    ENTREGANDO: '#3b82f6',
    ENTREGADO:  '#22c55e',
    CANCELADO:  '#ef4444',
}

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
        <div style={{
            border: destacada ? '2px solid #22c55e' : '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '1rem',
            marginBottom: '1rem',
        }}>
            {destacada && (
                <p style={{ color: '#22c55e', margin: '0 0 0.5rem', fontWeight: 'bold' }}>
                    ✓ Orden creada exitosamente
                </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>Orden #{orden.id}</span>
                <span style={{
                    background: colorEstado[orden.estado],
                    color: '#fff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    fontSize: '0.8rem',
                }}>
                  {orden.estado}
                </span>
            </div>

            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>{fecha}</p>
            <p style={{ margin: '0.25rem 0' }}>
                📍 {orden.direccion} · 📞 {orden.telefono}
            </p>

            <table style={{ width: '100%', marginTop: '0.75rem', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '0.25rem 0', fontWeight: 'normal', color: '#6b7280' }}>Producto</th>
                    <th style={{ padding: '0.25rem 0', fontWeight: 'normal', color: '#6b7280' }}>Cant.</th>
                    <th style={{ padding: '0.25rem 0', fontWeight: 'normal', color: '#6b7280', textAlign: 'right' }}>Subtotal</th>
                </tr>
                </thead>
                <tbody>
                {orden.ordenItems.map(item => (
                    <tr key={item.id}>
                        <td style={{ padding: '0.25rem 0' }}>Producto #{item.productoId}</td>
                        <td>{item.cantidad}</td>
                        <td style={{ textAlign: 'right' }}>${(item.precio * item.cantidad).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                    <td colSpan={2} style={{ paddingTop: '0.5rem' }}>Total</td>
                    <td style={{ textAlign: 'right', paddingTop: '0.5rem' }}>${totalOrden.toFixed(2)}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    )
}
