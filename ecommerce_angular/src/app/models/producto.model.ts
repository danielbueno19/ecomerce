import { Comentario } from './comentario.model';

// Espejo de ProductoDto.java - usado en listado página
export interface ProductoList {
  id: number;
  nombre: string;
  descripcion: string;
  price: number;
  cantidad: number;
  imagen: string | null;
}

// Espejo de ProductoDTO.java - usado en detalle y admin
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  imagen: string | null;
  comentarios: Comentario[];
}

// Espejo de la Respuesta paginada de Spring Data (Page<T>)
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página actual (0-indexed)
  size: number;
}