import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ImageIcon, Building2, Edit, Trash2, X, Check } from 'lucide-react';
import { Ally } from '../types';
import { resizeImage } from '../lib/imageUtils';

export const ManageAllies: React.FC = () => {
  const { allies, addAlly, editAlly, deleteAlly } = useApp();
  
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [redes_sociales, setRedesSociales] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setNombre('');
    setTelefono('');
    setEmail('');
    setDescripcion('');
    setRedesSociales('');
    setImagenUrl('');
    setEditingId(null);
  };

  const handleEditClick = (ally: Ally) => {
    setEditingId(ally.id);
    setNombre(ally.nombre);
    setTelefono(ally.telefono);
    setEmail(ally.email);
    setDescripcion(ally.descripcion);
    setRedesSociales(ally.redes_sociales || '');
    setImagenUrl(ally.imagen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await resizeImage(file, 800, 800);
        setImagenUrl(compressedBase64);
      } catch (err) {
        console.error("Error resizing image:", err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalImageUrl = imagenUrl.trim() !== '' 
       ? imagenUrl 
       : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800';

    if (editingId) {
      editAlly(editingId, {
        nombre,
        telefono,
        email,
        descripcion,
        redes_sociales,
        imagen: finalImageUrl
      });
    } else {
      addAlly({
        nombre,
        telefono,
        email,
        descripcion,
        redes_sociales,
        imagen: finalImageUrl
      });
    }
    resetForm();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-sabbath-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">GESTIÓN DE ENTIDADES APOYADAS</h1>
          <p className="text-zinc-400">Administra los refugios, organizaciones y entidades aliadas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1 bg-sabbath-900 border border-sabbath-800 rounded-2xl p-6 self-start sticky top-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sabbath-400" />
              {editingId ? 'Editar Entidad' : 'Nueva Entidad'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors" title="Cancelar edición">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Nombre Entidad <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Dirección de Bienestar Animal Muniguate"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Teléfono <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 4479 7830"
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Correo Electrónico <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Redes Sociales (Enlaces)</label>
              <input
                type="text"
                value={redes_sociales}
                onChange={(e) => setRedesSociales(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Descripción <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Entidad dedicada a la protección..."
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Logo / Imagen</label>
              
              <div 
                onClick={handleImageClick}
                className="border-2 border-dashed border-sabbath-800 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-sabbath-500 transition-colors overflow-hidden relative bg-sabbath-950"
              >
                {imagenUrl ? (
                  <img src={imagenUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                    <span className="text-sm text-zinc-400">Clic para subir imagen</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange}
                accept="image/*"
                className="hidden" 
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-sabbath-600 hover:bg-sabbath-500 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              {editingId ? 'Guardar Cambios' : 'Añadir Entidad'}
            </button>
          </form>
        </div>

        {/* Lista de Entidades */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Entidades Registradas ({allies.length})</h2>
          
          {allies.length === 0 ? (
            <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl p-10 text-center">
              <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No hay entidades registradas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allies.map((ally) => (
                <div key={ally.id} className={`bg-sabbath-900 border ${editingId === ally.id ? 'border-sabbath-500 shadow-lg shadow-sabbath-500/20' : 'border-sabbath-800'} rounded-xl overflow-hidden flex flex-col sm:flex-row relative transition-all`}>
                  
                  <div className="w-full sm:w-40 h-40 flex-shrink-0 bg-white flex items-center justify-center relative overflow-hidden">
                    {ally.imagen ? (
                      <img src={ally.imagen} alt={ally.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-10 h-10 text-zinc-300" />
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{ally.nombre}</h3>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditClick(ally)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-sabbath-800 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {deletingId === ally.id ? (
                          <div className="flex items-center gap-2 bg-red-950/50 px-2 py-1 rounded-md border border-red-900 ml-2">
                            <span className="text-xs text-red-200">¿Eliminar?</span>
                            <button 
                              onClick={() => {
                                deleteAlly(ally.id);
                                setDeletingId(null);
                              }}
                              className="text-xs font-bold text-red-400 hover:text-red-300"
                            >
                              Sí
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)}
                              className="text-xs text-zinc-400 hover:text-white"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeletingId(ally.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-sabbath-800 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{ally.descripcion}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-zinc-300">
                      <span><strong className="text-zinc-500">Tel:</strong> {ally.telefono}</span>
                      <span><strong className="text-zinc-500">Email:</strong> {ally.email}</span>
                      {ally.redes_sociales && (
                        <span className="truncate max-w-[200px]"><strong className="text-zinc-500">Web:</strong> {ally.redes_sociales}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
