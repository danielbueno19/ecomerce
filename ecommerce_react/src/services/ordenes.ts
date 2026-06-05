import api from "./api";
import type {EstadoOrden, OrdenDTO} from "../types";

export const crearOrden = (direccion: string, telefono: string) =>
    api.post<OrdenDTO>('/ordenes', null, {params: {direccion, telefono}}).then(res => res.data)

export const obtenerOrdenesUsuario = () =>
    api.get<OrdenDTO[]>('/ordenes/usuario').then(res => res.data)

export const obtenerTodasOrdenes = () =>
    api.get<OrdenDTO[]>('/ordenes').then(res => res.data)

export const actualizarEstadoOrden = (ordenId: number, estado: EstadoOrden) =>
    api.put<OrdenDTO>(`/ordenes/${ordenId}/estado`, null, {params: {estado}})
    .then(res => res.data)
