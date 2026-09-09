import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-zinc-500">Comprobando permisos...</p>
      </div>
    );
  }

  if (!user || user.role !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
