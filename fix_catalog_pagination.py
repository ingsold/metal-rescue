import re

with open('src/pages/Catalog.tsx', 'r') as f:
    content = f.read()

old_bottom_pagination = r"\{\s*totalPages > 1 && \([\s\S]*?\{\/\* Pagination Controls \*\/\)[\s\S]*?</div>\s*\)\}"

new_bottom_pagination = """      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
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
      </div>"""

# I should use a more robust replacement approach for Catalog bottom pagination.
start_idx = content.find("{totalPages > 1 && (")
end_idx = content.find("</div>\n      )}\n\n      {filteredProducts.length === 0")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_bottom_pagination + content[end_idx + len("</div>\n      )}")]
else:
    print("Catalog bottom pagination not found perfectly, attempting regex.")
    content = re.sub(r"\{\s*totalPages > 1 && \([\s\S]*?<\/div>\s*\)\}", new_bottom_pagination, content)

with open('src/pages/Catalog.tsx', 'w') as f:
    f.write(content)

