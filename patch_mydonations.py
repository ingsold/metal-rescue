import re

with open('src/pages/MyDonations.tsx', 'r') as f:
    content = f.read()

old_block = """                <div className="mt-auto space-y-3">
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
                </div>"""

new_block = """                <div className="mt-auto space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Donada el:</span>
                    <span className="text-zinc-300">{new Date(product.fecha_donacion).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="bg-sabbath-950/50 p-3 rounded-lg border border-sabbath-800 space-y-2 mt-3">
                    <div className="flex justify-between text-xs sm:text-sm items-center">
                      <span className="text-zinc-400">Tu precio estimado:</span>
                      <span className="text-zinc-300">Q{product.precio_estimado_donante}</span>
                    </div>
                    
                    {product.precio_sugerido_ia ? (
                      <div className="flex justify-between text-xs sm:text-sm items-center">
                        <span className="text-blue-400/80">Tasación IA:</span>
                        <span className="text-blue-400/80">Q{product.precio_sugerido_ia}</span>
                      </div>
                    ) : null}
                    
                    {product.precio_final_aprobado ? (
                      <div className="flex justify-between items-center border-t border-sabbath-800/50 pt-2 mt-2">
                        <span className={`text-xs sm:text-sm ${product.estado_publicacion === 'vendido' ? 'text-green-400 font-bold' : 'text-zinc-300 font-medium'}`}>
                          {product.estado_publicacion === 'vendido' ? 'Vendida por:' : 'Precio de venta:'}
                        </span>
                        <span className={`font-bold ${product.estado_publicacion === 'vendido' ? 'text-green-400' : 'text-white'} text-base sm:text-lg`}>
                          Q{product.precio_final_aprobado}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>"""

content = content.replace(old_block, new_block)

with open('src/pages/MyDonations.tsx', 'w') as f:
    f.write(content)
