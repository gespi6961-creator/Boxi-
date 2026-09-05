// =============================================
// TIPOS PARA BOXI STORE
// =============================================

// Categoría
export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  activa: boolean;
  orden: number;
  created_at: string;
}

// Producto
export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  descripcion_corta: string | null;
  precio_base: number;
  precio_oferta: number | null;
  imagen_url: string | null;
  imagenes: string[];
  categoria_id: string;
  caracteristicas: string[];
  activo: boolean;
  destacado: boolean;
  created_at: string;
  updated_at: string;
  // Relaciones
  categoria?: Categoria;
  variantes?: Variante[];
}

// Variante
export interface Variante {
  id: string;
  producto_id: string;
  nombre: string;
  sku: string | null;
  precio: number | null;
  stock: number;
  imagen_url: string | null;
  activa: boolean;
  created_at: string;
}

// Usuario
export interface Usuario {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  telefono: string | null;
  direccion: Direccion;
  created_at: string;
  updated_at: string;
}

// Dirección
export interface Direccion {
  calle?: string;
  numero?: string;
  colonia?: string;
  ciudad?: string;
  estado?: string;
  codigo_postal?: string;
}

// Pedido
export interface Pedido {
  id: string;
  numero_pedido: string;
  cliente_id: string;
  estado: EstadoPedido;
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  metodo_pago: string;
  datos_pago: Record<string, unknown>;
  direccion_envio: Direccion;
  notas: string | null;
  notas_admin: string | null;
  created_at: string;
  updated_at: string;
  // Relaciones
  detalles?: PedidoDetalle[];
  cliente?: Cliente;
}

// Cliente
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: Direccion | null;
  notas: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Estado de pedido
export type EstadoPedido = 
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

// Detalle de pedido
export interface PedidoDetalle {
  id: string;
  pedido_id: string;
  producto_id: string;
  variante_id: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  // Relaciones
  producto?: Producto;
  variante?: Variante;
}

// Cupón
export interface Cupon {
  id: string;
  codigo: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  minimo_compra: number;
  fecha_inicio: string | null;
  fecha_expiracion: string | null;
  uso_maximo: number | null;
  uso_actual: number;
  activo: boolean;
  created_at: string;
}

// Item del carrito
export interface CarritoItem {
  producto: Producto;
  variante: Variante;
  cantidad: number;
}

// Estado del carrito
export interface CarritoState {
  items: CarritoItem[];
  cupon: Cupon | null;
  descuento: number;
}

// Filtros de catálogo
export interface FiltrosCatalogo {
  categoria?: string;
  busqueda?: string;
  precio_min?: number;
  precio_max?: number;
  ordenar?: 'precio_asc' | 'precio_desc' | 'novedad' | 'popularidad';
  pagina?: number;
  por_pagina?: number;
}

// Respuesta API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  total?: number;
}
