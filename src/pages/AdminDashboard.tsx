import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Package, Calendar, Beaker, CheckSquare, Settings, HeartHandshake, Building2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const adminLinks = [
    { to: "/admin-ordenes", icon: <Package className="w-8 h-8 mb-4 text-blue-400" />, title: "Gestión de Órdenes", desc: "Preparar pedidos de los usuarios" },
    { to: "/admin-donaciones", icon: <Package className="w-8 h-8 mb-4 text-purple-400" />, title: "Mis Prendas Subidas", desc: "Ver prendas que he publicado como admin" },
    { to: "/admin-entregas", icon: <HeartHandshake className="w-8 h-8 mb-4 text-emerald-400" />, title: "Registro de Entregas", desc: "Registro de entregas a refugios y galerías" },
    { to: "/admin-entidades", icon: <Building2 className="w-8 h-8 mb-4 text-teal-400" />, title: "Entidades Apoyadas", desc: "Directorio de refugios y organizaciones" },
    { to: "/admin-pendientes", icon: <CheckSquare className="w-8 h-8 mb-4 text-sabbath-400" />, title: "Prendas Pendientes", desc: "Aprobar o rechazar donaciones entrantes" },
    { to: "/admin-toques", icon: <Calendar className="w-8 h-8 mb-4 text-red-400" />, title: "Gestión de Toques", desc: "Crear y administrar eventos/conciertos" },
    { to: "/admin-usuarios", icon: <Users className="w-8 h-8 mb-4 text-yellow-400" />, title: "Control de Usuarios", desc: "Administración de roles y estados" },
    { to: "/admin-golden-set", icon: <Beaker className="w-8 h-8 mb-4 text-green-400" />, title: "Experimento Golden Set", desc: "Gestión y exportación de muestras IA (TFM)" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-sabbath-800 pb-4">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Panel de Control Principal</h1>
        <p className="text-zinc-400">Selecciona el módulo que deseas administrar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link, idx) => (
          <Link
            key={idx}
            to={link.to}
            className="bg-sabbath-900 border border-sabbath-800 p-6 rounded-xl hover:border-sabbath-500 hover:bg-sabbath-900/80 transition-all flex flex-col items-center text-center group"
          >
            {link.icon}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sabbath-400 transition-colors">{link.title}</h3>
            <p className="text-sm text-zinc-400">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
