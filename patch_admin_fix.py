import re

with open('src/pages/AdminOrders.tsx', 'r') as f:
    content = f.read()

# Replace the unmatched end
content = content.replace("    </div>\n    </>\n  );\n};", "    </div>\n  );\n};")

# Add the correct modal to the top of the return
old_return = 'return (\n    <div className="space-y-8">'
new_return = """return (
    <>
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            onClick={() => setSelectedImage(null)}
          >
            <XCircle className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Boleta Ampliada" 
            className="max-w-full max-h-full object-contain rounded" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
      <div className="space-y-8">"""
content = content.replace(old_return, new_return)

# Close fragment
content = content.replace("    </div>\n  );\n};", "    </div>\n    </>\n  );\n};")

with open('src/pages/AdminOrders.tsx', 'w') as f:
    f.write(content)
