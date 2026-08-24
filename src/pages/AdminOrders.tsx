import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, fetchOrders, updateOrderStatus, allUsers, fetchAllUsers } = useApp();

  useEffect(() => {
    fetchOrders();
    fetchAllUsers();
  }, []);

  const getBuyerInfo = (userId: string) => {
    return allUsers.find(u => u.id === userId);
  };

  return (
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
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Prendas ({order.items.length})</span>
                      <span className="text-sabbath-400">Total: Q{order.total}</span>
                    </h3>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex bg-sabbath-950 rounded-lg p-2 gap-3 items-center border border-sabbath-800/50">
                          <img src={item.imagen_url} alt={item.banda_artista} className="w-12 h-12 object-cover rounded" />
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

                  {order.status === 'pendiente' && (
                    <div className="mt-auto pt-4 border-t border-sabbath-800">
                      <button
                        onClick={() => {
                          if(window.confirm('¿Confirmas que esta orden ha sido pagada y entregada? Las prendas se marcarán como VENDIDAS.')) {
                            updateOrderStatus(order.id, 'lista');
                          }
                        }}
                        className="w-full bg-sabbath-600 hover:bg-sabbath-500 text-white py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Marcar como Lista / Pagada
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
  );
};
