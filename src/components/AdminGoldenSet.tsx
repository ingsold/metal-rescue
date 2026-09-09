import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Download, Beaker, Trash2, Database, RefreshCw, Loader2 } from 'lucide-react';
import { GoldenSetEvaluation } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const AdminGoldenSet: React.FC = () => {
  const [evaluations, setEvaluations] = useState<GoldenSetEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { showToast } = useToast();

  const fetchEvals = async () => {
    setIsLoading(true);
    setLoadingAction('fetch');
    try {
      const q = query(collection(db, 'evaluaciones_golden_set'), orderBy('fecha_evaluacion', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => doc.data() as GoldenSetEvaluation);
      setEvaluations(data);
      setDataLoaded(true);
    } catch (e: any) {
      console.error("Error fetching golden set:", e);
      if (e.message?.includes('Quota') || e.message?.includes('quota')) {
        setActionMessage({ type: 'error', text: 'Límite de cuota gratuita de Firebase excedido. Por favor intenta mañana o habilita la facturación.' });
      } else {
        setActionMessage({ type: 'error', text: 'Error al cargar el Golden Set: ' + (e.message || 'Error desconocido') });
      }
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const executeClear = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setLoadingAction('clear');
    setActionMessage(null);
    try {
      // Eliminar Golden Set
      const evalsSnap = await getDocs(collection(db, 'evaluaciones_golden_set'));
      const evalsPromises = evalsSnap.docs.map(d => deleteDoc(doc(db, 'evaluaciones_golden_set', d.id)));
      await Promise.all(evalsPromises);
      
      // Eliminar Productos
      const productsSnap = await getDocs(collection(db, 'products'));
      const productsPromises = productsSnap.docs.map(d => deleteDoc(doc(db, 'products', d.id)));
      await Promise.all(productsPromises);

      // Eliminar Órdenes
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const ordersPromises = ordersSnap.docs.map(d => deleteDoc(doc(db, 'orders', d.id)));
      await Promise.all(ordersPromises);

      setEvaluations([]);
      setActionMessage({ type: 'success', text: "Limpieza de Base de Datos completada exitosamente." });
      
      setTimeout(() => setActionMessage(null), 5000);
    } catch(e) {
      console.error("Error limpiando BD:", e);
      setActionMessage({ type: 'error', text: "Error al limpiar la base de datos. Asegúrate de ser Administrador y revisa la consola." });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const filteredEvaluations = evaluations.filter(ev => {
    if (!startDate && !endDate) return true;
    const evDate = new Date(ev.fecha_evaluacion);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (evDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (evDate > end) return false;
    }
    return true;
  });

  const exportToCSV = () => {
    if (evaluations.length === 0) {
      setActionMessage({ type: 'error', text: 'No hay evaluaciones para exportar.' });
      return;
    }

    const headers = [
      'ID Muestra',
      'Fecha',
      'Banda/Artista',
      'Tipo Prenda',
      'Estado',
      'Origen Adquisición',
      'Evento Origen',
      'Precio Donante (Q)',
      'Precio IA (Q)',
      'Precio Final Aprobado (Q)',
      'Autenticidad IA',
      'Confianza IA (%)',
      'Razonamiento'
    ];

    const escapeCSV = (str: string | number | undefined) => {
      if (str === undefined || str === null) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = filteredEvaluations.map(ev => [
      escapeCSV(ev.id_muestra),
      escapeCSV(new Date(ev.fecha_evaluacion).toLocaleString()),
      escapeCSV(ev.banda_artista),
      escapeCSV(ev.tipo_prenda),
      escapeCSV(ev.estado_conservacion),
      escapeCSV(ev.origen_adquisicion),
      escapeCSV(ev.evento_origen),
      escapeCSV(ev.precio_estimado_donante),
      escapeCSV(ev.precio_sugerido_ia),
      escapeCSV(ev.precio_final_aprobado),
      escapeCSV(ev.autenticidad_ia),
      escapeCSV(ev.nivel_confianza_ia),
      escapeCSV(ev.razonamiento_analisis)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MetalRescue_GoldenSet_Experiment_Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" bg-sabbath-900 border border-sabbath-800 p-6 rounded-xl">
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-sabbath-900 border border-red-500/50 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-red-500 mb-2">¡Advertencia!</h3>
            <p className="text-zinc-300 mb-6">¿Estás seguro de que quieres eliminar TODAS las evaluaciones del Golden Set, prendas registradas y órdenes de compra? Esto no se puede deshacer y es solo para reiniciar el experimento.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-sabbath-800 hover:bg-sabbath-700 text-white rounded font-medium transition-colors">Cancelar</button>
              <button onClick={executeClear} disabled={isLoading} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded font-bold transition-colors">
                {loadingAction === 'clear' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loadingAction === 'clear' ? 'Limpiando...' : 'Sí, Limpiar BD'}
              </button>
            </div>
          </div>
        </div>
      )}

      {actionMessage && (
        <div className={`mb-6 p-4 rounded-lg border ${actionMessage.type === 'success' ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-red-900/50 border-red-500 text-red-200'}`}>
          {actionMessage.text}
        </div>
      )}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 border-b border-sabbath-800 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Beaker className="w-6 h-6 text-green-400" />
            Experimento TFM: Banco de Pruebas Golden Set
          </h2>
          <p className="text-zinc-400 mt-1">Registros de tasación IA guardados independientemente durante el flujo de donación.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
          <div className="flex flex-row gap-2 items-center text-sm">
            <label className="text-zinc-400 font-medium">Desde:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="bg-sabbath-800 text-white border border-sabbath-700 rounded px-2 py-1.5 focus:outline-none focus:border-green-500 transition-colors"
            />
            <label className="text-zinc-400 font-medium ml-2">Hasta:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="bg-sabbath-800 text-white border border-sabbath-700 rounded px-2 py-1.5 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchEvals}
              disabled={isLoading}
              className="bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
              title="Cargar datos de la BD"
            >
              {loadingAction === 'fetch' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {loadingAction === 'fetch' ? 'Cargando...' : 'Cargar Data'}
            </button>
            <button
              onClick={exportToCSV}
              disabled={isLoading || filteredEvaluations.length === 0}
              className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar CSV
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
              title="Limpiar base de datos"
            >
              {loadingAction === 'clear' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loadingAction === 'clear' ? 'Limpiando...' : 'Limpiar BD'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">Cargando datos del experimento...</p>
      ) : !dataLoaded ? (
        <div className="text-center py-10 bg-sabbath-950/50 rounded-lg border border-sabbath-800 border-dashed">
            <p className="text-zinc-400 mb-4">La carga automática está deshabilitada para reducir costos de base de datos.</p>
            <button onClick={fetchEvals} disabled={isLoading} className="bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-2 rounded-md font-bold transition-colors flex items-center justify-center gap-2 mx-auto">
                {loadingAction === 'fetch' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loadingAction === 'fetch' ? 'Cargando...' : 'Cargar Muestras Ahora'}
            </button>
        </div>
      ) : filteredEvaluations.length === 0 ? (
        <p className="text-zinc-500">Aún no hay muestras procesadas en el Golden Set.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sabbath-950/50 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800">Muestra ID</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800">Banda</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800">Estado</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-right">Precio Donante</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-right">Precio IA</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-right text-yellow-400">Precio Final</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-center">Confianza</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300 divide-y divide-sabbath-800/50">
              {filteredEvaluations.map((ev, idx) => (
                <tr key={idx} className="hover:bg-sabbath-950/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-sabbath-400">{ev.id_muestra}</td>
                  <td className="px-4 py-3 font-bold text-white">{ev.banda_artista}</td>
                  <td className="px-4 py-3 text-xs">{ev.estado_conservacion}</td>
                  <td className="px-4 py-3 text-right">Q{ev.precio_estimado_donante}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-400">Q{ev.precio_sugerido_ia}</td>
                  <td className="px-4 py-3 text-right font-bold text-yellow-400">{ev.precio_final_aprobado ? `Q${ev.precio_final_aprobado}` : '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs">
                      {ev.nivel_confianza_ia}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {new Date(ev.fecha_evaluacion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
