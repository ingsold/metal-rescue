import re

with open('src/pages/AdminOrders.tsx', 'r') as f:
    content = f.read()

# 1. Add Loader2 import
content = content.replace(
    "import { Clock, CheckCircle2, ShieldCheck, Mail, MapPin, Phone, XCircle } from 'lucide-react';",
    "import { Clock, CheckCircle2, ShieldCheck, Mail, MapPin, Phone, XCircle, Loader2 } from 'lucide-react';"
)

# 2. Add state for loading
content = content.replace(
    "const [selectedImage, setSelectedImage] = React.useState<string | null>(null);",
    "const [selectedImage, setSelectedImage] = React.useState<string | null>(null);\n  const [processingOrderId, setProcessingOrderId] = React.useState<string | null>(null);"
)

# 3. Update 'Marcar como Lista' button
old_btn_lista = """                      <button
                        onClick={async () => {
                          try {
                            await updateOrderStatus(order.id, 'lista');
                            showToast('Orden marcada como completada.', 'success');
                          } catch (e: any) {
                            showToast(e.message || 'Error al actualizar orden', 'error');
                          }
                        }}
                        className="w-full bg-sabbath-600 hover:bg-sabbath-500 text-white py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Marcar como Lista / Pagada
                      </button>"""

new_btn_lista = """                      <button
                        disabled={processingOrderId === order.id}
                        onClick={async () => {
                          setProcessingOrderId(order.id);
                          try {
                            await updateOrderStatus(order.id, 'lista');
                            showToast('Orden marcada como completada.', 'success');
                          } catch (e: any) {
                            showToast(e.message || 'Error al actualizar orden', 'error');
                          } finally {
                            setProcessingOrderId(null);
                          }
                        }}
                        className="w-full bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-sabbath-700 disabled:text-zinc-400 text-white py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        {processingOrderId === order.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        {processingOrderId === order.id ? 'Procesando...' : 'Marcar como Lista / Pagada'}
                      </button>"""
content = content.replace(old_btn_lista, new_btn_lista)

# 4. Update 'Cancelar' button
old_btn_cancel = """                      <button
                        onClick={async () => {
                          try {
                            await updateOrderStatus(order.id, 'cancelada');
                            showToast('Orden cancelada. Las prendas regresaron al catálogo.', 'info');
                          } catch (e: any) {
                            showToast(e.message || 'Error al cancelar orden', 'error');
                          }
                        }}
                        className="w-full bg-sabbath-900 border border-sabbath-800 hover:bg-sabbath-800 hover:border-red-500/50 hover:text-red-400 text-zinc-400 py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Cancelar y Devolver al Catálogo
                      </button>"""

new_btn_cancel = """                      <button
                        disabled={processingOrderId === order.id}
                        onClick={async () => {
                          setProcessingOrderId(order.id);
                          try {
                            await updateOrderStatus(order.id, 'cancelada');
                            showToast('Orden cancelada. Las prendas regresaron al catálogo.', 'info');
                          } catch (e: any) {
                            showToast(e.message || 'Error al cancelar orden', 'error');
                          } finally {
                            setProcessingOrderId(null);
                          }
                        }}
                        className="w-full bg-sabbath-900 border border-sabbath-800 hover:bg-sabbath-800 hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 disabled:pointer-events-none text-zinc-400 py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        {processingOrderId === order.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                        {processingOrderId === order.id ? 'Procesando...' : 'Cancelar y Devolver al Catálogo'}
                      </button>"""
content = content.replace(old_btn_cancel, new_btn_cancel)

with open('src/pages/AdminOrders.tsx', 'w') as f:
    f.write(content)
