import {useEffect, useState} from "react";
import {ProductoDTO, ProductoListDTO} from "../types";
import {actualizarProducto, crearProducto, eliminarProducto, getProducto, getProductos} from "../services/productos";
import ProductoListAdmin from "../components/admin/ProductoListAdmin";
import ProductoForm from "../components/admin/ProductoForm";

type Vista = 'lista' | 'crear' | 'editar'

export default function AdminPage() {
    const [productos, setProductos] = useState<ProductoListDTO[]>([])
    const [vista, setVista] = useState<Vista>('lista')
    const [productoEditando, setProductoEditando] = useState<ProductoDTO | null>(null)
    const [loading, setLoading] = useState(true)

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

            {vista === 'lista' && (
                <>
                    <button onClick={() => setVista('crear')} style={{marginBottom:'1rem'}}>+ Crear producto</button>
                    {loading? <p>Cargando...</p>: (
                        <ProductoListAdmin productos={productos} onEditar={abrirEdicion} onEliminar={handleEliminar}/>
                    )}
                </>
            )}

            {vista === 'crear' && (
                <>
                    <h3>Crear producto</h3>
                    <ProductoForm onSubmit={handleCrear} onCancelar={() => setVista('lista')}/>
                </>
            )}

            {vista === 'editar' && productoEditando && (
                <>
                    <h3>Editar producto</h3>
                    <ProductoForm productoInicial={productoEditando} onSubmit={handleEditar} onCancelar={()=>{setVista('lista'); setProductoEditando(null)}}/>
                </>
            )}
        </div>
    )
}
