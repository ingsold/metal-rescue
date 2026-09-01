import re

with open('src/pages/Transparency.tsx', 'r') as f:
    content = f.read()

new_content = """import React from 'react';
import { useApp } from '../context/AppContext';
import { HandHeart, Navigation, Phone, Mail, Building2 } from 'lucide-react';

export const Transparency: React.FC = () => {
  const { deliveries } = useApp();

  const aliados = [
    {
      id: 1,
      nombre: "Unidad de Bienestar Animal de la MuniGuate",
      telefono: "4479 7830",
      email: "bienestaranimal@muniguate.com",
      descripcion: "Entidad municipal dedicada a la protección, rescate y bienestar de los animales en la Ciudad de Guatemala.",
      imagen: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="border-b border-sabbath-800 pb-4">
        <h1 className="text-3xl font-display font-bold text-white mb-2">TRANSPARENCIA E IMPACTO</h1>
        <p className="text-zinc-400">Conoce a quiénes ayudamos y la evidencia de cada centavo convertido en ayuda animal.</p>
      </div>

      {/* Aliados Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-6 h-6 text-sabbath-400" />
          <h2 className="text-2xl font-bold text-white">Entidades Apoyadas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aliados.map((aliado) => (
            <div key={aliado.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="h-48 relative overflow-hidden bg-zinc-800">
                <img src={aliado.imagen} alt={aliado.nombre} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-sabbath-900 to-transparent"></div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col relative -mt-12">
                <div className="bg-sabbath-950 border border-sabbath-800 rounded-xl p-4 shadow-xl z-10 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">{aliado.nombre}</h3>
                  <p className="text-sm text-zinc-400 mb-6 flex-1">{aliado.descripcion}</p>
                  
                  <div className="space-y-3 mt-auto">
                    <a href={`tel:${aliado.telefono}`} className="flex items-center gap-3 text-sm text-zinc-300 hover:text-sabbath-400 transition-colors">
                      <div className="bg-sabbath-900 p-2 rounded-lg">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{aliado.telefono}</span>
                    </a>
                    
                    <a href={`mailto:${aliado.email}`} className="flex items-center gap-3 text-sm text-zinc-300 hover:text-sabbath-400 transition-colors break-all">
                      <div className="bg-sabbath-900 p-2 rounded-lg">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{aliado.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Entregas Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <HandHeart className="w-6 h-6 text-sabbath-400" />
          <h2 className="text-2xl font-bold text-white">Registro de Entregas</h2>
        </div>
        
        {deliveries.length === 0 ? (
          <div className="bg-sabbath-900/50 border border-sabbath-800 border-dashed rounded-xl p-12 text-center text-zinc-500">
            Aún no hay entregas registradas en el sistema.
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
};
"""

with open('src/pages/Transparency.tsx', 'w') as f:
    f.write(new_content)
