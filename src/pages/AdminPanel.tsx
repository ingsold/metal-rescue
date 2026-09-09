import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Check, X, Edit3, Filter, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, where, orderBy, getDocs, limit, startAfter, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';


export const AdminPanel: React.FC = () => {
  const { updateProductStatus } = useApp();
  
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);

  // Filtering and Pagination State
  const [selectedType, setSelectedType] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  const fetchPending = async (isNext: boolean = false) => {
    setIsLoading(true);
    try {
      let constraints: any[] = [
        where('estado_publicacion', '==', 'borrador_pendiente'),
        orderBy('fecha_donacion', 'asc'), // Older first for admin
        limit(itemsPerPage)
      ];

      if (isNext && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }

      const q = query(collection(db, 'products'), ...constraints);
      const snap = await getDocs(q);
      
      const prods = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setPendingProducts(prods);
      
      if (snap.docs.length > 0) {
        setLastVisible(snap.docs[snap.docs.length - 1]);
      }
      setHasMore(snap.docs.length === itemsPerPage);
    } catch(e) {
      console.error("Error fetching pending products", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending(false);
  }, [itemsPerPage]);

  const handleNextPage = () => {
    setCurrentPage(p => p + 1);
    fetchPending(true);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
    setLastVisible(null);
    fetchPending(false);
  };


  const productTypes = ['Todos', 'Playera', 'Chumpa', 'Sudadero', 'Gorra', 'Accesorio', 'Otros'];
  const perPageOptions = [5, 10, 20];
  
  const filteredProducts = pendingProducts;
  const currentProducts = pendingProducts;

  // Local state for editing prices and marketing descriptions
  const [edits, setEdits] = useState<Record<string, { price: number, desc: string }>>({});
  
  const handleEditChange = (id: string, field: 'price' | 'desc', value: any, initialPrice: number, initialDesc?: string) => {
    setEdits(prev => {
      const currentState = prev[id] || { price: initialPrice, desc: initialDesc || 'Clásico de colección para el mosh.' };
      return {
        ...prev,
        [id]: {
          ...currentState,
          [field]: value
        }
      };
    });
  };
  
  const getEditState = (id: string, initialPrice: number, initialDesc?: string) => {
    return edits[id] || { price: initialPrice, desc: initialDesc || 'Clásico de colección para el mosh.' };
  };
  
  const handleApprove = (id: string, initialPrice: number, initialDesc?: string) => {
    const state = getEditState(id, initialPrice, initialDesc);
    updateProductStatus(id, 'aprobado_publicado', state.price, state.desc);
  };

  const handleReject = (id: string) => {
    updateProductStatus(id, 'rechazado');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-sabbath-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">PRENDAS PENDIENTES</h1>
          <p className="text-zinc-400">Audita y aprueba prendas para el catálogo.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/donar"
            className="flex items-center justify-center gap-2 bg-sabbath-600 hover:bg-sabbath-500 text-white px-5 py-3 rounded-md font-bold transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Donar Prenda (Admin)</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-sabbath-900 border border-sabbath-800 p-6 rounded-xl flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-sabbath-400" />
          <span className="font-bold text-white tracking-wide">FILTROS</span>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row gap-6 w-full">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tipo de Prenda</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
            >
              {productTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Price Range Filter */}
          <div className="flex-1">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex justify-between">
              <span>Precio Estimado Máximo</span>
              <span className="text-sabbath-400">Q{maxPrice}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-sabbath-950 rounded-lg appearance-none cursor-pointer accent-sabbath-500 mt-3"
            />
          </div>
        </div>
      </div>

      {/* Pagination Items Per Page Header */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-end items-center text-sm text-zinc-400">
          <span>Mostrar:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="ml-2 bg-sabbath-900 border border-sabbath-800 rounded px-2 py-1 focus:outline-none focus:border-sabbath-500 text-white"
          >
            {perPageOptions.map(opt => (
              <option key={opt} value={opt}>{opt} por página</option>
            ))}
          </select>
        </div>
      )}
      <div className="space-y-6">

        {currentProducts.map((product) => {
          const editState = getEditState(product.id, product.precio_sugerido_ia || 0, product.descripcion_marketing);
          return (
            <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
              <div className="lg:w-1/3 bg-sabbath-950 p-6 flex items-center justify-center">
                <ImageGallery 
                  images={product.imagenes_url || []} 
                  alt={product.banda_artista} 
                />
              </div>
              <div className="lg:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-wider">{product.banda_artista}</h3>
                      <p className="text-zinc-400">
                        {product.tipo_prenda} {product.talla ? `(Talla: ${product.talla})` : ''} • {product.estado_conservacion}
                      </p>
                      <p className="text-sm text-zinc-500">Donante: <span className="text-zinc-300">{product.usuario_donante_nombre}</span></p>
                    </div>
                    <div className="bg-sabbath-950 p-3 rounded-lg border border-sabbath-800/50 min-w-[150px]">
                      <h4 className="text-xs font-bold text-sabbath-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Matriz Financiera AI
                      </h4>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-zinc-400">Estimado Donante:</span>
                        <span className="text-zinc-300">Q{product.precio_estimado_donante}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-sabbath-800/50 pt-2">
                        <span className="text-sabbath-400 font-medium">Sugerido Gemini (IA):</span>
                        <span className="text-sabbath-400 font-bold">Q{product.precio_sugerido_ia}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Precio Final (Q)</label>
                      <input 
                        type="number"
                        value={editState.price}
                        onChange={(e) => handleEditChange(product.id, 'price', Number(e.target.value), product.precio_sugerido_ia || 0, product.descripcion_marketing)}
                        className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-3 py-2 text-white text-lg font-bold focus:border-sabbath-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Descripción Marketing
                      </label>
                      <textarea                         rows={3}
                        value={editState.desc}
                        onChange={(e) => handleEditChange(product.id, 'desc', e.target.value, product.precio_sugerido_ia || 0, product.descripcion_marketing)}
                        className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-3 py-2 text-zinc-300 focus:border-sabbath-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-sabbath-800/50">
                    <button 
                      onClick={() => handleApprove(product.id, product.precio_sugerido_ia || 0, product.descripcion_marketing)}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-md font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check className="w-5 h-5" /> Aprobar y Publicar
                    </button>
                    <button 
                      onClick={() => handleReject(product.id)}
                      className="px-6 bg-sabbath-950 border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 py-3 rounded-md font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <X className="w-5 h-5" /> Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {pendingProducts.length > 0 && currentProducts.length === 0 && (
          <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
            <ShieldAlert className="w-16 h-16 text-zinc-500 mx-auto mb-4 opacity-50" />
            <p className="text-zinc-400 text-xl font-medium">No hay coincidencias.</p>
            <p className="text-zinc-500 mt-2">Prueba ajustando los filtros de búsqueda.</p>
          </div>
        )}

        {pendingProducts.length === 0 && (
          <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
            <ShieldAlert className="w-16 h-16 text-sabbath-500 mx-auto mb-4 opacity-50" />
            <p className="text-zinc-400 text-xl font-medium">Bandeja limpia.</p>
            <p className="text-zinc-500 mt-2">No hay prendas pendientes de revisión.</p>
          </div>
        )}
      </div>

            <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-zinc-300 font-medium">
          Página {currentPage}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={!hasMore || isLoading}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};