import re

with open('src/pages/Transparency.tsx', 'r') as f:
    content = f.read()

# We need to extract the delivery card into a separate component so it can use state
components_code = """
const DeliveryCard: React.FC<{ delivery: any }> = ({ delivery }) => {
  const [activeImg, setActiveImg] = React.useState(0);
  
  // Normalize images: always have an array
  const images = delivery.galeria_urls && delivery.galeria_urls.length > 0 
    ? delivery.galeria_urls 
    : [delivery.foto_evidencia_url];

  return (
    <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden shadow-lg shadow-sabbath-900/50 flex flex-col">
      <div className="h-56 relative group">
        <img src={images[activeImg]} alt={`Entrega a ${delivery.refugio_nombre}`} className="w-full h-full object-cover transition-opacity duration-300" />
        
        <div className="absolute top-0 right-0 bg-sabbath-600 text-white font-bold px-4 py-2 rounded-bl-xl shadow-md z-10">
          Q{delivery.monto_donado_gtq}
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ←
            </button>
            <button 
              onClick={() => setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              →
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_: any, idx: number) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-colors ${idx === activeImg ? 'bg-sabbath-400' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-2 text-sabbath-400 mb-3">
          <HandHeart className="w-5 h-5 flex-shrink-0" />
          <h3 className="text-xl font-bold text-white line-clamp-1">{delivery.refugio_nombre}</h3>
        </div>
        <p className="text-zinc-300 text-sm mb-4 leading-relaxed flex-1">
          "{delivery.descripcion_impacto}"
        </p>
        
        <div className="bg-sabbath-950 rounded-lg p-3 border border-sabbath-800/50 flex justify-between items-center text-sm mb-4">
          <span className="text-zinc-400">Total Entregado:</span>
          <span className="font-bold text-white bg-sabbath-800 px-3 py-1 rounded-md">{delivery.alimento_comprado_kg} kg de alimento</span>
        </div>
        
        <div className="text-xs text-zinc-500 text-right">
          Fecha: {new Date(delivery.fecha_entrega).toLocaleDateString('es-GT')}
        </div>
      </div>
    </div>
  );
};
"""

# Replace React import to include useState if not there
if "useState" not in content:
    content = content.replace("import React from 'react';", "import React, { useState } from 'react';")

# Add the component before Transparency
content = content.replace("export const Transparency: React.FC = () => {", components_code + "\nexport const Transparency: React.FC = () => {")

# Mock delivery inject
mock_injection = """  const { deliveries } = useApp();

  // MOCK DATA PARA VISUALIZACION
  const displayDeliveries = deliveries.length > 0 ? deliveries : [
    {
      id: "mock_1",
      refugio_nombre: "Refugio Patitas Desamparadas",
      monto_donado_gtq: 3500,
      alimento_comprado_kg: 250,
      foto_evidencia_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
      galeria_urls: [
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800"
      ],
      fecha_entrega: new Date().toISOString(),
      descripcion_impacto: "Gracias a los fondos recaudados en el toque de septiembre, pudimos donar 250kg de alimento balanceado, medicinas y material de limpieza para más de 40 perritos rescatados. ¡El metal salva vidas!"
    }
  ];"""
content = content.replace("  const { deliveries } = useApp();", mock_injection)

# Replace the delivery mapping logic
mapping_old = """        {deliveries.length === 0 ? (
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
        )}"""

mapping_new = """        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDeliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>"""

content = content.replace(mapping_old, mapping_new)

with open('src/pages/Transparency.tsx', 'w') as f:
    f.write(content)
