import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

target = """  const updateProductStatus = async (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => {
    try {
      const updates: any = { estado_publicacion: status };
      if (finalPrice !== undefined) updates.precio_final_aprobado = finalPrice;
      if (marketingDesc !== undefined) updates.descripcion_marketing = marketingDesc;
      if (status === 'vendido') updates.fecha_venta = new Date().toISOString();

      await updateDoc(doc(db, 'products', id), updates);"""

replacement = """  const updateProductStatus = async (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => {
    try {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) return;
      const product = productSnap.data() as Product;

      const updates: any = { estado_publicacion: status };
      if (finalPrice !== undefined) updates.precio_final_aprobado = finalPrice;
      if (marketingDesc !== undefined) updates.descripcion_marketing = marketingDesc;
      if (status === 'vendido') updates.fecha_venta = new Date().toISOString();

      await updateDoc(productRef, updates);"""

# Relax whitespace checking
import re
target_regex = r"const updateProductStatus = async \(id: string, status: Product\['estado_publicacion'\], finalPrice\?: number, marketingDesc\?: string\) => \{\s*try \{\s*const updates: any = \{ estado_publicacion: status \};\s*if \(finalPrice !== undefined\) updates\.precio_final_aprobado = finalPrice;\s*if \(marketingDesc !== undefined\) updates\.descripcion_marketing = marketingDesc;\s*if \(status === 'vendido'\) updates\.fecha_venta = new Date\(\)\.toISOString\(\);\s*await updateDoc\(doc\(db, 'products', id\), updates\);"
content = re.sub(target_regex, replacement.strip(), content)

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

