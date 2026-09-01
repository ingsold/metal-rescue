import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# Replace states
old_states = """  const [evaluations, setEvaluations] = useState<GoldenSetEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);"""

new_states = """  const [evaluations, setEvaluations] = useState<GoldenSetEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);"""

content = content.replace(old_states, new_states)

# Replace clearData logic
old_clear = """  const clearData = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar TODAS las evaluaciones del Golden Set y TODAS las prendas registradas? Las imágenes también se eliminarán. Esto no se puede deshacer y es solo para reiniciar el experimento.")) {
      setIsLoading(true);
      try {
        // Eliminar Golden Set
        const evalsSnap = await getDocs(collection(db, 'evaluaciones_golden_set'));
        const evalsPromises = evalsSnap.docs.map(d => deleteDoc(doc(db, 'evaluaciones_golden_set', d.id)));
        await Promise.all(evalsPromises);
        
        // Eliminar Productos
        const productsSnap = await getDocs(collection(db, 'products'));
        const productsPromises = productsSnap.docs.map(d => deleteDoc(doc(db, 'products', d.id)));
        await Promise.all(productsPromises);

        setEvaluations([]);
        alert("Limpieza de Base de Datos completada exitosamente.");
      } catch(e) {
        console.error("Error limpiando BD:", e);
        alert("Error al limpiar la base de datos. Verifica consola. (Asegúrate de ser Administrador)");
      } finally {
        setIsLoading(false);
      }
    }
  };"""

new_clear = """  const executeClear = async () => {
    setShowConfirm(false);
    setIsLoading(true);
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

      setEvaluations([]);
      setActionMessage({ type: 'success', text: "Limpieza de Base de Datos completada exitosamente." });
      
      setTimeout(() => setActionMessage(null), 5000);
    } catch(e) {
      console.error("Error limpiando BD:", e);
      setActionMessage({ type: 'error', text: "Error al limpiar la base de datos. Asegúrate de ser Administrador y revisa la consola." });
    } finally {
      setIsLoading(false);
    }
  };"""

content = content.replace(old_clear, new_clear)

# Update onClick handler
content = content.replace("onClick={clearData}", "onClick={() => setShowConfirm(true)}")

# Note: There's an alert in exportToCSV as well, let's fix it while we are at it.
old_export_alert = """  const exportToCSV = () => {
    if (evaluations.length === 0) {
      alert('No hay evaluaciones para exportar.');
      return;
    }"""

new_export_alert = """  const exportToCSV = () => {
    if (evaluations.length === 0) {
      setActionMessage({ type: 'error', text: 'No hay evaluaciones para exportar.' });
      return;
    }"""

content = content.replace(old_export_alert, new_export_alert)


# Add UI rendering inside the return
return_statement = """  return (
    <div className=" bg-sabbath-900 border border-sabbath-800 p-6 rounded-xl">"""

new_render = """  return (
    <div className=" bg-sabbath-900 border border-sabbath-800 p-6 rounded-xl">
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-sabbath-900 border border-red-500/50 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-red-500 mb-2">¡Advertencia!</h3>
            <p className="text-zinc-300 mb-6">¿Estás seguro de que quieres eliminar TODAS las evaluaciones del Golden Set y TODAS las prendas registradas? Esto no se puede deshacer y es solo para reiniciar el experimento.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-sabbath-800 hover:bg-sabbath-700 text-white rounded font-medium transition-colors">Cancelar</button>
              <button onClick={executeClear} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold transition-colors">Sí, Limpiar BD</button>
            </div>
          </div>
        </div>
      )}

      {actionMessage && (
        <div className={`mb-6 p-4 rounded-lg border ${actionMessage.type === 'success' ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-red-900/50 border-red-500 text-red-200'}`}>
          {actionMessage.text}
        </div>
      )}"""

content = content.replace(return_statement, new_render)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
