import type { ProductoListDTO } from '../../types'

interface Props {
    productos: ProductoListDTO[]
    onEditar: (id: number) => void
    onEliminar: (id: number) => void
}

export default function ProductoListAdmin({ productos, onEditar, onEliminar }: Props) {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {productos.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.5rem' }}>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>${p.price}</td>
                    <td>{p.cantidad}</td>
                    <td>
                        <button onClick={() => onEditar(p.id)} style={{ marginRight: '0.5rem' }}>Editar</button>
                        <button onClick={() => onEliminar(p.id)} style={{ background: '#ef4444', color: '#fff' }}>Eliminar</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
