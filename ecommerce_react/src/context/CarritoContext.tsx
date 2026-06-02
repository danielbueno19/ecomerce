import {CarritoItemEnriquecido} from "../types";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useAuth} from "./AuthContext";
import * as carritoService from '../services/carrito'
import {getProducto} from "../services/productos";

interface CarritoContextType {
    items: CarritoItemEnriquecido[]
    loading: boolean
    agregar: (productoId: number, cantidad: number) => Promise<void>
    remover: (productoId: number) => Promise<void>
    vaciar: () => Promise<void>
    total: number
    cantidadItems: number
}

const CarritoContext = createContext<CarritoContextType | null>(null)

export function CarritoProvider({children}: {children: React.ReactNode}) {
    const {token} = useAuth()
    const [items, setItems] = useState<CarritoItemEnriquecido[]>([])
    const [loading, setLoading] = useState(false)

    // Carga el carrito del backend y enriquece cada item con datos del producto
    const cargarCarrito = useCallback(async ()=> {
        if (!token) {setItems([]); return}
        setLoading(true)
        try {
            const carrito = await carritoService.obtenerCarrito()
            const itemsEnriquecidos = await Promise.all(
                carrito.items.map( async item => {
                    const producto = await getProducto(item.productoId)
                    return {
                        id: item.id,
                        productoId: item.productoId,
                        cantidad: item.cantidad,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen
                    }
                })
            )
            setItems(itemsEnriquecidos)
        } catch {
            setItems([])
        } finally {
            setLoading(false)
        }
    }, [token])

    // Carga el carrito al iniciar sesión, lo limpia al cerrarla
    useEffect(()=> {
        cargarCarrito()
    }, [cargarCarrito])

    const agregar = async (productoId: number, cantidad: number) => {
      await carritoService.agregarItem(productoId, cantidad)
      await cargarCarrito()
    }

    const remover = async (productoId: number) => {
      await carritoService.removerItem(productoId)
      await cargarCarrito()
    }

    const vaciar = async () => {
        await carritoService.vaciarCarrito()
        setItems([])
    }

    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
    const cantidadItems = items.reduce((acc, item) => acc + item.cantidad, 0)

    return (
        <CarritoContext.Provider value={{items, loading, agregar, remover, vaciar, total, cantidadItems}}>
            {children}
        </CarritoContext.Provider>
    )
}

export function useCarrito() {
    const ctx = useContext(CarritoContext)
    if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider')
    return ctx
}