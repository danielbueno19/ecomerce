import api from './api'
import type {Page, ProductoDTO, ProductoListDTO} from '../types'

export const getProductos = (page = 0, size = 10 ) =>
	api.get<Page<ProductoListDTO>>('/productos', { params: {page, size }})
	.then(res => res.data)

export const getProducto = (id:number) =>
	api.get<ProductoDTO>(`/productos/${id}`)
	.then(res => res.data)