with open('src/pages/Cart.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useApp } from '../context/AppContext';", "import { useApp } from '../context/AppContext';\nimport { useToast } from '../context/ToastContext';")
content = content.replace("const { cart, removeFromCart, createOrder, user } = useApp();", "const { cart, removeFromCart, createOrder, user } = useApp();\n  const { showToast } = useToast();")

content = content.replace("alert('Debes iniciar sesión para finalizar tu compra.');", "showToast('Debes iniciar sesión para finalizar tu compra.', 'error');")
content = content.replace("alert('Hubo un error procesando tu orden.');", "showToast('Hubo un error procesando tu orden.', 'error');")

with open('src/pages/Cart.tsx', 'w') as f:
    f.write(content)
