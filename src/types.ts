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

export type OrderStatus = 'pendiente' | 'verificando_pago' | 'lista' | 'cancelada';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: Product[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentReceiptUrl?: string;
}

export type AcquisitionOrigin = 'Tienda Oficial en Linea' | 'Mercadería de tour' | 'Mercado Local' | 'Colección Personal' | 'Oficial Local';
export type AuthenticityStatus = 'Oficial' | 'Bootleg' | 'Desconocido';

export interface Product {
  id: string;
  imagenes_url: string[];
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

export interface Ally {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  descripcion: string;
  imagen: string;
  redes_sociales?: string;
}

export interface ShelterDelivery {
  id: string;
  refugio_nombre: string;
  monto_donado_gtq: number;
  alimento_comprado_kg: number;
  foto_evidencia_url: string;
  galeria_urls?: string[];
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
export interface GoldenSetEvaluation {
  id_muestra?: string;
  fecha_evaluacion: string;
  banda_artista: string;
  tipo_prenda: string;
  estado_conservacion: string;
  origen_adquisicion: string;
  evento_origen: string;
  precio_estimado_donante: number;
  precio_sugerido_ia: number;
  autenticidad_ia: string;
  nivel_confianza_ia: number;
  razonamiento_analisis: string;
  descripcion_marketing: string;
  imagen_url: string;
  producto_id?: string;
  precio_final_aprobado?: number;
}
