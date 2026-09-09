import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "addProduct: (product: Omit<Product, 'id' | 'estado_publicacion' | 'fecha_donacion' | 'usuario_donante_id' | 'usuario_donante_nombre'> & { usuario_donante_id?: string, usuario_donante_nombre?: string }) => Promise<void>;",
    "addProduct: (product: Omit<Product, 'id' | 'estado_publicacion' | 'fecha_donacion' | 'usuario_donante_id' | 'usuario_donante_nombre'> & { usuario_donante_id?: string, usuario_donante_nombre?: string }) => Promise<string>;"
)

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

new_add_product = """  const addProduct = async (newProdData: Omit<Product, 'id' | 'estado_publicacion' | 'fecha_donacion' | 'usuario_donante_id' | 'usuario_donante_nombre'> & { usuario_donante_id?: string, usuario_donante_nombre?: string }): Promise<string> => {
    if (!user) throw new Error("No user");
    
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

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)
