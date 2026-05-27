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