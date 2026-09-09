import re

with open('src/pages/AdminOrders.tsx', 'r') as f:
    content = f.read()

# Replace status badge
old_badge = """                    {order.status === 'pendiente' ? (
                      <span className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 text-xs font-bold uppercase">
                        <Clock className="w-3 h-3" /> <span>Pendiente</span>
                      </span>
                    ) : order.status === 'cancelada' ? ("""

new_badge = """                    {order.status === 'pendiente' ? (
                      <span className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 text-xs font-bold uppercase">
                        <Clock className="w-3 h-3" /> <span>Pendiente</span>
                      </span>
                    ) : order.status === 'verificando_pago' ? (
                      <span className="flex items-center space-x-1 text-blue-400 bg-blue-400/10 px-3 py-1 rounded border border-blue-400/20 text-xs font-bold uppercase">
                        <Clock className="w-3 h-3" /> <span>Pago Subido</span>
                      </span>
                    ) : order.status === 'cancelada' ? ("""

content = content.replace(old_badge, new_badge)


# Replace buttons
old_buttons = """                  {order.status === 'pendiente' && (
                    <div className="mt-auto pt-4 border-t border-sabbath-800 flex flex-col gap-3">
                      <button"""

new_buttons = """                  {order.paymentReceiptUrl && (
                    <div className="mt-4 p-3 bg-sabbath-950 rounded border border-sabbath-800 flex items-start gap-3">
                      <img src={order.paymentReceiptUrl} alt="Boleta" className="w-12 h-12 object-cover rounded cursor-pointer border border-zinc-700" onClick={() => window.open(order.paymentReceiptUrl, '_blank')} />
                      <div>
                        <p className="text-xs text-zinc-400">Boleta de pago subida por el usuario.</p>
                        <button onClick={() => window.open(order.paymentReceiptUrl, '_blank')} className="text-xs text-sabbath-400 font-bold hover:underline mt-1">Ver completa</button>
                      </div>
                    </div>
                  )}
                  
                  {(order.status === 'pendiente' || order.status === 'verificando_pago') && (
                    <div className="mt-auto pt-4 border-t border-sabbath-800 flex flex-col gap-3">
                      <button"""

content = content.replace(old_buttons, new_buttons)

with open('src/pages/AdminOrders.tsx', 'w') as f:
    f.write(content)
