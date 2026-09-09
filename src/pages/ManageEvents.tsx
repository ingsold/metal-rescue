import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarPlus, Trash2, Calendar, MapPin, Image as ImageIcon, Camera, XCircle, Edit2, X, CheckCircle } from 'lucide-react';
import { resizeImage } from '../lib/imageUtils';

export const ManageEvents: React.FC = () => {
  const { events, addEvent, editEvent, deleteEvent, cancelEvent } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [lugar, setLugar] = useState('');
  const [direccion, setDireccion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setNombre('');
    setFecha('');
    setLugar('');
    setDireccion('');
    setImagenUrl('');
    setImageFile(null);
  };

  const handleEditClick = (event: any) => {
    setEditingId(event.id);
    setNombre(event.nombre || '');
    
    // Format date for datetime-local input
    const d = new Date(event.fecha);
    const tzoffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
    setFecha(localISOTime);
    
    setLugar(event.lugar || '');
    setDireccion(event.direccion || '');
    setImagenUrl(event.imagen_url || '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
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
      : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop';

    if (editingId) {
      editEvent(editingId, {
        nombre,
        fecha: new Date(fecha).toISOString(),
        lugar,
        direccion,
        imagen_url: finalImageUrl
      });
    } else {
      addEvent({
        nombre,
        fecha: new Date(fecha).toISOString(),
        lugar,
        direccion,
        imagen_url: finalImageUrl
      });
    }

    resetForm();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-sabbath-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">GESTIONAR TOQUES</h1>
          <p className="text-zinc-400">Agrega, edita, cancela o elimina los próximos conciertos donde habrá estand de MetalRescue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1 bg-sabbath-900 border border-sabbath-800 rounded-2xl p-6 self-start lg:sticky lg:top-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-sabbath-400" />
              {editingId ? 'Editar Evento' : 'Nuevo Evento'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors" title="Cancelar edición">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Nombre del Evento <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Festival Metal GT"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Fecha y Hora <span className="text-red-400">*</span></label>
              <input
                type="datetime-local"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Lugar (Bar / Recinto) <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder="Ej. Rock Vuh"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Dirección <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej. Zona 4, Ciudad de Guatemala"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Flyer del Evento (Opcional)</label>
              <div 
                onClick={handleImageClick}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center transition-colors relative overflow-hidden h-32 ${
                  imageFile || imagenUrl ? 'border-sabbath-500 bg-sabbath-900/50' : 'border-sabbath-700 bg-sabbath-950/50 hover:bg-sabbath-900'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" 
                />
                
                {imagenUrl ? (
                  <>
                    <img src={imagenUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="relative z-10 bg-sabbath-950/80 p-2 rounded-full">
                      <ImageIcon className="w-5 h-5 text-sabbath-400" />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-sabbath-500 mb-2" />
                    <p className="text-zinc-400 text-xs font-medium">Click para subir flyer</p>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-md font-bold text-lg flex items-center justify-center space-x-2 transition-colors mt-4 ${
                editingId ? 'bg-zinc-100 hover:bg-white text-zinc-900' : 'bg-sabbath-600 hover:bg-sabbath-500 text-white'
              }`}
            >
              <span>{editingId ? 'Guardar Cambios' : 'Crear Evento'}</span>
            </button>
          </form>
        </div>

        {/* Lista de Eventos */}
        <div className="lg:col-span-2 space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
              <Calendar className="w-16 h-16 text-sabbath-500 mx-auto mb-4 opacity-50" />
              <p className="text-zinc-400 text-xl font-medium">No hay toques programados.</p>
            </div>
          ) : (
            events.map((event) => {
              const eventDate = new Date(event.fecha);
              
              return (
                <div key={event.id} className={`bg-sabbath-900 border ${editingId === event.id ? 'border-sabbath-500 shadow-lg shadow-sabbath-500/20' : 'border-sabbath-800'} rounded-xl overflow-hidden flex flex-col sm:flex-row relative transition-all`}>
                  <div className="w-full sm:w-48 h-48 flex-shrink-0 relative overflow-hidden">
                    {event.imagen_url ? (
                      <img src={event.imagen_url} alt={event.nombre} className={`w-full h-full object-cover ${event.estado === 'cancelado' ? 'grayscale opacity-50' : ''}`} />
                    ) : (
                      <div className="w-full h-full bg-sabbath-950 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-sabbath-700" />
                      </div>
                    )}
                    {event.estado === 'cancelado' && (
                      <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                        <span className="text-red-500 font-display font-bold border-2 border-red-500 px-2 py-1 transform -rotate-12 bg-sabbath-950/80">CANCELADO</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-xl font-bold leading-tight ${event.estado === 'cancelado' ? 'text-zinc-500 line-through' : 'text-white'}`}>{event.nombre}</h3>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditClick(event)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-sabbath-800 rounded-md transition-colors"
                          title="Editar Evento"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        
                        {event.estado === 'activo' ? (
                          <button 
                            onClick={() => cancelEvent(event.id)}
                            className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-md transition-colors"
                            title="Cancelar Evento"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => editEvent(event.id, { estado: 'activo' })}
                            className="p-2 text-zinc-400 hover:text-green-400 hover:bg-green-400/10 rounded-md transition-colors"
                            title="Reactivar Evento"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => {
                            if(window.confirm('¿Estás seguro de querer eliminar este evento completamente?')) {
                              deleteEvent(event.id);
                              if (editingId === event.id) resetForm();
                            }
                          }}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                          title="Eliminar Evento Permanentemente"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-2 text-sm">
                      <div className="flex items-center space-x-2 text-zinc-300">
                        <Calendar className={`w-4 h-4 ${event.estado === 'cancelado' ? 'text-zinc-600' : 'text-sabbath-400'}`} />
                        <span className={event.estado === 'cancelado' ? 'text-zinc-500' : ''}>{eventDate.toLocaleDateString('es-GT')} - {eventDate.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-zinc-300">
                        <MapPin className={`w-4 h-4 ${event.estado === 'cancelado' ? 'text-zinc-600' : 'text-sabbath-400'}`} />
                        <span className={event.estado === 'cancelado' ? 'text-zinc-500' : ''}>{event.lugar} ({event.direccion})</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
