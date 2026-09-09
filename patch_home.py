import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Home relies on products.filter(p => p.estado_publicacion === 'vendido')
# We need to change it to fetch the latest 4 sold products.

import_regex = r"import \{ useApp \} from '\.\./context/AppContext';"
new_imports = """import { useApp } from '../context/AppContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useEffect, useState } from 'react';"""

content = re.sub(import_regex, new_imports, content)

component_start = r"const \{ products, deliveries \} = useApp\(\);"
new_start = """  const { deliveries } = useApp();
  const [soldProducts, setSoldProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchSold = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('estado_publicacion', '==', 'vendido'),
          orderBy('fecha_donacion', 'desc'),
          limit(4)
        );
        const snap = await getDocs(q);
        setSoldProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error("Error fetching sold products", e);
      }
    };
    fetchSold();
  }, []);"""

content = re.sub(r"const \{ products, deliveries \} = useApp\(\);[\s\S]*?const soldProducts = products\.filter\(p => p\.estado_publicacion === 'vendido'\);", new_start, content)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

