import re

with open('src/pages/AdminOrders.tsx', 'r') as f:
    content = f.read()

# Add state import if missing (it should have useState since it's using useApp, let's verify)
# Add selectedImage state
old_fc = "export const AdminOrders: React.FC = () => {"
new_fc = """export const AdminOrders: React.FC = () => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);"""
content = content.replace(old_fc, new_fc)

# Replace image click
old_img = "<img src={order.paymentReceiptUrl} alt=\"Boleta\" className=\"w-12 h-12 object-cover rounded cursor-pointer border border-zinc-700\" onClick={() => window.open(order.paymentReceiptUrl, '_blank')} />"
new_img = "<img src={order.paymentReceiptUrl} alt=\"Boleta\" className=\"w-12 h-12 object-cover rounded cursor-pointer border border-zinc-700\" onClick={() => setSelectedImage(order.paymentReceiptUrl!)} />"
content = content.replace(old_img, new_img)

# Replace button click
old_btn = "<button onClick={() => window.open(order.paymentReceiptUrl, '_blank')} className=\"text-xs text-sabbath-400 font-bold hover:underline mt-1\">Ver completa</button>"
new_btn = "<button onClick={() => setSelectedImage(order.paymentReceiptUrl!)} className=\"text-xs text-sabbath-400 font-bold hover:underline mt-1\">Ver completa</button>"
content = content.replace(old_btn, new_btn)

# Add modal to return
old_return = "return (\n    <div className=\"space-y-6 max-w-6xl mx-auto\">"
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
      <div className="space-y-6 max-w-6xl mx-auto">"""
content = content.replace(old_return, new_return)

# Close fragment
old_end = "    </div>\n  );\n};"
new_end = "    </div>\n    </>\n  );\n};"
content = content.replace(old_end, new_end)

with open('src/pages/AdminOrders.tsx', 'w') as f:
    f.write(content)
