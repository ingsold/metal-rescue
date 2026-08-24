export type Role = 'donante' | 'administrador';

export type User = {
  id: string;
  name: string;
  lastName?: string;
  username?: string;
  email: string;
  role: Role;
  status?: 'active' | 'disabled';
  direccion?: string;
  telefono?: string;
};

export type PublicationState = 'borrador_pendiente' | 'aprobado_publicado' | 'rechazado' | 'vendido' | 'reservada';

export type OrderStatus = 'pendiente' | 'lista';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: Product[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type AcquisitionOrigin = 'Tienda oficial en concierto' | 'Mercadería de tour' | 'Mercado Local' | 'Colección Personal';
export type AuthenticityStatus = 'Oficial' | 'Bootleg' | 'Desconocido';

export interface Product {
  id: string;
  imagen_url: string;
  imagenes_url?: string[];
  banda_artista: string;
  tipo_prenda: string;
  talla?: string;
  estado_conservacion: string;
  origen_adquisicion: AcquisitionOrigin;
  precio_estimado_donante: number;
  precio_sugerido_ia?: number;
  autenticidad_ia?: AuthenticityStatus;
  precio_final_aprobado?: number;
  descripcion_marketing?: string;
  estado_publicacion: PublicationState;
  fecha_donacion: string;
  fecha_venta?: string;
  evento_origen: string;
  usuario_donante_id: string;
  usuario_donante_nombre: string;
}

export interface ShelterDelivery {
  id: string;
  refugio_nombre: string;
  monto_donado_gtq: number;
  alimento_comprado_kg: number;
  foto_evidencia_url: string;
  fecha_entrega: string;
  descripcion_impacto: string;
}

export interface Event {
  id: string;
  nombre: string;
  fecha: string;
  lugar: string;
  direccion: string;
  imagen_url: string;
  estado: 'activo' | 'cancelado';
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: string;
}
