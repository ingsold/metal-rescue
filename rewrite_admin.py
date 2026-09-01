with open('src/pages/AdminPanel.tsx', 'r') as f:
    content = f.read()

# I will provide a known good version of the map loop
map_loop = """
        {currentProducts.map((product) => {
          const editState = getEditState(product.id, product.precio_sugerido_ia || 0, product.descripcion_marketing);
          return (
            <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
              <div className="lg:w-1/3 bg-sabbath-950 p-6 flex items-center justify-center">
                <img 
                  src={product.imagen_url} 
                  alt={product.banda_artista} 
                  className="max-h-64 object-contain rounded-md"
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
                        onChange={(e) => handleEditChange(product.id, 'price', Number(e.target.value))}
                        className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-3 py-2 text-white text-lg font-bold focus:border-sabbath-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Descripción Marketing
                      </label>
                      <input 
                        type="text"
                        value={editState.desc}
                        onChange={(e) => handleEditChange(product.id, 'desc', e.target.value)}
                        className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-3 py-2 text-zinc-300 focus:border-sabbath-500 focus:outline-none"
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
"""

content = content.replace('{currentProducts.map((product) => { return null; })}', map_loop)

with open('src/pages/AdminPanel.tsx', 'w') as f:
    f.write(content)
