import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# Remove the useEffect completely, and add the missing states + useApp
new_top_part = """export const AdminGoldenSet: React.FC = () => {
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
  };

  const executeClear = async () => {"""

old_regex = r"export const AdminGoldenSet: React\.FC = \(\) => \{.*?const executeClear = async \(\) => \{"

content = re.sub(old_regex, new_top_part, content, flags=re.DOTALL)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)

