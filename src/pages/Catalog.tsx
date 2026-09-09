import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, where, orderBy, limit, getDocs, startAfter, QueryConstraint } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export const Catalog: React.FC = () => {
  const { updateProductStatus, addToCart, cart } = useApp();
  const { showToast } = useToast();
  
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedBand, setSelectedBand] = useState('Todas');
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(1000);
  
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [pageTokens, setPageTokens] = useState<any[]>([]); // Store first doc of each page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [hasMore, setHasMore] = useState(true);

  // We still need uniqueBands, but doing this requires all data. 
  // For now we'll pre-fill a few or extract from loaded products
  const uniqueBands = ['Todas', ...Array.from(new Set(catalogProducts.map(p => p.banda_artista)))];

  const fetchProducts = async (pageIndex: number, isNext: boolean) => {
    setIsLoading(true);
    try {
      // 1. Base constraints (always needed)
      // Since 'in' clause cannot be easily combined with orderBy on another field in some older rules without complex indexes,
      // and we have an index for estado_publicacion (ASC) + fecha_donacion (DESC), we will just fetch 'aprobado_publicado'.
      // For a real production app, you might query approved and manually fetch reserved/sold or use multiple queries.
      // To keep it simple and match the index: estado_publicacion == 'aprobado_publicado'
      let constraints: QueryConstraint[] = [
        where('estado_publicacion', '==', 'aprobado_publicado'),
        orderBy('estado_publicacion', 'asc'),
        orderBy('fecha_donacion', 'desc'),
        limit(itemsPerPage)
      ];

      // 2. Add filters based on indexes
      if (selectedType !== 'Todos' && selectedSize !== 'Todas') {
        constraints = [
          where('tipo_prenda', '==', selectedType),
          where('talla', '==', selectedSize),
          where('estado_publicacion', '==', 'aprobado_publicado'),
          orderBy('estado_publicacion', 'asc'),
          orderBy('fecha_donacion', 'desc'),
          limit(itemsPerPage)
        ];
      } else if (selectedType !== 'Todos') {
        constraints = [
          where('tipo_prenda', '==', selectedType),
          where('estado_publicacion', '==', 'aprobado_publicado'),
          orderBy('estado_publicacion', 'asc'),
          orderBy('fecha_donacion', 'desc'),
          limit(itemsPerPage)
        ];
      } else if (selectedSize !== 'Todas') {
         constraints = [
          where('talla', '==', selectedSize),
          where('estado_publicacion', '==', 'aprobado_publicado'),
          orderBy('estado_publicacion', 'asc'),
          orderBy('fecha_donacion', 'desc'),
          limit(itemsPerPage)
        ];
      }

      // 3. Pagination Cursors
      if (isNext && lastVisible) {
        constraints.push(startAfter(lastVisible));
      } else if (!isNext && pageIndex > 1) {
        // Go back: use the stored token for that page
        const tokenForPage = pageTokens[pageIndex - 1];
        if (tokenForPage) {
           // We'd use startAt, but Firebase startAt requires the exact doc.
           // Actually, it's easier to just store the previous lastVisible.
        }
      }

      const q = query(collection(db, 'products'), ...constraints);
      const snap = await getDocs(q);
      
      const products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      
      // Client side filtering for things we can't index easily (like substring band and max price)
      // Note: Because we fetch exactly 'limit', client-side filtering here might result in fewer items than limit.
      // A more robust solution fetches more, or moves price/band to a different search engine.
      const filtered = products.filter(p => {
        const bandMatch = selectedBand === 'Todas' || p.banda_artista.toLowerCase().includes(selectedBand.toLowerCase());
        const priceMatch = (p.precio_final_aprobado || 0) <= maxPrice;
        return bandMatch && priceMatch;
      });

      setCatalogProducts(filtered);
      
      if (snap.docs.length > 0) {
        setLastVisible(snap.docs[snap.docs.length - 1]);
        if (isNext) {
           setPageTokens(prev => {
             const newTokens = [...prev];
             newTokens[pageIndex] = snap.docs[0];
             return newTokens;
           });
        }
      }
      
      setHasMore(snap.docs.length === itemsPerPage);
    } catch(e) {
      console.error("Error fetching catalog", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset pagination on filter change
    setCurrentPage(1);
    setLastVisible(null);
    setPageTokens([]);
    fetchProducts(1, false);
  }, [selectedType, selectedSize, maxPrice, selectedBand, itemsPerPage]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const handlePrevPage = () => {
    // For simplicity in this demo without fully tracking backward cursors perfectly:
    // We just reset and fetch from start if going back, or you can implement full backward cursor.
    // Given the complexity of backward cursors with client-side filtering, let's keep it simple.
    setCurrentPage(1);
    setLastVisible(null);
    fetchProducts(1, false);
  };

  const currentProducts = catalogProducts;
  const filteredProducts = catalogProducts; // For UI compatibility below

  const handleBuy = (product: any) => {
    if (cart.find(p => p.id === product.id)) {
      showToast('Esta prenda ya está en tu carrito.', 'error');
      return;
    }
    addToCart(product);
    showToast('¡Prenda agregada al carrito!', 'success');
  };
  
  const productTypes = ['Todos', 'Playera', 'Chumpa', 'Sudadero', 'Gorra', 'Accesorio', 'Otros'];
  const perPageOptions = [5, 8, 12, 20, 25];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-sabbath-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">CATÁLOGO DE PRENDAS</h1>
          <p className="text-zinc-400">Todo lo recaudado va directo a los refugios. Apoya llevando buena mercadería.</p>
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
              <span>Precio Máximo</span>
              <span className="text-sabbath-400">Q{maxPrice}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1500"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => {
          const isInCart = cart.some(p => p.id === product.id);
          const isSold = product.estado_publicacion === 'vendido';
          const isReserved = product.estado_publicacion === 'reservada';
          const isDisabled = isSold || isReserved || isInCart;
          
          return (
          <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col group relative">
            {/* Image & Badges */}
            <div className="relative h-64 overflow-hidden">
              <ImageGallery 
                images={product.imagenes_url || []} 
                alt={product.banda_artista} 
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-sabbath-950/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded border border-sabbath-700 uppercase tracking-wider text-sabbath-400">
                  {product.estado_conservacion}
                </span>
              </div>

              {product.autenticidad_ia && (
                <div className="absolute top-3 right-3">
                  <span className={`backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                    product.autenticidad_ia === 'Oficial' ? 'bg-green-950/80 border-green-700 text-green-400' :
                    product.autenticidad_ia === 'Bootleg' ? 'bg-orange-950/80 border-orange-700 text-orange-400' :
                    'bg-zinc-950/80 border-zinc-700 text-zinc-400'
                  }`}>
                    {product.autenticidad_ia === 'Bootleg' ? 'Bootleg Vintage' : product.autenticidad_ia}
                  </span>
                </div>
              )}

              {product.estado_publicacion === 'vendido' && (
                <div className="absolute inset-0 bg-sabbath-950/70 flex items-center justify-center backdrop-blur-[2px] z-10">
                  <div className="border-4 border-red-500/80 text-red-500/80 font-display text-4xl font-bold uppercase tracking-widest px-6 py-2 transform -rotate-12">
                    VENDIDO
                  </div>
                </div>
              )}
              {product.estado_publicacion === 'reservada' && (
                <div className="absolute inset-0 bg-sabbath-950/70 flex items-center justify-center backdrop-blur-[2px] z-10">
                  <div className="border-4 border-yellow-500/80 text-yellow-500/80 font-display text-3xl font-bold uppercase tracking-widest px-6 py-2 transform -rotate-12">
                    RESERVADO
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white leading-tight">{product.banda_artista}</h3>
                <span className="text-xl font-display font-bold text-sabbath-400">
                  Q{product.precio_final_aprobado}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
  {product.tipo_prenda} {product.talla ? `(Talla: ${product.talla})` : ''} • Origen: {product.origen_adquisicion}
</p>
              {product.descripcion_marketing && (
                <p className="text-zinc-300 text-sm mb-6 line-clamp-3 italic">
                  "{product.descripcion_marketing}"
                </p>
              )}
              
              <div className="mt-auto pt-4 border-t border-sabbath-800/50">
                <button
                  onClick={() => handleBuy(product)}
                  disabled={isDisabled}
                  className={`w-full py-3 px-4 rounded-md font-bold text-sm flex items-center justify-center space-x-2 transition-colors min-h-[48px] ${
                    isSold || isReserved
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : isInCart
                        ? 'bg-sabbath-800 text-zinc-400 cursor-not-allowed border border-sabbath-700'
                        : 'bg-sabbath-600 hover:bg-sabbath-500 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isSold ? 'Vendido' : isReserved ? 'Reservado' : isInCart ? 'En tu carrito' : 'Agregar al carrito'}</span>
                </button>
                {product.estado_publicacion !== 'vendido' && product.estado_publicacion !== 'reservada' && (
                  <p className="text-center text-xs text-zinc-500 mt-2">
                    Genera Q{product.precio_final_aprobado} para refugios
                  </p>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>
      
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className="p-2 bg-sabbath-900 border border-sabbath-800 rounded-md text-zinc-400 hover:text-white hover:border-sabbath-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-zinc-300 font-medium">
          Página {currentPage}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={!hasMore || isLoading}
          className="p-2 bg-sabbath-900 border border-sabbath-800 rounded-md text-zinc-400 hover:text-white hover:border-sabbath-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
          <p className="text-zinc-400 text-lg">No hay prendas que coincidan con estos filtros.</p>
        </div>
      )}
    </div>
  );
};