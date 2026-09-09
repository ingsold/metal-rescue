import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2, ShieldCheck, HeartHandshake, Trash2 } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export const MyDonations: React.FC = () => {
  const { user, deleteProduct, isLoading: isAuthLoading } = useApp();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!user) return;
      setIsLoadingProducts(true);
      try {
        const q = query(
          collection(db, 'products'),
          where('usuario_donante_id', '==', user.id),
          orderBy('fecha_donacion', 'desc')
        );
        const snap = await getDocs(q);
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error("Error fetching user products", e);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchUserProducts();
  }, [user]);

  const userProducts = products;


  const getStatusBadge = (product: any) => {
    const status = product.estado_publicacion;
    switch(status) {
      case 'borrador_pendiente':
        if (!product.precio_sugerido_ia) {
          return (
            <span className="flex items-center space-x-1.5 text-blue-400 bg-blue-900/30 px-3 py-1.5 rounded border border-blue-500/30 text-xs font-bold uppercase shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V2M12 22V20M4 12H2M22 12H20M17.6569 6.34315L19.0711 4.92893M4.92893 19.0711L6.34315 17.6569M17.6569 17.6569L19.0711 19.0711M4.92893 4.92893L6.34315 6.34315" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>IA Tasando Prenda...</span>
            </span>
          );
        }
        return <span className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 text-xs font-bold uppercase"><Clock className="w-3 h-3" /> <span>Pendiente Revisión</span></span>;
      case 'aprobado_publicado':
        return <span className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-3 py-1 rounded border border-green-400/20 text-xs font-bold uppercase"><CheckCircle2 className="w-3 h-3" /> <span>Publicado</span></span>;
      case 'rechazado':
        return <span className="flex items-center space-x-1 text-red-400 bg-red-400/10 px-3 py-1 rounded border border-red-400/20 text-xs font-bold uppercase"><span>Rechazado</span></span>;
      case 'vendido':
        return <span className="flex items-center space-x-1 text-sabbath-400 bg-sabbath-400/10 px-3 py-1 rounded border border-sabbath-400/20 text-xs font-bold uppercase"><HeartHandshake className="w-3 h-3" /> <span>¡Vendido y Donado!</span></span>;
      default:
        return null;
    }
  };


  if (isAuthLoading || isLoadingProducts) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-500"></div></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-sabbath-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">MIS DONACIONES</h1>
          <p className="text-zinc-400">El historial de tu aporte a la causa. ¡Gracias por el apoyo!</p>
        </div>
      </div>
      
      {userProducts.length === 0 ? (
        <div className="text-center py-24 bg-sabbath-900/50 border border-sabbath-800/50 rounded-2xl flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-sabbath-950 border border-sabbath-800 rounded-full flex items-center justify-center mb-6">
            <HeartHandshake className="w-10 h-10 text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Comienza a apoyar la causa</h2>
          <p className="text-zinc-400 max-w-sm mb-8 text-center">Aún no has registrado ninguna donación. Sube tu primera prenda y ayuda a rescatar perros en situación de calle.</p>
          <a 
            href="/donar"
            className="bg-sabbath-600 hover:bg-sabbath-500 text-white px-8 py-3 rounded-md font-bold transition-colors inline-flex items-center gap-2"
          >
            Donar Prenda
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProducts.map((product) => (
            <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <ImageGallery images={product.imagenes_url || []} alt={product.banda_artista} />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(product)}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-white">{product.banda_artista}</h3>
                  {product.estado_publicacion === 'borrador_pendiente' && (
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
                          title="Eliminar donación"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-zinc-400 mb-4">{product.tipo_prenda} {product.talla ? `• Talla ${product.talla}` : ''}</p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Donada el:</span>
                    <span className="text-zinc-300">{new Date(product.fecha_donacion).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="bg-sabbath-950/50 p-3 rounded-lg border border-sabbath-800 space-y-2 mt-3">
                    <div className="flex justify-between text-xs sm:text-sm items-center">
                      <span className="text-zinc-400">Tu precio estimado:</span>
                      <span className="text-zinc-300">Q{product.precio_estimado_donante}</span>
                    </div>
                    
                    {product.precio_sugerido_ia ? (
                      <div className="flex justify-between text-xs sm:text-sm items-center">
                        <span className="text-blue-400/80">Tasación IA:</span>
                        <span className="text-blue-400/80">Q{product.precio_sugerido_ia}</span>
                      </div>
                    ) : null}
                    
                    {product.precio_final_aprobado ? (
                      <div className="flex justify-between items-center border-t border-sabbath-800/50 pt-2 mt-2">
                        <span className={`text-xs sm:text-sm ${product.estado_publicacion === 'vendido' ? 'text-green-400 font-bold' : 'text-zinc-300 font-medium'}`}>
                          {product.estado_publicacion === 'vendido' ? 'Vendida por:' : 'Precio de venta:'}
                        </span>
                        <span className={`font-bold ${product.estado_publicacion === 'vendido' ? 'text-green-400' : 'text-white'} text-base sm:text-lg`}>
                          Q{product.precio_final_aprobado}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};