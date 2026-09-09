import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Clock, CheckCircle2, ShieldCheck, Mail, MapPin, Phone, XCircle, Loader2 } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';

export const AdminOrders: React.FC = () => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [processingOrderId, setProcessingOrderId] = React.useState<string | null>(null);
  const { orders, fetchOrders, updateOrderStatus, allUsers, fetchAllUsers } = useApp();
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
    fetchAllUsers();
  }, []);

  const getBuyerInfo = (userId: string) => {
    return allUsers.find(u => u.id === userId);
  };

  return (
    <>
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            onClick={() => setSelectedImage(null)}
          >
            <XCircle className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Boleta Ampliada" 
            className="max-w-full max-h-full object-contain rounded" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
      <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-sabbath-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">ÓRDENES PENDIENTES</h1>
          <p className="text-zinc-400">Administra las prendas reservadas que están a la espera de pago y entrega.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
            <p className="text-zinc-400 text-lg">No hay órdenes registradas.</p>
          </div>
        ) : (
          orders.map(order => {
            const buyer = getBuyerInfo(order.userId);
            return (
              <div key={order.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 bg-sabbath-950/50 border-b border-sabbath-800 flex justify-between items-center">
                  <div className="text-xs font-mono text-zinc-500">ID: {order.id}</div>
                  <div>
                    {order.status === 'pendiente' ? (
                      <span className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 text-xs font-bold uppercase">
                        <Clock className="w-3 h-3" /> <span>Pendiente</span>
                      </span>
                    ) : order.status === 'verificando_pago' ? (
                      <span className="flex items-center space-x-1 text-blue-400 bg-blue-400/10 px-3 py-1 rounded border border-blue-400/20 text-xs font-bold uppercase">
                        <Clock className="w-3 h-3" /> <span>Pago Subido</span>
                      </span>
                    ) : order.status === 'cancelada' ? (
                      <span className="flex items-center space-x-1 text-red-400 bg-red-400/10 px-3 py-1 rounded border border-red-400/20 text-xs font-bold uppercase">
                        <XCircle className="w-3 h-3" /> <span>Cancelada</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-3 py-1 rounded border border-green-400/20 text-xs font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3" /> <span>Lista / Pagada</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Comprador</h3>
                    <div className="text-white font-bold text-lg">{order.userName}</div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                      <Mail className="w-4 h-4" /> {order.userEmail}
                    </div>
                    {buyer?.telefono && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                        <Phone className="w-4 h-4" /> {buyer.telefono}
                      </div>
                    )}
                    {buyer?.direccion && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                        <MapPin className="w-4 h-4" /> {buyer.direccion}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 flex justify-between items-end">
                      <span>Prendas ({order.items.length})</span>
                      <div className="text-right flex flex-col">
                        <span className="text-sabbath-400 block text-base">Recibido: Q{order.total}</span>
                        <span className="text-xs text-zinc-500 font-normal mt-1 normal-case">Gastos (5%): Q{(order.total * 0.05).toFixed(2)} | Donación (95%): Q{(order.total * 0.95).toFixed(2)}</span>
                      </div>
                    </h3>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex bg-sabbath-950 rounded-lg p-2 gap-3 items-center border border-sabbath-800/50">
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0"><ImageGallery images={item.imagenes_url || []} alt={item.banda_artista} thumbnail /></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white text-sm truncate uppercase">{item.banda_artista}</div>
                            <div className="text-xs text-zinc-500">{item.tipo_prenda}</div>
                          </div>
                          <div className="font-bold text-sabbath-400 text-sm">
                            Q{item.precio_final_aprobado}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.paymentReceiptUrl && (
                    <div className="mt-4 p-3 bg-sabbath-950 rounded border border-sabbath-800 flex items-start gap-3">
                      <img src={order.paymentReceiptUrl} alt="Boleta" className="w-12 h-12 object-cover rounded cursor-pointer border border-zinc-700" onClick={() => setSelectedImage(order.paymentReceiptUrl!)} />
                      <div>
                        <p className="text-xs text-zinc-400">Boleta de pago subida por el usuario.</p>
                        <button onClick={() => setSelectedImage(order.paymentReceiptUrl!)} className="text-xs text-sabbath-400 font-bold hover:underline mt-1">Ver completa</button>
                      </div>
                    </div>
                  )}
                  
                  {(order.status === 'pendiente' || order.status === 'verificando_pago') && (
                    <div className="mt-auto pt-4 border-t border-sabbath-800 flex flex-col gap-3">
                      <button
                        disabled={processingOrderId === order.id}
                        onClick={async () => {
                          setProcessingOrderId(order.id);
                          try {
                            await updateOrderStatus(order.id, 'lista');
                            showToast('Orden marcada como completada.', 'success');
                          } catch (e: any) {
                            showToast(e.message || 'Error al actualizar orden', 'error');
                          } finally {
                            setProcessingOrderId(null);
                          }
                        }}
                        className="w-full bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-sabbath-700 disabled:text-zinc-400 text-white py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        {processingOrderId === order.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        {processingOrderId === order.id ? 'Procesando...' : 'Marcar como Lista / Pagada'}
                      </button>
                      <button
                        disabled={processingOrderId === order.id}
                        onClick={async () => {
                          setProcessingOrderId(order.id);
                          try {
                            await updateOrderStatus(order.id, 'cancelada');
                            showToast('Orden cancelada. Las prendas regresaron al catálogo.', 'info');
                          } catch (e: any) {
                            showToast(e.message || 'Error al cancelar orden', 'error');
                          } finally {
                            setProcessingOrderId(null);
                          }
                        }}
                        className="w-full bg-sabbath-900 border border-sabbath-800 hover:bg-sabbath-800 hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 disabled:pointer-events-none text-zinc-400 py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        {processingOrderId === order.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                        {processingOrderId === order.id ? 'Procesando...' : 'Cancelar y Devolver al Catálogo'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    </>
  );
};
