import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Cart } from './pages/Cart';", "import { Cart } from './pages/Cart';\nimport { MyOrders } from './pages/MyOrders';")

content = content.replace(
    "<Route path=\"cart\" element={<Cart />} />",
    "<Route path=\"cart\" element={<Cart />} />\n            <Route path=\"mis-ordenes\" element={<MyOrders />} />"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
