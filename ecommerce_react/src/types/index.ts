export interface LoginRequest {
  email: string
  password: string
}

export interface RegistroRequest {
  email: string
  password: string
  nombre?: string
}

export interface ComentarioDTO {
    id: number
    contenido: string
    puntuacion: number
    usuarioId: number
}

// Detalle completo de un producto (incluye comentarios)
export interface ProductoDTO {
  id: number
  nombre: string
  descripcion: string
  precio: number
  cantidad: number
  imagen: string | null
  comentarios: ComentarioDTO[]
}

// Versión resumida para el listado (sin comentarios)
export interface ProductoListDTO {
  id: number
  nombre: string
  descripcion: string
  price: number   // ojo: el backend usa "price" aquí, no "precio"
  cantidad: number
  imagen: string | null
}

// Respuesta paginada que devuelve Spring cuando usas Pageable
export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number  // página actual (base 0)
  size: number
}

export interface CarritoItemDTO {
  id: number
  productoId: number
  cantidad: number
}

export interface CarritoDTO {
  id: number
  usuarioId: number
  items: CarritoItemDTO[]
}

// Item enriquecido: combina CarritoItemDTO con datos del producto para mostrar en UI
export interface CarritoItemEnriquecido {
  id: number
  productoId: number
  cantidad: number
  nombre: string
  precio: number
  imagen: string | null
}

export type EstadoOrden = 'PREPARANDO' | 'ENTREGANDO' | 'ENTREGADO' | 'CANCELADO'

export interface OrdenItemDTO {
  id: number
  productoId: number
  cantidad: number
  precio: number
}

export interface OrdenDTO {
  id: number
  usuarioId: number
  direccion: string
  telefono: string
  estado: EstadoOrden
  fechaCreacion: string // LocalDateTime llega como string ISO desde Spring
  ordenItems: OrdenItemDTO
}
