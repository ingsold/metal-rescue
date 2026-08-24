import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2, ShieldCheck, HeartHandshake, Trash2 } from 'lucide-react';

export const MyDonations: React.FC = () => {
  const { products, user, deleteProduct } = useApp();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const userProducts = products.filter(p => p.usuario_donante_id === user?.id);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'borrador_pendiente':
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-sabbath-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">MIS DONACIONES</h1>
          <p className="text-zinc-400">El historial de tu aporte a la causa. ¡Gracias por el apoyo!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProducts.map((product) => (
          <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img src={product.imagen_url} alt={product.banda_artista} className="w-full h-full object-cover opacity-80" />
              <div className="absolute top-3 right-3">
                {getStatusBadge(product.estado_publicacion)}
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
              <p className="text-zinc-400 text-sm mb-4">
  {product.tipo_prenda} {product.talla ? `• Talla: ${product.talla}` : ''}
</p>
              
              <div className="space-y-3 bg-sabbath-950/50 p-4 rounded-lg border border-sabbath-800/50 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Tu Estimación:</span>
                  <span className="font-medium text-white">Q{product.precio_estimado_donante}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-sabbath-800/50 pt-3">
                  <span className="text-zinc-400 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-sabbath-500" /> Sugerencia IA:</span>
                  <span className="font-medium text-sabbath-400">Q{product.precio_sugerido_ia}</span>
                </div>
                {product.precio_final_aprobado && (
                  <div className="flex justify-between items-center text-sm border-t border-sabbath-800/50 pt-3">
                    <span className="text-zinc-300 font-medium">Precio Final:</span>
                    <span className="font-bold text-white text-lg">Q{product.precio_final_aprobado}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {userProducts.length === 0 && (
          <div className="col-span-full text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
            <p className="text-zinc-400 text-lg">Aún no has realizado ninguna donación.</p>
          </div>
        )}
      </div>
    </div>
  );
};
