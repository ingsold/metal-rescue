import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const GoldenSetRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-zinc-500">Comprobando permisos...</p>
      </div>
    );
  }

  // Golden set only for admin@metalrescue.org
  if (!user || user.email !== 'admin@metalrescue.org') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
