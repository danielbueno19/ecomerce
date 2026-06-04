import api from './api'
import type {Page, ProductoDTO, ProductoListDTO} from '../types'

export const getProductos = (page = 0, size = 10 ) =>
	api.get<Page<ProductoListDTO>>('/productos', { params: {page, size }})
	.then(res => res.data)

export const getProducto = (id:number) =>
	api.get<ProductoDTO>(`/productos/${id}`)
	.then(res => res.data)

export const crearProducto = (producto: Omit<ProductoDTO, 'id' | 'comentarios'>, imagen?: File) => {
	const formData = new FormData()
	formData.append('producto', new Blob([JSON.stringify(producto)], {type: 'application/json'}))

	if (imagen) formData.append('imagen', imagen)

	return api.post<ProductoDTO>('/productos', formData, {
		headers: {'Content-Type': 'multipart/form-data'}
	}).then(res => res.data)
}

export const actualizarProducto = (id: number, producto: Omit<ProductoDTO, "id" | "comentarios">, imagen?: File)=> {
	const formData = new FormData()
	formData.append('producto', new Blob([JSON.stringify(producto)], {type: 'application/json'}))

	if (imagen) formData.append('imagen', imagen)

	return api.put<ProductoDTO>(`/productos/${id}`, formData, {
		headers: {'Content-Type': 'multipart/form-data'},
	}).then(res => res.data)
}

export const eliminarProducto = (id: number) =>
	api.delete(`/productos/${id}`)
