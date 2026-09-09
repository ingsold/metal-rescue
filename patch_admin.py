import re

with open('src/pages/AdminPanel.tsx', 'r') as f:
    content = f.read()

imports = """import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CheckCircle, XCircle, AlertCircle, TrendingUp, Tag, User as UserIcon, RefreshCw, Loader2, Search, Filter, ChevronLeft, ChevronRight, DollarSign, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, where, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';"""

content = re.sub(r"import React, \{ useState \} from 'react';[\s\S]*?import \{ ImageGallery \} from '\.\./components/ImageGallery';", imports, content)


logic_start = """export const AdminPanel: React.FC = () => {
  const { updateProductStatus } = useApp();
  
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);

  // Filtering and Pagination State
  const [selectedType, setSelectedType] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  const fetchPending = async (isNext: boolean = false) => {
    setIsLoading(true);
    try {
      let constraints = [
        where('estado_publicacion', '==', 'borrador_pendiente'),
        orderBy('fecha_donacion', 'asc'), // Older first for admin
        limit(itemsPerPage)
      ];

      if (isNext && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }

      const q = query(collection(db, 'products'), ...constraints);
      const snap = await getDocs(q);
      
      const prods = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setPendingProducts(prods);
      
      if (snap.docs.length > 0) {
        setLastVisible(snap.docs[snap.docs.length - 1]);
      }
      setHasMore(snap.docs.length === itemsPerPage);
    } catch(e) {
      console.error("Error fetching pending products", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending(false);
  }, [itemsPerPage]);

  const handleNextPage = () => {
    setCurrentPage(p => p + 1);
    fetchPending(true);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
    setLastVisible(null);
    fetchPending(false);
  };
"""

content = re.sub(r"export const AdminPanel: React\.FC = \(\) => \{[\s\S]*?const \[itemsPerPage, setItemsPerPage\] = useState\(5\);", logic_start, content)

# Remove the migrate function and client side filtering
content = re.sub(r"const filteredProducts = pendingProducts\.filter\([\s\S]*?const currentProducts = filteredProducts\.slice\([\s\S]*?\);", "const filteredProducts = pendingProducts;\n  const currentProducts = pendingProducts;", content)

# Pagination UI replacement
old_pagination = """          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-zinc-300 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>"""

new_pagination = """          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-zinc-300 font-medium">
            Página {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore || isLoading}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>"""

content = content.replace(old_pagination, new_pagination)


with open('src/pages/AdminPanel.tsx', 'w') as f:
    f.write(content)

