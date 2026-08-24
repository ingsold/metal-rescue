import React from 'react';
import { useApp } from '../context/AppContext';
import { HandHeart, Navigation } from 'lucide-react';

export const Transparency: React.FC = () => {
  const { deliveries } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-sabbath-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">TRANSPARENCIA E IMPACTO</h1>
          <p className="text-zinc-400">Evidencia de cada centavo convertido en ayuda animal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden shadow-lg shadow-sabbath-900/50">
            <div className="h-56 relative">
              <img src={delivery.foto_evidencia_url} alt={`Entrega a ${delivery.refugio_nombre}`} className="w-full h-full object-cover" />
              <div className="absolute top-0 right-0 bg-sabbath-600 text-white font-bold px-4 py-2 rounded-bl-xl shadow-md">
                Q{delivery.monto_donado_gtq}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2 text-sabbath-400 mb-3">
                <HandHeart className="w-5 h-5" />
                <h3 className="text-xl font-bold text-white">{delivery.refugio_nombre}</h3>
              </div>
              <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                "{delivery.descripcion_impacto}"
              </p>
              
              <div className="bg-sabbath-950 rounded-lg p-3 border border-sabbath-800/50 flex justify-between items-center text-sm">
                <span className="text-zinc-400">Total Entregado:</span>
                <span className="font-bold text-white bg-sabbath-800 px-3 py-1 rounded-md">{delivery.alimento_comprado_kg} kg de alimento</span>
              </div>
              
              <div className="mt-4 text-xs text-zinc-500 text-right">
                Fecha: {new Date(delivery.fecha_entrega).toLocaleDateString('es-GT')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
