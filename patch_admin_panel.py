import re

with open('src/pages/AdminPanel.tsx', 'r') as f:
    content = f.read()

# 1. extract migrateLegacyProductsImages from useApp
content = content.replace(
    "const { products, deleteProduct, updateProductStatus } = useApp();",
    "const { products, deleteProduct, updateProductStatus, migrateLegacyProductsImages } = useApp();"
)

# 2. Add state for migration
content = content.replace(
    "const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);",
    "const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);\n  const [isMigrating, setIsMigrating] = useState(false);"
)

# 3. Add the button
old_button_area = """      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-sabbath-500" />
            ADMINISTRACIÓN DE CATÁLOGO
          </h1>
          <p className="text-zinc-400">Revisa, tasa y aprueba las donaciones pendientes de publicar.</p>
        </div>
      </div>"""

new_button_area = """      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-sabbath-500" />
            ADMINISTRACIÓN DE CATÁLOGO
          </h1>
          <p className="text-zinc-400">Revisa, tasa y aprueba las donaciones pendientes de publicar.</p>
        </div>
        <button
          onClick={async () => {
            setIsMigrating(true);
            try {
              const msg = await migrateLegacyProductsImages();
              alert(msg);
            } catch (e: any) {
              alert(e.message);
            } finally {
              setIsMigrating(false);
            }
          }}
          disabled={isMigrating}
          className="bg-sabbath-800 hover:bg-sabbath-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors border border-sabbath-600"
        >
          {isMigrating ? 'Migrando...' : 'Migrar Imágenes Antiguas'}
        </button>
      </div>"""

content = content.replace(old_button_area, new_button_area)

with open('src/pages/AdminPanel.tsx', 'w') as f:
    f.write(content)

