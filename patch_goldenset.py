with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const { migrateLegacyEvaluations } = useApp();\n", "")

button_html = """          <button
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

content = content.replace(button_html, "")

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)

