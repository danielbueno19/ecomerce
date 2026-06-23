// Espeja OrdenItemDTO.java
export interface OrdenItem {
  id: number;
  productoId: number;
  cantidad: number;
  precio: number;
}

// Espeja OrdenDTO.java + enum EstadoOrden
export type EstadoOrden = 'PREPARANDO' | 'ENTREGANDO' | 'ENTREGADO' | 'CANCELADO';

export interface Orden {
  id: number;
  usuarioId: number;
  direccion: string;
  telefono: string;
  estado: EstadoOrden;
  fechaCreacion: string; // LocalDateTime llega como string ISO desde Spring
  ordenItems: OrdenItem[];
}
