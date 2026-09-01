import re

with open('src/pages/MyDonations.tsx', 'r') as f:
    content = f.read()

# Let's fix the syntax error or missing div.
# I'll just write it by replacing the entire render block

render_block = """  return (
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
                <img src={product.imagen_url} alt={product.banda_artista} className="w-full h-full object-cover opacity-80" />
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
        </div>
      )}
    </div>
  );
};"""

content = re.sub(r"  return \(\s*<div className=\"space-y-8\">.*", render_block, content, flags=re.DOTALL)

with open('src/pages/MyDonations.tsx', 'w') as f:
    f.write(content)
