import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Search, Filter, Trash2, ShieldAlert, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Clock, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, orderBy, getDocs, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export const AdminDonations: React.FC = () => {
  const { deleteProduct, user } = useApp();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);

  const [filter, setFilter] = useState<string>('todos');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async (isNext: boolean = false) => {
    if (!user) return;
    setIsLoading(true);
    try {
      let constraints: any[] = [
        where('usuario_donante_id', '==', user.id),
        orderBy('fecha_donacion', 'desc'),
        limit(itemsPerPage)
      ];
      if (isNext && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }
      const q = query(collection(db, 'products'), ...constraints);
      const snap = await getDocs(q);
      
      const prods = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(prods);
      
      if (snap.docs.length > 0) {
        setLastVisible(snap.docs[snap.docs.length - 1]);
      }
      setHasMore(snap.docs.length === itemsPerPage);
    } catch(e) {
      console.error("Error fetching admin donations", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
  }, [itemsPerPage, user]);

  const handleNextPage = () => {
    setCurrentPage(p => p + 1);
    fetchProducts(true);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
    setLastVisible(null);
    fetchProducts(false);
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'todos') return true;
    return p.estado_publicacion === filter;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'borrador_pendiente':
        return <span className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 text-xs font-bold uppercase"><Clock className="w-3 h-3" /> <span>Pendiente Revisión</span></span>;
      case 'aprobado_publicado':
        return <span className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-3 py-1 rounded border border-green-400/20 text-xs font-bold uppercase"><CheckCircle2 className="w-3 h-3" /> <span>Publicado</span></span>;
      case 'rechazado':
        return <span className="flex items-center space-x-1 text-red-400 bg-red-400/10 px-3 py-1 rounded border border-red-400/20 text-xs font-bold uppercase"><span>Rechazado</span></span>;
      case 'vendido':
        return <span className="flex items-center space-x-1 text-sabbath-400 bg-sabbath-400/10 px-3 py-1 rounded border border-sabbath-400/20 text-xs font-bold uppercase"><HeartHandshake className="w-3 h-3" /> <span>Vendido</span></span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-sabbath-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">MIS PRENDAS DONADAS</h1>
          <p className="text-zinc-400">Control de las prendas que has subido como administrador.</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-sabbath-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-sabbath-900 border border-sabbath-800 rounded px-4 py-2 focus:outline-none focus:border-sabbath-500 text-white"
          >
            <option value="todos">Todos los Estados</option>
            <option value="borrador_pendiente">Pendientes de Revisión</option>
            <option value="aprobado_publicado">Publicados / Aprobados</option>
            <option value="vendido">Vendidos</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="h-48 relative">
              <ImageGallery images={product.imagenes_url || []} alt={product.banda_artista} />
              <div className="absolute top-3 right-3">
                {getStatusBadge(product.estado_publicacion)}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-white uppercase">{product.banda_artista}</h3>
                <div className="flex items-center">
                  {deletingId === product.id ? (
                    <div className="flex items-center gap-2 bg-red-950/50 px-2 py-1 rounded-md border border-red-900">
                      <span className="text-xs text-red-200">¿Eliminar?</span>
                      <button 
                        onClick={() => {
                          deleteProduct(product.id);
                          setDeletingId(null);
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300"
                      >
                        Sí
                      </button>
                      <button 
                        onClick={() => setDeletingId(null)}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeletingId(product.id)}
                      className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                {product.tipo_prenda} {product.talla ? `(Talla: ${product.talla})` : ''} • <span className="text-zinc-300">Donante: {product.usuario_donante_nombre}</span>
              </p>
              
              <div className="space-y-3 bg-sabbath-950/50 p-4 rounded-lg border border-sabbath-800/50 mt-auto">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Estimación Donante:</span>
                  <span className="font-medium text-white">Q{product.precio_estimado_donante}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-sabbath-800/50 pt-2">
                  <span className="text-zinc-400 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-sabbath-500" /> Sugerencia IA:</span>
                  <span className="font-medium text-sabbath-400">Q{product.precio_sugerido_ia}</span>
                </div>
                {product.precio_final_aprobado && (
                  <div className="flex justify-between items-center text-sm border-t border-sabbath-800/50 pt-2">
                    <span className="text-zinc-300 font-medium">Precio Aprobado:</span>
                    <span className="font-bold text-white text-lg">Q{product.precio_final_aprobado}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
            <p className="text-zinc-400 text-lg">No hay prendas que coincidan con este estado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
