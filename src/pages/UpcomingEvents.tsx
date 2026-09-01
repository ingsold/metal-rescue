import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Clock } from 'lucide-react';

export const UpcomingEvents: React.FC = () => {
  const { events } = useApp();

  // Filter out past events (only keep today and future)
  const validEvents = events.filter((event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.fecha);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() >= today.getTime();
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-sabbath-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">PRÓXIMOS TOQUES</h1>
          <p className="text-zinc-400">Encuentra nuestro estand en estos conciertos para donar o comprar ropa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {validEvents.map((event) => {
          const eventDate = new Date(event.fecha);
          const isCanceled = event.estado === 'cancelado';
          
          return (
            <div key={event.id} className={`group bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden shadow-lg flex flex-col sm:flex-row transition-colors ${!isCanceled ? 'hover:border-sabbath-500' : 'opacity-80'}`}>
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                <img 
                  src={event.imagen_url} 
                  alt={event.nombre} 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${!isCanceled ? 'group-hover:scale-110' : 'grayscale'}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-sabbath-900 via-sabbath-900/40 to-transparent"></div>
                
                {isCanceled && (
                  <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                    <span className="text-red-500 font-display text-xl font-bold border-2 border-red-500 px-3 py-1 transform -rotate-12 bg-sabbath-950/80 shadow-lg">
                      CANCELADO
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                <h3 className={`text-2xl font-bold mb-4 leading-tight ${isCanceled ? 'text-zinc-500 line-through' : 'text-white'}`}>{event.nombre}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-zinc-300">
                    <Calendar className={`w-5 h-5 ${isCanceled ? 'text-zinc-600' : 'text-sabbath-400'}`} />
                    <span className={isCanceled ? 'text-zinc-500' : ''}>{eventDate.toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-zinc-300">
                    <Clock className={`w-5 h-5 ${isCanceled ? 'text-zinc-600' : 'text-sabbath-400'}`} />
                    <span className={isCanceled ? 'text-zinc-500' : ''}>{eventDate.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-start space-x-3 text-zinc-300">
                    <MapPin className={`w-5 h-5 mt-1 flex-shrink-0 ${isCanceled ? 'text-zinc-600' : 'text-sabbath-400'}`} />
                    <div>
                      <p className={`font-bold ${isCanceled ? 'text-zinc-500' : ''}`}>{event.lugar}</p>
                      <p className={`text-sm ${isCanceled ? 'text-zinc-600' : 'text-zinc-400'}`}>{event.direccion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {validEvents.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
             <Calendar className="w-16 h-16 text-sabbath-500 mx-auto mb-4 opacity-50" />
             <p className="text-zinc-400 text-xl font-medium">No hay toques programados por el momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};
