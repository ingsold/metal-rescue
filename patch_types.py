import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "export type OrderStatus = 'pendiente' | 'lista' | 'cancelada';",
    "export type OrderStatus = 'pendiente' | 'verificando_pago' | 'lista' | 'cancelada';"
)

old_order = """export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: Product[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}"""

new_order = """export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: Product[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentReceiptUrl?: string;
}"""

content = content.replace(old_order, new_order)

with open('src/types.ts', 'w') as f:
    f.write(content)
