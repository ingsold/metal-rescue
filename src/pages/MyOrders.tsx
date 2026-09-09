import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Upload, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Order } from '../types';

export const MyOrders: React.FC = () => {
  const { user, fetchOrders, orders, submitPaymentReceipt } = useApp();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{ [orderId: string]: File | null }>({});

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleFileChange = (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(prev => ({ ...prev, [orderId]: e.target.files![0] }));
    }
  };

  const uploadReceipt = async (orderId: string) => {
    const file = imageFile[orderId];
    if (!file) return;

    setLoadingOrderId(orderId);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // In a real app we'd upload the file to Firebase Storage. 
      // For this prototype, we'll convert it to object URL or base64.
      // But since we want persistence, let's use base64 for simplicity, or we can use fake URL if storage is not set up.
      // Better to use FileReader to get Data URL.
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await submitPaymentReceipt(orderId, base64String);
          setSuccessMsg('Boleta subida correctamente. Espera nuestra validación.');
          setImageFile(prev => ({ ...prev, [orderId]: null }));
        } catch (e: any) {
          setErrorMsg(e.message || 'Error al actualizar orden');
        } finally {
          setLoadingOrderId(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (e: any) {
      setErrorMsg(e.message || 'Error al procesar archivo');
      setLoadingOrderId(null);
    }
  };

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!user) return null;

  const myOrders = orders.filter(o => o.userId === user.id);

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
      <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-sabbath-400" />
          Mis Órdenes
        </h1>
        <p className="text-zinc-400">Administra y da seguimiento a tus compras.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
          {successMsg}
        </div>
      )}

      {myOrders.length === 0 ? (
        <div className="bg-sabbath-900/50 border border-sabbath-800 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-sabbath-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No tienes órdenes</h2>
          <p className="text-zinc-400">Aún no has realizado ninguna orden en Metal Rescue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => (
            <div key={order.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-sabbath-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-sabbath-900/50">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Orden #{order.id}</p>
                  <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-zinc-400">Total a Pagar</p>
                    <p className="text-xl font-bold text-sabbath-400">Q{order.total}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1
                    ${order.status === 'pendiente' ? 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50' : 
                      order.status === 'verificando_pago' ? 'bg-blue-900/50 text-blue-400 border-blue-500/50' :
                      order.status === 'lista' ? 'bg-green-900/50 text-green-400 border-green-500/50' : 
                      'bg-red-900/50 text-red-400 border-red-500/50'}`}>
                    {order.status === 'pendiente' && <Clock className="w-3 h-3" />}
                    {order.status === 'verificando_pago' && <Clock className="w-3 h-3" />}
                    {order.status === 'lista' && <CheckCircle className="w-3 h-3" />}
                    {order.status === 'cancelada' && <XCircle className="w-3 h-3" />}
                    {order.status === 'pendiente' ? 'Pendiente de Pago' : 
                     order.status === 'verificando_pago' ? 'Verificando Pago' :
                     order.status === 'lista' ? 'Pagada / Lista' : 'Cancelada'}
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-white mb-4">Artículos ({order.items.length})</h3>
                <div className="space-y-3 mb-6">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-sabbath-800/50 last:border-0">
                      <div className="flex items-center gap-3">
                        {item.imagenes_url && item.imagenes_url.length > 0 && (
                          <img src={item.imagenes_url[0]} alt={item.banda_artista} className="w-10 h-10 object-cover rounded bg-sabbath-950" />
                        )}
                        <div>
                          <p className="font-medium text-white">{item.banda_artista}</p>
                          <p className="text-xs text-zinc-400">{item.tipo_prenda}</p>
                        </div>
                      </div>
                      <p className="font-bold text-zinc-300">Q{item.precio_final_aprobado}</p>
                    </div>
                  ))}
                </div>

                {order.status === 'pendiente' && (
                  <div className="bg-sabbath-950/50 p-4 rounded-lg border border-sabbath-800">
                    <h4 className="font-bold text-white mb-2 text-sm">Subir Comprobante de Pago</h4>
                    <p className="text-xs text-zinc-400 mb-4">
                      Por favor realiza una transferencia de Q{order.total} y sube la foto o captura de pantalla de la boleta para proceder con tu orden.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(order.id, e)}
                        className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sabbath-800 file:text-white hover:file:bg-sabbath-700"
                      />
                      <button 
                        onClick={() => uploadReceipt(order.id)}
                        disabled={!imageFile[order.id] || loadingOrderId === order.id}
                        className="whitespace-nowrap px-4 py-2 bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded font-bold text-sm transition-colors flex items-center gap-2"
                      >
                        {loadingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {loadingOrderId === order.id ? 'Subiendo...' : 'Enviar Boleta'}
                      </button>
                    </div>
                  </div>
                )}
                
                {order.status === 'verificando_pago' && order.paymentReceiptUrl && (
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50 flex items-start gap-4">
                    <img src={order.paymentReceiptUrl} alt="Boleta" className="w-16 h-16 object-cover rounded border border-sabbath-800 cursor-pointer" onClick={() => setSelectedImage(order.paymentReceiptUrl!)} />
                    <div>
                      <h4 className="font-bold text-blue-400 text-sm mb-1">Boleta en revisión</h4>
                      <p className="text-xs text-zinc-400">Tu pago está siendo verificado. Te notificaremos cuando la orden esté lista.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};
