import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# 1. Update addProduct to return id
old_add_product = """  const addProduct = async (newProdData: Omit<Product, 'id' | 'estado_publicacion' | 'fecha_donacion' | 'usuario_donante_id' | 'usuario_donante_nombre'> & { usuario_donante_id?: string, usuario_donante_nombre?: string }) => {
    if (!user) return;
    
    const newProduct: Omit<Product, 'id'> = {
      ...newProdData,
      estado_publicacion: 'borrador_pendiente',
      fecha_donacion: new Date().toISOString(),
      usuario_donante_id: newProdData.usuario_donante_id || user.id,
      usuario_donante_nombre: newProdData.usuario_donante_nombre || user.name,
    };

    const id = `p_${Date.now()}`;
    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'products');
    }
  };"""

new_add_product = """  const addProduct = async (newProdData: Omit<Product, 'id' | 'estado_publicacion' | 'fecha_donacion' | 'usuario_donante_id' | 'usuario_donante_nombre'> & { usuario_donante_id?: string, usuario_donante_nombre?: string }) => {
    if (!user) throw new Error("Usuario no autenticado");
    
    const newProduct: Omit<Product, 'id'> = {
      ...newProdData,
      estado_publicacion: 'borrador_pendiente',
      fecha_donacion: new Date().toISOString(),
      usuario_donante_id: newProdData.usuario_donante_id || user.id,
      usuario_donante_nombre: newProdData.usuario_donante_nombre || user.name,
    };

    const id = `p_${Date.now()}`;
    try {
      await setDoc(doc(db, 'products', id), newProduct);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'products');
      throw e;
    }
  };"""

content = content.replace(old_add_product, new_add_product)


# 2. Remove migrateLegacyEvaluations and migrateLegacyProductsImages from interface
content = re.sub(r'^\s*migrateLegacyEvaluations:\s*\(\)\s*=>\s*Promise<string>;\s*\n?', '', content, flags=re.MULTILINE)
content = re.sub(r'^\s*migrateLegacyProductsImages:\s*\(\)\s*=>\s*Promise<string>;\s*\n?', '', content, flags=re.MULTILINE)

# 3. Remove implementation of migrateLegacyProductsImages
# We can use a regex to capture it from `const migrateLegacyProductsImages = async (): Promise<string> => {` to the next function `const migrateLegacyEvaluations`
content = re.sub(r'^\s*const migrateLegacyProductsImages = async \(\): Promise<string> => \{.*?(?=^\s*const migrateLegacyEvaluations)/sm', '', content, flags=re.MULTILINE | re.DOTALL)

# 4. Remove implementation of migrateLegacyEvaluations
content = re.sub(r'^\s*const migrateLegacyEvaluations = async \(\): Promise<string> => \{.*?(?=^\s*// Orders Logic)/sm', '', content, flags=re.MULTILINE | re.DOTALL)


# 5. Remove from provider value
content = content.replace('migrateLegacyEvaluations, migrateLegacyProductsImages, ', '')

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

