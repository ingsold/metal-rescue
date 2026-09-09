import re

with open('src/pages/MyOrders.tsx', 'r') as f:
    content = f.read()

# Replace orders with myOrders in rendering
content = content.replace("orders.length === 0 ?", "myOrders.length === 0 ?")
content = content.replace("orders.map(order =>", "myOrders.map(order =>")

# Add myOrders calculation and selectedImage state
old_if_user = "if (!user) return null;"
new_if_user = """  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!user) return null;

  const myOrders = orders.filter(o => o.userId === user.id);"""
content = content.replace(old_if_user, new_if_user)

# Replace image click
old_img = "<img src={order.paymentReceiptUrl} alt=\"Boleta\" className=\"w-16 h-16 object-cover rounded border border-sabbath-800 cursor-pointer\" onClick={() => window.open(order.paymentReceiptUrl, '_blank')} />"
new_img = "<img src={order.paymentReceiptUrl} alt=\"Boleta\" className=\"w-16 h-16 object-cover rounded border border-sabbath-800 cursor-pointer\" onClick={() => setSelectedImage(order.paymentReceiptUrl!)} />"
content = content.replace(old_img, new_img)

# Add Modal
old_return = "return (\n    <div className=\"max-w-4xl mx-auto\">"
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
      <div className="max-w-4xl mx-auto">"""
content = content.replace(old_return, new_return)

# Close fragment
old_end = "    </div>\n  );\n};"
new_end = "    </div>\n    </>\n  );\n};"
content = content.replace(old_end, new_end)

with open('src/pages/MyOrders.tsx', 'w') as f:
    f.write(content)
