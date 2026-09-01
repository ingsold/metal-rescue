import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "updateOrderStatus: (orderId: string, status: 'lista') => Promise<void>;",
    "updateOrderStatus: (orderId: string, status: 'lista' | 'cancelada') => Promise<void>;"
)

old_impl = """  const updateOrderStatus = async (orderId: string, status: 'lista') => {
    if (user?.role !== 'administrador') return;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      
      // If the status is 'lista', we mark products as 'vendido'
      if (status === 'lista') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          for (const item of order.items) {
            await updateProductStatus(item.id, 'vendido', item.precio_final_aprobado);
          }
        }
      }
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error("Update order status failed", error);
    }
  };"""

new_impl = """  const updateOrderStatus = async (orderId: string, status: 'lista' | 'cancelada') => {
    if (user?.role !== 'administrador') {
      throw new Error('No tienes permisos de administrador.');
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      
      const order = orders.find(o => o.id === orderId);
      if (order) {
        if (status === 'lista') {
          for (const item of order.items) {
            await updateProductStatus(item.id, 'vendido', item.precio_final_aprobado);
          }
        } else if (status === 'cancelada') {
          for (const item of order.items) {
            await updateProductStatus(item.id, 'aprobado_publicado');
          }
        }
      }
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error: any) {
      console.error("Update order status failed", error);
      throw error;
    }
  };"""

content = content.replace(old_impl, new_impl)

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)
