import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# Remove from AppState interface
content = re.sub(r"^\s*products:\s*Product\[\];\s*\n?", "", content, flags=re.MULTILINE)

# Remove the state variable
content = re.sub(r"^\s*const \[products, setProducts\] = useState<Product\[\]>\(\[\]\);\s*\n?", "", content, flags=re.MULTILINE)

# Remove the products listener
listener_start = content.find("// Products Listener (Separated by role for Security Rules)")
listener_end = content.find("// Deliveries Listener")

if listener_start != -1 and listener_end != -1:
    content = content[:listener_start] + content[listener_end:]

# Fix updateProductStatus
update_func_old = """  const updateProductStatus = async (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;
      const updates: any = { estado_publicacion: status };"""

update_func_new = """  const updateProductStatus = async (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => {
    try {
      const updates: any = { estado_publicacion: status };"""

content = content.replace(update_func_old, update_func_new)

# Fix addGoldenSetEvaluation referencing products? No, it shouldn't. Wait, did we remove `products` from updateProductStatus?
# Let's check `deleteProduct` too.
delete_func_old = """  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'products');
    }
  };"""

# We just remove `products, ` from the Provider value at the end.
content = content.replace("      value={{\n        user,\n        products,", "      value={{\n        user,\n")
# Just in case it's in a single line
content = content.replace("user, products, deliveries", "user, deliveries")

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

