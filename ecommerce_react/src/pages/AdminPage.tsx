import {useEffect, useState} from "react";
import {EstadoOrden, OrdenDTO, ProductoDTO, ProductoListDTO} from "../types";
import {actualizarProducto, crearProducto, eliminarProducto, getProducto, getProductos} from "../services/productos";
import ProductoListAdmin from "../components/admin/ProductoListAdmin";
import ProductoForm from "../components/admin/ProductoForm";
import {actualizarEstadoOrden, obtenerTodasOrdenes} from "../services/ordenes";
import OrdenListAdmin from "../components/admin/OrdenListAdmin";

type Vista = 'lista' | 'crear' | 'editar'
type Seccion = 'productos' | 'ordenes'

export default function AdminPage() {
    const [productos, setProductos] = useState<ProductoListDTO[]>([])
    const [vista, setVista] = useState<Vista>('lista')
    const [productoEditando, setProductoEditando] = useState<ProductoDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const [seccion, setSeccion] = useState<Seccion>('productos')
    const [ordenes, setOrdenes] = useState<OrdenDTO[]>([])
    const [filtroEstado, setFiltroEstado] = useState<EstadoOrden | 'TODOS'>('TODOS')
    const [loadingOrdenes, setLoadingOrdenes] = useState(false)

    const cargarProductos = async () => {
        setLoading(true)
        try {
            const page = await getProductos(0, 100) // carga todos sin paginación por simplicidad
            setProductos(page.content)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {cargarProductos()}, [])

    const cargarOrdenes = async () => {
        setLoadingOrdenes(true)
        try {
            const data = await obtenerTodasOrdenes()
            setOrdenes(data.sort((a,b) =>
                new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
            ))
        } finally {
            setLoadingOrdenes(false)
        }
    }

    const handleCambiarEstado = async (ordenId: number, estado: EstadoOrden) => {
        await actualizarEstadoOrden(ordenId, estado)
        setOrdenes(prev => prev.map(o => o.id === ordenId ? {...o, estado}: o))
    }

    const handleCrear = async (data: Omit<ProductoDTO, "id" | "comentarios">, imagen?: File) => {
        await crearProducto(data, imagen)
        await cargarProductos()
        setVista('lista')
    }

    const handleEditar = async (data: Omit<ProductoDTO, "id" | "comentarios">, imagen?: File) => {
        if (!productoEditando) return
        await actualizarProducto(productoEditando.id, data, imagen)
        await cargarProductos()
        setVista('lista')
        setProductoEditando(null)
    }

    const handleEliminar = async (id: number) => {
        if (!confirm('Estás seguro de eliminar este producto')) return
        await eliminarProducto(id)
        await cargarProductos()
    }

    const abrirEdicion = async (id: number) => {
        const producto = await getProducto(id)
        setProductoEditando(producto)
        setVista('editar')
    }

    return (
        <div>
            <h2>Panel de administración</h2>
            {/* Selector de sección */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setSeccion('productos')}
                    style={{ fontWeight: seccion === 'productos' ? 'bold' : 'normal' }}
                >
                    Productos
                </button>
                <button
                    onClick={() => { setSeccion('ordenes'); cargarOrdenes() }}
                    style={{ fontWeight: seccion === 'ordenes' ? 'bold' : 'normal' }}
                >
                    Órdenes
                </button>
            </div>

            {/* Sección productos */}
            {seccion === 'productos' && (
                <>
                    {vista === 'lista' && (
                        <>
                            <button onClick={() => setVista('crear')} style={{ marginBottom: '1rem' }}>+ Crear producto</button>
                            {loading ? <p>Cargando...</p> : (
                                <ProductoListAdmin
                                    productos={productos}
                                    onEditar={abrirEdicion}
                                    onEliminar={handleEliminar}
                                />
                            )}
                        </>
                    )}
                    {vista === 'crear' && (
                        <>
                            <h3>Crear producto</h3>
                            <ProductoForm onSubmit={handleCrear} onCancelar={() => setVista('lista')} />
                        </>
                    )}
                    {vista === 'editar' && productoEditando && (
                        <>
                            <h3>Editar producto</h3>
                            <ProductoForm
                                productoInicial={productoEditando}
                                onSubmit={handleEditar}
                                onCancelar={() => { setVista('lista'); setProductoEditando(null) }}
                            />
                        </>
                    )}
                </>
            )}

            {/* Sección órdenes */}
            {seccion === 'ordenes' && (
                <>
                    <h3>Órdenes ({ordenes.length})</h3>
                    {loadingOrdenes ? <p>Cargando órdenes...</p> : (
                        <OrdenListAdmin
                            ordenes={ordenes}
                            onCambiarEstado={handleCambiarEstado}
                            filtro={filtroEstado}
                            onFiltro={setFiltroEstado}
                        />
                    )}
                </>
            )}
        </div>
    )
}
