import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# 1. Add to AppState interface
content = content.replace(
    "migrateLegacyEvaluations: () => Promise<string>;",
    "migrateLegacyEvaluations: () => Promise<string>;\n  migrateLegacyProductsImages: () => Promise<string>;"
)

# 2. Add implementation
migration_func = """
  const migrateLegacyProductsImages = async (): Promise<string> => {
    try {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      let count = 0;
      const batch = writeBatch(db);
      
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.imagen_url && (!data.imagenes_url || data.imagenes_url.length === 0)) {
          batch.update(docSnap.ref, {
            imagenes_url: [data.imagen_url],
            imagen_url: deleteField()
          });
          count++;
        } else if (data.imagen_url && data.imagenes_url && data.imagenes_url.length > 0) {
          // If both exist, just remove the old imagen_url field
          batch.update(docSnap.ref, {
            imagen_url: deleteField()
          });
          count++;
        }
      });
      
      if (count > 0) {
        await batch.commit();
        setProducts(prev => prev.map(p => {
          if ((p as any).imagen_url) {
            const { imagen_url, ...rest } = p as any;
            return { ...rest, imagenes_url: p.imagenes_url && p.imagenes_url.length > 0 ? p.imagenes_url : [imagen_url] };
          }
          return p;
        }));
      }
      return `Migración completada. ${count} productos actualizados.`;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Error al migrar imágenes');
    }
  };
"""

content = content.replace(
    "const migrateLegacyEvaluations = async (): Promise<string> => {",
    migration_func + "\n  const migrateLegacyEvaluations = async (): Promise<string> => {"
)

# 3. Add to provider value
content = content.replace(
    "migrateLegacyEvaluations, addEvent,",
    "migrateLegacyEvaluations, migrateLegacyProductsImages, addEvent,"
)

# Need to make sure `deleteField` is imported from firebase/firestore
if "deleteField" not in content:
    content = content.replace(
        "updateDoc, deleteDoc",
        "updateDoc, deleteDoc, writeBatch, deleteField"
    )

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

