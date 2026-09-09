import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# 1. Add imports (useApp)
content = content.replace("import { GoldenSetEvaluation } from '../types';", "import { GoldenSetEvaluation } from '../types';\nimport { useApp } from '../context/AppContext';")
content = content.replace("import { Download, Beaker, Trash2 } from 'lucide-react';", "import { Download, Beaker, Trash2, Database, RefreshCw } from 'lucide-react';")

# 2. Add useApp and dataLoaded state
old_state = """export const AdminGoldenSet: React.FC = () => {
  const [evaluations, setEvaluations] = useState<GoldenSetEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchEvals = async () => {
      try {
        const q = query(collection(db, 'evaluaciones_golden_set'), orderBy('fecha_evaluacion', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => doc.data() as GoldenSetEvaluation);
        setEvaluations(data);
        
      } catch (e: any) {
        console.error("Error fetching golden set:", e);
        if (e.message?.includes('Quota') || e.message?.includes('quota')) {
          setActionMessage({ type: 'error', text: 'Límite de cuota gratuita de Firebase excedido. Por favor intenta mañana o habilita la facturación.' });
        } else {
          setActionMessage({ type: 'error', text: 'Error al cargar el Golden Set: ' + (e.message || 'Error desconocido') });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvals();
  }, []);"""

new_state = """export const AdminGoldenSet: React.FC = () => {
  const [evaluations, setEvaluations] = useState<GoldenSetEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { showToast } = useToast();
  const { migrateLegacyEvaluations } = useApp();

  const fetchEvals = async () => {
    setIsLoading(true);
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
    }
  };"""

content = content.replace(old_state, new_state)

# 3. Change title and buttons
old_buttons = """      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-sabbath-800 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Beaker className="w-6 h-6 text-green-400" />
            Experimento TFM: Banco de Pruebas Golden Set (30 Muestras)
          </h2>
          <p className="text-zinc-400 mt-1">Registros de tasación IA guardados independientemente durante el flujo de donación.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Limpiar base de datos"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar BD
          </button>
          <button
            onClick={exportToCSV}
            disabled={isLoading || evaluations.length === 0}
            className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">Cargando datos del experimento...</p>
      ) : evaluations.length === 0 ? (
        <p className="text-zinc-500">Aún no hay muestras procesadas en el Golden Set.</p>
      ) : ("""

new_buttons = """      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-sabbath-800 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Beaker className="w-6 h-6 text-green-400" />
            Experimento TFM: Banco de Pruebas Golden Set
          </h2>
          <p className="text-zinc-400 mt-1">Registros de tasación IA guardados independientemente durante el flujo de donación.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchEvals}
            disabled={isLoading}
            className="bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Cargar datos de la BD"
          >
            <Database className="w-4 h-4" />
            Cargar Data
          </button>
          <button
            onClick={async () => {
              try {
                const msg = await migrateLegacyEvaluations();
                alert(msg);
                if (dataLoaded) fetchEvals();
              } catch(e) {
                alert("Error al migrar: " + e);
              }
            }}
            disabled={isLoading}
            className="bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Sincronizar Data Antigua"
          >
            <RefreshCw className="w-4 h-4" />
            Sincronizar Data
          </button>
          <button
            onClick={exportToCSV}
            disabled={isLoading || evaluations.length === 0}
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
            <Trash2 className="w-4 h-4" />
            Limpiar BD
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">Cargando datos del experimento...</p>
      ) : !dataLoaded ? (
        <div className="text-center py-10 bg-sabbath-950/50 rounded-lg border border-sabbath-800 border-dashed">
            <p className="text-zinc-400 mb-4">La carga automática está deshabilitada para reducir costos de base de datos.</p>
            <button onClick={fetchEvals} className="bg-sabbath-600 hover:bg-sabbath-500 text-white px-6 py-2 rounded-md font-bold transition-colors">
                Cargar Muestras Ahora
            </button>
        </div>
      ) : evaluations.length === 0 ? (
        <p className="text-zinc-500">Aún no hay muestras procesadas en el Golden Set.</p>
      ) : ("""

content = content.replace(old_buttons, new_buttons)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
