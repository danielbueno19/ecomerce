import api from "./api";
import {OrdenDTO} from "../types";

export const crearOrden = (direccion: string, telefono: string) =>
    api.post<OrdenDTO>('/ordenes', null, {params: {direccion, telefono}}).then(res => res.data)

export const obtenerOrdenesUsuario = () =>
    api.get<OrdenDTO[]>('/ordenes/usuarios').then(res => res.data)
