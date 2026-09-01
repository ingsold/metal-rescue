import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { collection, getDocs, query, orderBy } from 'firebase/firestore';", "import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';")

content = content.replace("import { Download, Beaker } from 'lucide-react';", "import { Download, Beaker, Trash2 } from 'lucide-react';")


clear_func = """
  const clearData = async () => {
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
  };
"""

content = content.replace("  const exportToCSV = () => {", clear_func + "\n  const exportToCSV = () => {")

buttons_block_old = """        <button
          onClick={exportToCSV}
          disabled={isLoading || evaluations.length === 0}
          className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar Experimento para Google Sheets (.CSV)
        </button>"""

buttons_block_new = """        <div className="flex gap-2">
          <button
            onClick={clearData}
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
        </div>"""

content = content.replace(buttons_block_old, buttons_block_new)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
