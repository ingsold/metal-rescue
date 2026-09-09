import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ImageIcon, HandHeart, Edit, Trash2, X, Plus } from 'lucide-react';
import { ShelterDelivery } from '../types';
import { resizeImage } from '../lib/imageUtils';
import { ImageGallery } from '../components/ImageGallery';

export const ManageDeliveries: React.FC = () => {
  const { deliveries, addDelivery, editDelivery, deleteDelivery } = useApp();
  
  const [refugio_nombre, setRefugioNombre] = useState('');
  const [fecha_entrega, setFechaEntrega] = useState('');
  const [descripcion_impacto, setDescripcionImpacto] = useState('');
  const [monto_donado_gtq, setMontoDonado] = useState<number | ''>('');
  const [alimento_comprado_kg, setAlimentoComprado] = useState<number | ''>('');
  const [galeria_urls, setGaleriaUrls] = useState<string[]>([]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setRefugioNombre('');
    setFechaEntrega('');
    setDescripcionImpacto('');
    setMontoDonado('');
    setAlimentoComprado('');
    setGaleriaUrls([]);
    setEditingId(null);
  };

  const handleEditClick = (delivery: ShelterDelivery) => {
    setEditingId(delivery.id);
    setRefugioNombre(delivery.refugio_nombre);
    
    // Format date to local datetime-local string
    const d = new Date(delivery.fecha_entrega);
    const tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
    setFechaEntrega(localISOTime);
    
    setDescripcionImpacto(delivery.descripcion_impacto);
    setMontoDonado(delivery.monto_donado_gtq);
    setAlimentoComprado(delivery.alimento_comprado_kg);
    
    const initialImages = delivery.galeria_urls && delivery.galeria_urls.length > 0 
      ? delivery.galeria_urls 
      : [delivery.foto_evidencia_url];
    setGaleriaUrls(initialImages);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      for (const file of files) {
        try {
          const compressedBase64 = await resizeImage(file, 800, 800);
          setGaleriaUrls(prev => [...prev, compressedBase64]);
        } catch (err) {
          console.error("Error resizing image:", err);
        }
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setGaleriaUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enforce at least one image
    const finalImages = galeria_urls.length > 0 
       ? galeria_urls 
       : ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800'];

    const deliveryData = {
      refugio_nombre,
      fecha_entrega: new Date(fecha_entrega).toISOString(),
      descripcion_impacto,
      monto_donado_gtq: Number(monto_donado_gtq) || 0,
      alimento_comprado_kg: Number(alimento_comprado_kg) || 0,
      foto_evidencia_url: finalImages[0], // Main image is the first one
      galeria_urls: finalImages
    };

    if (editingId) {
      editDelivery(editingId, deliveryData);
    } else {
      addDelivery(deliveryData);
    }
    resetForm();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-sabbath-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">GESTIÓN DE ENTREGAS</h1>
          <p className="text-zinc-400">Registra las donaciones de impacto y las galerías de fotos para transparencia.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1 bg-sabbath-900 border border-sabbath-800 rounded-2xl p-6 self-start lg:sticky lg:top-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HandHeart className="w-5 h-5 text-sabbath-400" />
              {editingId ? 'Editar Entrega' : 'Nueva Entrega'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors" title="Cancelar edición">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Entidad / Refugio <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={refugio_nombre}
                onChange={(e) => setRefugioNombre(e.target.value)}
                placeholder="Ej. Refugio Patitas Desamparadas"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Fecha de Entrega <span className="text-red-400">*</span></label>
              <input
                type="datetime-local"
                required
                value={fecha_entrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Total Dinero (Q) <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  required
                  value={monto_donado_gtq}
                  onChange={(e) => setMontoDonado(Number(e.target.value))}
                  placeholder="Ej. 3500"
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Total Alimento (kg)</label>
                <input
                  type="number"
                  value={alimento_comprado_kg}
                  onChange={(e) => setAlimentoComprado(Number(e.target.value))}
                  placeholder="Ej. 250"
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Texto de Impacto <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={4}
                value={descripcion_impacto}
                onChange={(e) => setDescripcionImpacto(e.target.value)}
                placeholder="Describe el impacto generado con esta donación..."
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center justify-between">
                <span>Galería de Fotos <span className="text-red-400">*</span></span>
                <span className="text-xs text-zinc-500">{galeria_urls.length} fotos</span>
              </label>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                {galeria_urls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-sabbath-950 border border-sabbath-800 group">
                    <img src={url} alt={`Evidencia ${idx+1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-center font-bold text-white py-0.5">
                        PORTADA
                      </div>
                    )}
                  </div>
                ))}
                
                <div 
                  onClick={handleImageClick}
                  className="aspect-square border-2 border-dashed border-sabbath-800 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-sabbath-500 transition-colors bg-sabbath-950 text-zinc-500 hover:text-zinc-300"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Añadir Foto</span>
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden" 
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-sabbath-600 hover:bg-sabbath-500 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              {editingId ? 'Guardar Cambios' : 'Registrar Entrega'}
            </button>
          </form>
        </div>

        {/* Lista de Entregas */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Entregas Registradas ({deliveries.length})</h2>
          
          {deliveries.length === 0 ? (
            <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl p-10 text-center">
              <HandHeart className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No hay entregas registradas en el sistema.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => {
                const images = delivery.galeria_urls && delivery.galeria_urls.length > 0 ? delivery.galeria_urls : [delivery.foto_evidencia_url];
                return (
                  <div key={delivery.id} className={`bg-sabbath-900 border ${editingId === delivery.id ? 'border-sabbath-500 shadow-lg shadow-sabbath-500/20' : 'border-sabbath-800'} rounded-xl overflow-hidden flex flex-col sm:flex-row relative transition-all`}>
                    
                    <div className="w-full sm:w-48 h-48 flex-shrink-0 relative overflow-hidden">
                      <ImageGallery images={images} alt={delivery.refugio_nombre} thumbnail={true} />
                      {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-bold pointer-events-none">
                          +{images.length - 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white leading-tight pr-4">{delivery.refugio_nombre}</h3>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button 
                            onClick={() => handleEditClick(delivery)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-sabbath-800 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {deletingId === delivery.id ? (
                            <div className="flex items-center gap-2 bg-red-950/50 px-2 py-1 rounded-md border border-red-900 ml-2">
                              <button 
                                onClick={() => {
                                  deleteDelivery(delivery.id);
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
                              onClick={() => setDeletingId(delivery.id)}
                              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-sabbath-800 rounded-md transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-3">"{delivery.descripcion_impacto}"</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto">
                        <span className="bg-sabbath-800 text-white px-2 py-1 rounded text-xs font-bold">
                          Q{delivery.monto_donado_gtq}
                        </span>
                        {delivery.alimento_comprado_kg > 0 && (
                          <span className="bg-sabbath-950 text-zinc-300 border border-sabbath-800 px-2 py-1 rounded text-xs">
                            {delivery.alimento_comprado_kg} kg
                          </span>
                        )}
                        <span className="text-xs text-zinc-500 self-center ml-auto">
                          {new Date(delivery.fecha_entrega).toLocaleDateString('es-GT')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
