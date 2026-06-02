import api from "./api";
import type {CarritoDTO} from "../types";

export const obtenerCarrito = ()=>
    api.get<CarritoDTO>('/carrito').then(res => res.data)

export const agregarItem = (productoId: number, cantidad: number)=>
    api.post<CarritoDTO>('/carrito/agregar', null, {params: {productoId, cantidad}})

export const removerItem = (productoId: number)=>
    api.delete(`/carrito/${productoId}`)

export const vaciarCarrito = ()=>
    api.delete('/carrito')