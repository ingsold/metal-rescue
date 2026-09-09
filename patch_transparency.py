import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<h3 className="text-xl font-bold text-white mb-3">3. 100% para Refugios</h3>',
    '<h3 className="text-xl font-bold text-white mb-3">3. 95% para Refugios</h3>'
)
content = content.replace(
    '<p className="text-zinc-400">Las prendas se venden en el catálogo y los fondos se convierten en alimento y medicina para albergues animales.</p>',
    '<p className="text-zinc-400">Las prendas se venden en el catálogo. El 95% de los fondos se convierte en alimento y medicina, y el 5% financia gastos de funcionamiento.</p>'
)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

old_str = """                placeholder="¿Cuánto crees que vale? (Q)"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>"""

new_str = """                placeholder="¿Cuánto crees que vale? (Q)"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
              <p className="text-xs text-zinc-500 mt-2">Nota de transparencia: Al venderse esta prenda, se deducirá un 5% del precio final para cubrir gastos de funcionamiento. El 95% íntegro será destinado a los refugios.</p>
            </div>"""

content = content.replace(old_str, new_str)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Cart.tsx', 'r') as f:
    content = f.read()

old_str = """              <h3 className="text-xl font-bold text-white mb-4 border-b border-sabbath-800 pb-4">Resumen de Orden</h3>
              <div className="flex justify-between items-center mb-6 text-lg">
                <span className="text-zinc-400">Total a donar:</span>
                <span className="font-display font-bold text-2xl text-sabbath-400">Q{total}</span>
              </div>"""

new_str = """              <h3 className="text-xl font-bold text-white mb-4 border-b border-sabbath-800 pb-4">Resumen de Orden</h3>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Donación a Refugios (95%):</span>
                  <span>Q{(total * 0.95).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Gastos de funcionamiento (5%):</span>
                  <span>Q{(total * 0.05).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6 text-lg border-t border-sabbath-800 pt-4">
                <span className="text-zinc-300 font-bold">Total a transferir:</span>
                <span className="font-display font-bold text-2xl text-sabbath-400">Q{total}</span>
              </div>"""

content = content.replace(old_str, new_str)

with open('src/pages/Cart.tsx', 'w') as f:
    f.write(content)

with open('src/pages/AdminOrders.tsx', 'r') as f:
    content = f.read()

old_str = """                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Prendas ({order.items.length})</span>
                      <span className="text-sabbath-400">Total: Q{order.total}</span>
                    </h3>"""

new_str = """                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 flex justify-between items-end">
                      <span>Prendas ({order.items.length})</span>
                      <div className="text-right flex flex-col">
                        <span className="text-sabbath-400 block text-base">Recibido: Q{order.total}</span>
                        <span className="text-xs text-zinc-500 font-normal mt-1 normal-case">Gastos (5%): Q{(order.total * 0.05).toFixed(2)} | Donación (95%): Q{(order.total * 0.95).toFixed(2)}</span>
                      </div>
                    </h3>"""

content = content.replace(old_str, new_str)

with open('src/pages/AdminOrders.tsx', 'w') as f:
    f.write(content)

