import re

with open('src/pages/Catalog.tsx', 'r') as f:
    content = f.read()

# Replace the map start
old_map_start = """        {currentProducts.map((product) => (
          <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col group relative">"""

new_map_start = """        {currentProducts.map((product) => {
          const isInCart = cart.some(p => p.id === product.id);
          const isSold = product.estado_publicacion === 'vendido';
          const isReserved = product.estado_publicacion === 'reservada';
          const isDisabled = isSold || isReserved || isInCart;
          
          return (
          <div key={product.id} className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden flex flex-col group relative">"""

content = content.replace(old_map_start, new_map_start)

# Replace the map end
# This might be tricky. Let's find the end of the map.
# It ends with:
#                 </button>
#               </div>
#             </div>
#           </div>
#         ))}
# Let's replace the button and the end.
old_button_end = """              <div className="mt-auto pt-4 border-t border-sabbath-800/50">
                <button
                  onClick={() => handleBuy(product)}
                  disabled={product.estado_publicacion === 'vendido' || product.estado_publicacion === 'reservada'}
                  className={`w-full py-3 px-4 rounded-md font-bold text-sm flex items-center justify-center space-x-2 transition-colors min-h-[48px] ${
                    product.estado_publicacion === 'vendido' || product.estado_publicacion === 'reservada'
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-sabbath-600 hover:bg-sabbath-500 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.estado_publicacion === 'vendido' ? 'Vendido' : product.estado_publicacion === 'reservada' ? 'Reservado' : 'Agregar al carrito'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}"""

new_button_end = """              <div className="mt-auto pt-4 border-t border-sabbath-800/50">
                <button
                  onClick={() => handleBuy(product)}
                  disabled={isDisabled}
                  className={`w-full py-3 px-4 rounded-md font-bold text-sm flex items-center justify-center space-x-2 transition-colors min-h-[48px] ${
                    isSold || isReserved
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : isInCart
                        ? 'bg-sabbath-800 text-zinc-400 cursor-not-allowed border border-sabbath-700'
                        : 'bg-sabbath-600 hover:bg-sabbath-500 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isSold ? 'Vendido' : isReserved ? 'Reservado' : isInCart ? 'En tu carrito' : 'Agregar al carrito'}</span>
                </button>
              </div>
            </div>
          </div>
          );
        })}"""

content = content.replace(old_button_end, new_button_end)

with open('src/pages/Catalog.tsx', 'w') as f:
    f.write(content)
