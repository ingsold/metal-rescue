import re

with open('src/pages/Catalog.tsx', 'r') as f:
    content = f.read()

old_button = """                <button
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
                </button>"""

new_button = """                <button
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
                </button>"""

content = content.replace(old_button, new_button)

old_end = """              </div>
            </div>
          </div>
        ))}"""

new_end = """              </div>
            </div>
          </div>
          );
        })}"""

content = content.replace(old_end, new_end)

with open('src/pages/Catalog.tsx', 'w') as f:
    f.write(content)
