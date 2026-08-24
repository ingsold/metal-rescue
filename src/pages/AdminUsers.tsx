import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Shield, UserCheck, UserX, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { allUsers, fetchAllUsers, updateUserStatus, updateUserRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const search = searchTerm.toLowerCase();
      const fullName = `${u.name} ${u.lastName}`.toLowerCase();
      return (
        fullName.includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.username && u.username.toLowerCase().includes(search))
      );
    });
  }, [allUsers, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  
  // Ensure current page is valid when filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-sabbath-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">PANEL DE USUARIOS</h1>
          <p className="text-zinc-400">Gestiona los roles y estados de los miembros.</p>
        </div>
      </div>

      <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-sabbath-800 flex items-center bg-sabbath-950/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-sabbath-900 border border-sabbath-800 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-sabbath-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sabbath-950 border-b border-sabbath-800">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sabbath-800">
              {currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-sabbath-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{u.name} {u.lastName}</div>
                    <div className="text-sm text-zinc-500">@{u.username || 'usuario'}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    <div className="font-medium">{u.email}</div>
                    {u.telefono && <div className="text-xs text-zinc-400 mt-1">Tel: {u.telefono}</div>}
                    {u.direccion && <div className="text-xs text-zinc-400">Dir: {u.direccion}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'administrador' ? 'bg-sabbath-500/20 text-sabbath-400' : 'bg-zinc-800 text-zinc-300'}`}>
                      {u.role === 'administrador' ? 'Admin' : 'Donante'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.status === 'disabled' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {u.status === 'disabled' ? 'Baja' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {u.role === 'donante' ? (
                        <button
                          onClick={() => updateUserRole(u.id, 'administrador')}
                          title="Hacer Administrador"
                          className="p-2 bg-sabbath-950 border border-sabbath-800 rounded hover:bg-sabbath-800 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserRole(u.id, 'donante')}
                          title="Quitar Administrador"
                          className="p-2 bg-sabbath-950 border border-sabbath-800 rounded hover:bg-sabbath-800 text-sabbath-400 hover:text-sabbath-300 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      )}
                      {u.status === 'active' ? (
                        <button
                          onClick={() => updateUserStatus(u.id, 'disabled')}
                          title="Dar de Baja"
                          className="p-2 bg-sabbath-950 border border-red-900/50 rounded hover:bg-red-900/30 text-red-400 transition-colors"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(u.id, 'active')}
                          title="Reactivar"
                          className="p-2 bg-sabbath-950 border border-green-900/50 rounded hover:bg-green-900/30 text-green-400 transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-sabbath-800 flex items-center justify-between bg-sabbath-950/50">
          <p className="text-sm text-zinc-400">
            Mostrando <span className="font-medium text-white">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * usersPerPage + 1}</span> a{' '}
            <span className="font-medium text-white">
              {Math.min(currentPage * usersPerPage, filteredUsers.length)}
            </span>{' '}
            de <span className="font-medium text-white">{filteredUsers.length}</span> usuarios
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-sabbath-900 border border-sabbath-800 rounded hover:bg-sabbath-800 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-sabbath-900 border border-sabbath-800 rounded hover:bg-sabbath-800 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
