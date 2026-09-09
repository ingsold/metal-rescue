import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# Update interface
content = content.replace(
    "updateOrderStatus: (orderId: string, status: 'lista' | 'cancelada') => Promise<void>;",
    "updateOrderStatus: (orderId: string, status: OrderStatus, paymentReceiptUrl?: string) => Promise<void>;\n  submitPaymentReceipt: (orderId: string, receiptUrl: string) => Promise<void>;"
)

# Replace updateOrderStatus function
old_update = """  const updateOrderStatus = async (orderId: string, status: 'lista' | 'cancelada') => {
    if (user?.role !== 'administrador') {
      throw new Error('No tienes permisos de administrador.');
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      console.error("Error al actualizar orden:", error);
      throw error;
    }
  };"""

new_update = """  const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentReceiptUrl?: string) => {
    if (user?.role !== 'administrador') {
      throw new Error('No tienes permisos de administrador.');
    }
    try {
      const updateData: any = { status };
      if (paymentReceiptUrl) {
        updateData.paymentReceiptUrl = paymentReceiptUrl;
      }
      await updateDoc(doc(db, 'orders', orderId), updateData);
    } catch (error) {
      console.error("Error al actualizar orden:", error);
      throw error;
    }
  };

  const submitPaymentReceipt = async (orderId: string, receiptUrl: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión');
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status: 'verificando_pago',
        paymentReceiptUrl: receiptUrl
      });
    } catch (error) {
      console.error("Error al subir boleta:", error);
      throw error;
    }
  };"""

content = content.replace(old_update, new_update)

# Add to provider value
content = content.replace(
    "addToCart, removeFromCart, clearCart, createOrder, fetchOrders, updateOrderStatus,",
    "addToCart, removeFromCart, clearCart, createOrder, fetchOrders, updateOrderStatus, submitPaymentReceipt,"
)

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

