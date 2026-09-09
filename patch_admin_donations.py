import re

with open('src/pages/AdminDonations.tsx', 'r') as f:
    content = f.read()

imports = """import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Search, Filter, Trash2, ShieldAlert, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';"""

content = re.sub(r"import React, \{ useState \} from 'react';[\s\S]*?import \{ ImageGallery \} from '\.\./components/ImageGallery';", imports, content)


logic_start = """export const AdminDonations: React.FC = () => {
  const { deleteProduct, user } = useApp();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (isNext: boolean = false) => {
    setIsLoading(true);
    try {
      let constraints = [
        orderBy('fecha_donacion', sortOrder),
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
      console.error("Error fetching all products", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
  }, [sortOrder, itemsPerPage]);

  const handleNextPage = () => {
    setCurrentPage(p => p + 1);
    fetchProducts(true);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
    setLastVisible(null);
    fetchProducts(false);
  };
"""

content = re.sub(r"export const AdminDonations: React\.FC = \(\) => \{[\s\S]*?const \[itemsPerPage, setItemsPerPage\] = useState\(10\);", logic_start, content)

# Client side filtering is still applied here for searchTerm and statusFilter
# We will leave that as is, but change the currentProducts derivation.
content = re.sub(r"const currentProducts = filteredProducts\.slice\([\s\S]*?\);", "const currentProducts = filteredProducts;", content)

# Pagination UI replacement
old_pagination = """          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-zinc-300 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>"""

new_pagination = """          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-zinc-300 font-medium">
            Página {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore || isLoading}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>"""

content = content.replace(old_pagination, new_pagination)


with open('src/pages/AdminDonations.tsx', 'w') as f:
    f.write(content)

