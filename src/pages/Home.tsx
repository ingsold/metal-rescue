import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Zap, Skull } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import metalRescueLogo from '../assets/images/metalrescue_logo_1787032571849.jpg';

export const Home: React.FC = () => {
    const { deliveries } = useApp();
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
  }, []);
  const totalItemsSold = soldProducts.length;
  const totalRaised = soldProducts.reduce((acc, curr) => acc + (curr.precio_final_aprobado || 0), 0);
  const totalFood = deliveries.reduce((acc, curr) => acc + curr.alimento_comprado_kg, 0);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden border border-sabbath-800 bg-sabbath-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative px-6 py-20 sm:py-32 sm:px-12 lg:px-20 text-center flex flex-col items-center">
          <img src={metalRescueLogo} alt="MetalRescue Logo" className="w-32 h-32 rounded-full border-4 border-sabbath-600 mb-8 shadow-2xl object-cover" />
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight max-w-4xl">
            TRANSFORMA TU PASIÓN POR EL METAL EN <span className="text-sabbath-400">AYUDA PARA ANIMALES</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mb-10">
            Dona tus playeras, chumpas o mercadería que ya no usas. Nuestra plataforma las clasifica con inteligencia artificial y las ventas va a refugios en Guatemala.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/donar" className="px-8 py-4 bg-sabbath-600 hover:bg-sabbath-500 text-white rounded-md font-bold text-lg transition-colors flex items-center justify-center min-h-[48px]">
              Donar una Prenda
            </Link>
            <Link to="/catalogo" className="px-8 py-4 bg-transparent border-2 border-sabbath-600 hover:border-sabbath-400 hover:bg-sabbath-900/50 text-white rounded-md font-bold text-lg transition-colors flex items-center justify-center min-h-[48px]">
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Counters */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl p-8 text-center flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-bold text-white mb-2">{totalItemsSold}</span>
          <span className="text-zinc-400 font-medium uppercase tracking-wider text-sm">Prendas Vendidas</span>
        </div>
        <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl p-8 text-center flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-bold text-sabbath-400 mb-2">Q{totalRaised.toLocaleString('es-GT')}</span>
          <span className="text-zinc-400 font-medium uppercase tracking-wider text-sm">Recaudados</span>
        </div>
        <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl p-8 text-center flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-bold text-white mb-2">{totalFood}kg</span>
          <span className="text-zinc-400 font-medium uppercase tracking-wider text-sm">Alimento Entregado</span>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12">
        <h2 className="text-3xl font-display font-bold text-center mb-12">¿CÓMO FUNCIONA?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-sabbath-900 border border-sabbath-700 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-sabbath-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. Dona en un Toque</h3>
            <p className="text-zinc-400">Lleva o envía tu ropa metalera a nuestro estand en los próximos conciertos en Guatemala o súbela directo a la app.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-sabbath-900 border border-sabbath-700 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-sabbath-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. Gemini AI Clasifica</h3>
            <p className="text-zinc-400">Nuestra IA tasa y sugiere un precio basado en la rareza de la prenda y el mercado local para maximizar el aporte.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-sabbath-900 border border-sabbath-700 flex items-center justify-center mb-6">
              <HeartHandshake className="w-8 h-8 text-sabbath-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. 95% para Refugios</h3>
            <p className="text-zinc-400">Las prendas se venden en el catálogo. El 95% de los fondos se convierte en alimento y medicina, y el 5% financia gastos de funcionamiento.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
