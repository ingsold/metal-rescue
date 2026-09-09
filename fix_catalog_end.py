with open('src/pages/Catalog.tsx', 'r') as f:
    content = f.read()

end_html = """      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className="p-2 bg-sabbath-900 border border-sabbath-800 rounded-md text-zinc-400 hover:text-white hover:border-sabbath-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-zinc-300 font-medium">
          Página {currentPage}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={!hasMore || isLoading}
          className="p-2 bg-sabbath-900 border border-sabbath-800 rounded-md text-zinc-400 hover:text-white hover:border-sabbath-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
          <p className="text-zinc-400 text-lg">No hay prendas que coincidan con estos filtros.</p>
        </div>
      )}
    </div>
  );
};"""

start_idx = content.find("      {/* Pagination Controls */}")
if start_idx != -1:
    content = content[:start_idx] + end_html
else:
    print("Start not found")

with open('src/pages/Catalog.tsx', 'w') as f:
    f.write(content)

