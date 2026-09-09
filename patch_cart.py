import re

with open('src/pages/Cart.tsx', 'r') as f:
    content = f.read()

# 1. Add updateProfile to useApp destructuring
content = content.replace(
    "const { cart, removeFromCart, createOrder, user } = useApp();",
    "const { cart, removeFromCart, createOrder, user, updateProfile } = useApp();"
)

# 2. Add local state for address
content = content.replace(
    "const [orderComplete, setOrderComplete] = useState(false);",
    "const [orderComplete, setOrderComplete] = useState(false);\n  const [direccion, setDireccion] = useState(user?.direccion || '');"
)

# 3. Handle checkout logic
old_handle_checkout = """  const handleCheckout = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para finalizar tu compra.', 'error');
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    try {
      await createOrder(user.id, user.email, `${user.name} ${user.lastName || ''}`.trim());"""

new_handle_checkout = """  const handleCheckout = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para finalizar tu compra.', 'error');
      navigate('/login');
      return;
    }
    
    if (!direccion.trim()) {
      showToast('Por favor, ingresa una dirección de envío o entrega.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      if (direccion !== user.direccion) {
        await updateProfile({
          name: user.name,
          lastName: user.lastName || '',
          username: user.username || '',
          direccion: direccion,
          telefono: user.telefono || ''
        });
      }
      await createOrder(user.id, user.email, `${user.name} ${user.lastName || ''}`.trim());"""

content = content.replace(old_handle_checkout, new_handle_checkout)

# 4. Add the address field in the UI
old_ui_summary = """              <h3 className="text-xl font-bold text-white mb-4 border-b border-sabbath-800 pb-4">Resumen de Orden</h3>"""

new_ui_summary = """              <h3 className="text-xl font-bold text-white mb-4 border-b border-sabbath-800 pb-4">Resumen de Orden</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-300 mb-2">Dirección de Envío/Entrega</label>
                <textarea
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej. Ciudad de Guatemala, Zona 1..."
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-sabbath-500 resize-none h-20"
                />
              </div>"""

content = content.replace(old_ui_summary, new_ui_summary)

with open('src/pages/Cart.tsx', 'w') as f:
    f.write(content)

