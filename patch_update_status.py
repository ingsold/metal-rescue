import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

old_update = """  const updateProductStatus = async (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const updates: any = { estado_publicacion: status };
      if (finalPrice !== undefined) updates.precio_final_aprobado = finalPrice;
      if (marketingDesc !== undefined) updates.descripcion_marketing = marketingDesc;
      if (status === 'vendido') updates.fecha_venta = new Date().toISOString();

      await updateDoc(doc(db, 'products', id), updates);

      if (status === 'vendido' && product.estado_publicacion !== 'vendido') {
        const notifId = `n_${Date.now()}`;
        const newNotif: Omit<AppNotification, 'id'> = {
          userId: product.usuario_donante_id,
          message: `¡Tu prenda "${product.banda_artista}" se ha vendido por Q${finalPrice || product.precio_final_aprobado}! Has ayudado a un refugio.`,
          read: false,
          date: new Date().toISOString()
        };
        await setDoc(doc(db, 'notifications', notifId), newNotif);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'products');
    }
  };"""

new_update = """  const updateProductStatus = async (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const updates: any = { estado_publicacion: status };
      if (finalPrice !== undefined) updates.precio_final_aprobado = finalPrice;
      if (marketingDesc !== undefined) updates.descripcion_marketing = marketingDesc;
      if (status === 'vendido') updates.fecha_venta = new Date().toISOString();

      await updateDoc(doc(db, 'products', id), updates);

      if (finalPrice !== undefined) {
        try {
          const evalQuery = query(collection(db, 'evaluaciones_golden_set'), where('producto_id', '==', id));
          const evalDocs = await getDocs(evalQuery);
          if (!evalDocs.empty) {
            await updateDoc(evalDocs.docs[0].ref, { precio_final_aprobado: finalPrice });
          }
        } catch (err) {
          console.error("Error updating Golden Set final price", err);
        }
      }

      if (status === 'vendido' && product.estado_publicacion !== 'vendido') {
        const notifId = `n_${Date.now()}`;
        const newNotif: Omit<AppNotification, 'id'> = {
          userId: product.usuario_donante_id,
          message: `¡Tu prenda "${product.banda_artista}" se ha vendido por Q${finalPrice || product.precio_final_aprobado}! Has ayudado a un refugio.`,
          read: false,
          date: new Date().toISOString()
        };
        await setDoc(doc(db, 'notifications', notifId), newNotif);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'products');
    }
  };"""

if old_update in content:
    content = content.replace(old_update, new_update)
    with open('src/context/AppContext.tsx', 'w') as f:
        f.write(content)
    print("PATCH SUCCESS")
else:
    print("COULD NOT FIND OLD UPDATE BLOCK")
