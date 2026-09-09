import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace("import { Download, Beaker, Trash2, Database, RefreshCw } from 'lucide-react';", "import { Download, Beaker, Trash2, Database, RefreshCw, Loader2 } from 'lucide-react';")

# 2. State
content = content.replace("const [isLoading, setIsLoading] = useState(false);", "const [isLoading, setIsLoading] = useState(false);\n  const [loadingAction, setLoadingAction] = useState<string | null>(null);")

# 3. fetchEvals
content = content.replace("setIsLoading(true);", "setIsLoading(true);\n    setLoadingAction('fetch');")
content = content.replace("setIsLoading(false);", "setIsLoading(false);\n      setLoadingAction(null);")

# 4. executeClear
content = content.replace("const executeClear = async () => {\n    setShowConfirm(false);\n    setIsLoading(true);\n    setActionMessage(null);", "const executeClear = async () => {\n    setShowConfirm(false);\n    setIsLoading(true);\n    setLoadingAction('clear');\n    setActionMessage(null);")

# 5. sync function (in onClick)
sync_old = """          <button
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
          </button>"""

sync_new = """          <button
            onClick={async () => {
              setIsLoading(true);
              setLoadingAction('sync');
              try {
                const msg = await migrateLegacyEvaluations();
                alert(msg);
                if (dataLoaded) await fetchEvals();
              } catch(e) {
                alert("Error al migrar: " + e);
              } finally {
                setIsLoading(false);
                setLoadingAction(null);
              }
            }}
            disabled={isLoading}
            className="bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Sincronizar Data Antigua"
          >
            {loadingAction === 'sync' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {loadingAction === 'sync' ? 'Sincronizando...' : 'Sincronizar Data'}
          </button>"""
content = content.replace(sync_old, sync_new)

# 6. fetch button (Cargar Data)
fetch_old = """          <button
            onClick={fetchEvals}
            disabled={isLoading}
            className="bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Cargar datos de la BD"
          >
            <Database className="w-4 h-4" />
            Cargar Data
          </button>"""

fetch_new = """          <button
            onClick={fetchEvals}
            disabled={isLoading}
            className="bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Cargar datos de la BD"
          >
            {loadingAction === 'fetch' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            {loadingAction === 'fetch' ? 'Cargando...' : 'Cargar Data'}
          </button>"""
content = content.replace(fetch_old, fetch_new)

# 7. Limpiar BD button
clear_old = """          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Limpiar base de datos"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar BD
          </button>"""

clear_new = """          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
            title="Limpiar base de datos"
          >
            {loadingAction === 'clear' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {loadingAction === 'clear' ? 'Limpiando...' : 'Limpiar BD'}
          </button>"""
content = content.replace(clear_old, clear_new)

# 8. CSV export update
csv_headers_old = """    const headers = [
      'ID Muestra',
      'Fecha',
      'Banda/Artista',
      'Tipo Prenda',
      'Estado',
      'Origen Adquisición',
      'Evento Origen',
      'Precio Donante (Q)',
      'Precio IA (Q)',
      'Autenticidad IA',
      'Confianza IA (%)',
      'Razonamiento'
    ];"""

csv_headers_new = """    const headers = [
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
    ];"""
content = content.replace(csv_headers_old, csv_headers_new)

csv_rows_old = """      escapeCSV(ev.precio_estimado_donante),
      escapeCSV(ev.precio_sugerido_ia),
      escapeCSV(ev.autenticidad_ia),"""
csv_rows_new = """      escapeCSV(ev.precio_estimado_donante),
      escapeCSV(ev.precio_sugerido_ia),
      escapeCSV(ev.precio_final_aprobado),
      escapeCSV(ev.autenticidad_ia),"""
content = content.replace(csv_rows_old, csv_rows_new)

# 9. Table headers update
th_old = """                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-right">Precio IA</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-center">Confianza</th>"""
th_new = """                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-right">Precio IA</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-right text-yellow-400">Precio Final</th>
                <th className="px-4 py-3 font-bold border-b border-sabbath-800 text-center">Confianza</th>"""
content = content.replace(th_old, th_new)

# 10. Table rows update
td_old = """                  <td className="px-4 py-3 text-right font-bold text-green-400">Q{ev.precio_sugerido_ia}</td>
                  <td className="px-4 py-3 text-center">"""
td_new = """                  <td className="px-4 py-3 text-right font-bold text-green-400">Q{ev.precio_sugerido_ia}</td>
                  <td className="px-4 py-3 text-right font-bold text-yellow-400">{ev.precio_final_aprobado ? `Q${ev.precio_final_aprobado}` : '-'}</td>
                  <td className="px-4 py-3 text-center">"""
content = content.replace(td_old, td_new)

# 11. Large Cargar button inside the empty state
empty_btn_old = """            <button onClick={fetchEvals} className="bg-sabbath-600 hover:bg-sabbath-500 text-white px-6 py-2 rounded-md font-bold transition-colors">
                Cargar Muestras Ahora
            </button>"""
empty_btn_new = """            <button onClick={fetchEvals} disabled={isLoading} className="bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-2 rounded-md font-bold transition-colors flex items-center justify-center gap-2 mx-auto">
                {loadingAction === 'fetch' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loadingAction === 'fetch' ? 'Cargando...' : 'Cargar Muestras Ahora'}
            </button>"""
content = content.replace(empty_btn_old, empty_btn_new)


with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
