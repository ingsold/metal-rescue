import re

with open('src/pages/AdminOrders.tsx', 'r') as f:
    content = f.read()

# Replace window.confirm for "Marcar como Lista"
old_lista = """                        onClick={async () => {
                          if(window.confirm('¿Confirmas que esta orden ha sido pagada y entregada? Las prendas se marcarán como VENDIDAS.')) {
                            try {
                              await updateOrderStatus(order.id, 'lista');
                              showToast('Orden marcada como completada.', 'success');
                            } catch (e: any) {
                              showToast(e.message || 'Error al actualizar orden', 'error');
                            }
                          }
                        }}"""

new_lista = """                        onClick={async () => {
                          try {
                            await updateOrderStatus(order.id, 'lista');
                            showToast('Orden marcada como completada.', 'success');
                          } catch (e: any) {
                            showToast(e.message || 'Error al actualizar orden', 'error');
                          }
                        }}"""

content = content.replace(old_lista, new_lista)

# Replace window.confirm for "Cancelar"
old_cancelada = """                        onClick={async () => {
                          if(window.confirm('¿Seguro que quieres cancelar esta orden? Las prendas volverán al catálogo.')) {
                            try {
                              await updateOrderStatus(order.id, 'cancelada');
                              showToast('Orden cancelada. Las prendas regresaron al catálogo.', 'info');
                            } catch (e: any) {
                              showToast(e.message || 'Error al cancelar orden', 'error');
                            }
                          }
                        }}"""

new_cancelada = """                        onClick={async () => {
                          try {
                            await updateOrderStatus(order.id, 'cancelada');
                            showToast('Orden cancelada. Las prendas regresaron al catálogo.', 'info');
                          } catch (e: any) {
                            showToast(e.message || 'Error al cancelar orden', 'error');
                          }
                        }}"""

content = content.replace(old_cancelada, new_cancelada)

with open('src/pages/AdminOrders.tsx', 'w') as f:
    f.write(content)
