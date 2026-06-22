export interface CarritoItem {
  id: number;
  productoId: number;
  cantidad: number;
}

export interface Carrito {
  id: number;
  usuarioId: number;
  items: CarritoItem[]
}

// Modelo enriquecido para mostrar en la UI (item + datos del producto)
export interface CarritoItemVista {
  itemId: number;
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}