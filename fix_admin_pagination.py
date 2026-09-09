import re

with open('src/pages/AdminPanel.tsx', 'r') as f:
    content = f.read()

new_bottom_pagination = """      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-zinc-300 font-medium">
          Página {currentPage}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={!hasMore || isLoading}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>"""

start_idx = content.find("{totalPages > 1 && (")
if start_idx != -1:
    end_idx = content.find("</div>\n      )}", start_idx)
    if end_idx != -1:
        content = content[:start_idx] + new_bottom_pagination + content[end_idx + len("</div>\n      )}")]
    else:
        print("End not found for AdminPanel")
else:
    print("Start not found for AdminPanel")

with open('src/pages/AdminPanel.tsx', 'w') as f:
    f.write(content)

