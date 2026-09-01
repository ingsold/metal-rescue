import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

# Add resetForm method after handleSubmit
reset_func = """
  const resetForm = () => {
    setBanda('');
    setTipo('Playera');
    setTalla('L');
    setOtraTalla('');
    setEstado('Vintage/Desgastado');
    setOrigen('Mercado Local');
    setEvento('');
    setPrecio('');
    setAdminDonorName('');
    setImageFiles([]);
    setImageUrls([]);
    setStatusMessage(null);
  };
"""

content = content.replace("  const handleSubmit = async (e: React.FormEvent) => {", reset_func + "\n  const handleSubmit = async (e: React.FormEvent) => {")

# Replace form content conditionally
old_form = """        <form onSubmit={handleSubmit} className="space-y-6">"""

new_form = """        {statusMessage?.type === 'success' ? (
          <div className="space-y-6">
            <div dangerouslySetInnerHTML={{ __html: statusMessage.html }} />
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/mis-donaciones')}
                className="flex-1 bg-sabbath-600 hover:bg-sabbath-500 text-white font-bold py-3 px-4 rounded-md flex justify-center items-center gap-2 transition-colors border border-sabbath-500 shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Ir a Mis Donaciones
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-sabbath-900 hover:bg-sabbath-800 text-white border border-sabbath-700 font-bold py-3 px-4 rounded-md flex justify-center items-center gap-2 transition-colors"
              >
                Donar otra prenda
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">"""

content = content.replace(old_form, new_form)

# End the conditional block instead of closing form normally
old_form_end = """              </div>
            )}
          </div>
        </form>"""

new_form_end = """              </div>
            )}
          </div>
        </form>
        )}"""

content = content.replace(old_form_end, new_form_end)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)
