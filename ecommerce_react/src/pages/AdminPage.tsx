import {useEffect, useState} from "react";
import {EstadoOrden, OrdenDTO, ProductoDTO, ProductoListDTO} from "../types";
import {actualizarProducto, crearProducto, eliminarProducto, getProducto, getProductos} from "../services/productos";
import ProductoListAdmin from "../components/admin/ProductoListAdmin";
import ProductoForm from "../components/admin/ProductoForm";
import {actualizarEstadoOrden, obtenerTodasOrdenes} from "../services/ordenes";
import OrdenListAdmin from "../components/admin/OrdenListAdmin";
import styles from './AdminPage.module.css'

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
        <div className={styles.page}>
            <h2 className={styles.title}>Panel de administración</h2>
            {/* Selector de sección */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${seccion === 'productos' ? styles.activeTab : ''}`}
                    onClick={() => setSeccion('productos')}
                >
                    Productos
                </button>
                <button
                    className={`${styles.tabButton} ${seccion === 'ordenes' ? styles.activeTab : ''}`}
                    onClick={() => { setSeccion('ordenes'); cargarOrdenes() }}
                >
                    Órdenes
                </button>
            </div>

            {/* Sección productos */}
            {seccion === 'productos' && (
                <>
                    {vista === 'lista' && (
                        <>
                            <button className={styles.createButton} onClick={() => setVista('crear')}>+ Crear producto</button>
                            {loading ? <p className={styles.loadingText}>Cargando...</p> : (
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
                            <h3 className={styles.sectionTitle}>Crear producto</h3>
                            <ProductoForm onSubmit={handleCrear} onCancelar={() => setVista('lista')} />
                        </>
                    )}
                    {vista === 'editar' && productoEditando && (
                        <>
                            <h3 className={styles.sectionTitle}>Editar producto</h3>
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
                    <h3 className={styles.sectionTitle}>Órdenes ({ordenes.length})</h3>
                    {loadingOrdenes ? <p className={styles.loadingText}>Cargando órdenes...</p> : (
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
