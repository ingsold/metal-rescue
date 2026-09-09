import re

with open('src/pages/AdminDonations.tsx', 'r') as f:
    content = f.read()

# I apparently failed to actually patch AdminDonations properly with the new query logic.
# Wait, let me check if I used regex and it failed.
# Yes, the old content still has `products` array and `const { products } = useApp();`

logic_start = """export const AdminDonations: React.FC = () => {
  const { deleteProduct, user } = useApp();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);

  const [filter, setFilter] = useState<string>('todos');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async (isNext: boolean = false) => {
    if (!user) return;
    setIsLoading(true);
    try {
      let constraints: any[] = [
        where('usuario_donante_id', '==', user.id),
        orderBy('fecha_donacion', 'desc'),
        limit(itemsPerPage)
      ];
      if (isNext && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }
      const q = query(collection(db, 'products'), ...constraints);
      const snap = await getDocs(q);
      
      const prods = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(prods);
      
      if (snap.docs.length > 0) {
        setLastVisible(snap.docs[snap.docs.length - 1]);
      }
      setHasMore(snap.docs.length === itemsPerPage);
    } catch(e) {
      console.error("Error fetching admin donations", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
  }, [itemsPerPage, user]);

  const handleNextPage = () => {
    setCurrentPage(p => p + 1);
    fetchProducts(true);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
    setLastVisible(null);
    fetchProducts(false);
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'todos') return true;
    return p.estado_publicacion === filter;
  });
"""

# replace up to `const getStatusBadge = (status: string) => {`
content = re.sub(r"export const AdminDonations: React\.FC = \(\) => \{[\s\S]*?const getStatusBadge = \(status: string\) => \{", logic_start + "\n  const getStatusBadge = (status: string) => {", content)

imports = """import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Search, Filter, Trash2, ShieldAlert, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Clock, CheckCircle, ShieldCheck } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, orderBy, getDocs, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';"""

content = re.sub(r"import React, \{ useState, useEffect \} from 'react';[\s\S]*?import \{ Product \} from '\.\./types';", imports, content)

# I also need to make sure pagination UI uses handleNextPage / handlePrevPage in AdminDonations if it doesn't already.

with open('src/pages/AdminDonations.tsx', 'w') as f:
    f.write(content)

