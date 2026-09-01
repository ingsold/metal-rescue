import re

with open('src/pages/AdminPanel.tsx', 'r') as f:
    content = f.read()

# I will find the end of the Pagination Items Per Page Header
# and just replace everything after it with a known good state.

match = re.search(r'\{filteredProducts\.length > 0 && \([\s\S]*?\{perPageOptions\.map[\s\S]*?<\/select>\n\s*<\/div>\n\s*\)\}', content)

if match:
    start_idx = match.end()
    rest = content[start_idx:]
    
    # We want to extract the map loop
    map_match = re.search(r'\{currentProducts\.map[\s\S]*?\}\)}', rest)
    if map_match:
        map_content = map_match.group(0)
    else:
        map_content = "{currentProducts.map((product) => { return null; })}"
        
    empty_states = """
        {pendingProducts.length > 0 && currentProducts.length === 0 && (
          <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
            <ShieldAlert className="w-16 h-16 text-zinc-500 mx-auto mb-4 opacity-50" />
            <p className="text-zinc-400 text-xl font-medium">No hay coincidencias.</p>
            <p className="text-zinc-500 mt-2">Prueba ajustando los filtros de búsqueda.</p>
          </div>
        )}

        {pendingProducts.length === 0 && (
          <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
            <ShieldAlert className="w-16 h-16 text-sabbath-500 mx-auto mb-4 opacity-50" />
            <p className="text-zinc-400 text-xl font-medium">Bandeja limpia.</p>
            <p className="text-zinc-500 mt-2">No hay prendas pendientes de revisión.</p>
          </div>
        )}
"""

    pagination = """
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-sabbath-900 border border-sabbath-800 rounded-md text-zinc-400 hover:text-white hover:border-sabbath-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md font-bold text-sm transition-colors ${
                  currentPage === page
                    ? 'bg-sabbath-600 text-white border border-sabbath-500'
                    : 'bg-sabbath-900 text-zinc-400 border border-sabbath-800 hover:border-sabbath-500 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-sabbath-900 border border-sabbath-800 rounded-md text-zinc-400 hover:text-white hover:border-sabbath-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
"""
    
    final_content = content[:start_idx] + '\n      <div className="space-y-6">\n' + map_content + empty_states + '      </div>\n' + pagination + '\n      <AdminGoldenSet />\n    </div>\n  );\n};\n'
    
    with open('src/pages/AdminPanel.tsx', 'w') as f:
        f.write(final_content)
else:
    print("Could not match start")
