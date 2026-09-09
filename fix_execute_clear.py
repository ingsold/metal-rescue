import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

old_func = """  const executeClear = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setLoadingAction('fetch');
    setActionMessage(null);"""

new_func = """  const executeClear = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setLoadingAction('clear');
    setActionMessage(null);"""

content = content.replace(old_func, new_func)

old_btn = """              <button onClick={executeClear} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold transition-colors">Sí, Limpiar BD</button>"""
new_btn = """              <button onClick={executeClear} disabled={isLoading} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded font-bold transition-colors">
                {loadingAction === 'clear' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loadingAction === 'clear' ? 'Limpiando...' : 'Sí, Limpiar BD'}
              </button>"""
content = content.replace(old_btn, new_btn)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
