import api from "./api";
import {ComentarioDTO} from "../types";

export const getComentarios = (productoId: number) =>
    api.get<ComentarioDTO[]>(`/comentarios/producto/${productoId}`).then(res => res.data)

export const agregarComentario = (productoId: number, data: Pick<ComentarioDTO, 'contenido' | 'puntuacion'>) =>
    api.post(`/comentarios/producto/${productoId}`, data).then(res => res.data)
