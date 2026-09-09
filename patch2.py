import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# Add OrderStatus to imports
content = content.replace("import { User, Product, ShelterDelivery, Ally, AppNotification, Event, Order } from '../types';", "import { User, Product, ShelterDelivery, Ally, AppNotification, Event, Order, OrderStatus } from '../types';")

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

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)
