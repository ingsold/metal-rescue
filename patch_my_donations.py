import re

with open('src/pages/MyDonations.tsx', 'r') as f:
    content = f.read()

imports = """import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Search, Filter, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageGallery } from '../components/ImageGallery';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';"""

content = re.sub(r"import React, \{ useState \} from 'react';[\s\S]*?import \{ ImageGallery \} from '\.\./components/ImageGallery';", imports, content)


logic_start = """export const MyDonations: React.FC = () => {
  const { user, deleteProduct, isLoading: isAuthLoading } = useApp();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!user) return;
      setIsLoadingProducts(true);
      try {
        const q = query(
          collection(db, 'products'),
          where('usuario_donante_id', '==', user.id),
          orderBy('fecha_donacion', 'desc')
        );
        const snap = await getDocs(q);
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error("Error fetching user products", e);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchUserProducts();
  }, [user]);

  const userProducts = products;
"""

content = re.sub(r"export const MyDonations: React\.FC = \(\) => \{[\s\S]*?const userProducts = products\.filter\(p => p\.usuario_donante_id === user\?\.id\);", logic_start, content)
content = content.replace("if (isLoading) {", "if (isAuthLoading || isLoadingProducts) {")

with open('src/pages/MyDonations.tsx', 'w') as f:
    f.write(content)

