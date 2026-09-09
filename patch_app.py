import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import { Cart } from './pages/Cart';", "import { Cart } from './pages/Cart';\nimport { AdminRoute } from './components/AdminRoute';\nimport { GoldenSetRoute } from './components/GoldenSetRoute';")

old_routes = """            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin-pendientes" element={<AdminPanel />} />
            <Route path="admin-golden-set" element={<AdminGoldenSet />} />
            <Route path="admin-donaciones" element={<AdminDonations />} />
            <Route path="admin-ordenes" element={<AdminOrders />} />
            <Route path="admin-usuarios" element={<AdminUsers />} />
            <Route path="admin-toques" element={<ManageEvents />} />
            <Route path="admin-entidades" element={<ManageAllies />} />
            <Route path="admin-entregas" element={<ManageDeliveries />} />"""

new_routes = """            {/* Admin Protected Routes */}
            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="admin-pendientes" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="admin-golden-set" element={<GoldenSetRoute><AdminGoldenSet /></GoldenSetRoute>} />
            <Route path="admin-donaciones" element={<AdminRoute><AdminDonations /></AdminRoute>} />
            <Route path="admin-ordenes" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="admin-usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="admin-toques" element={<AdminRoute><ManageEvents /></AdminRoute>} />
            <Route path="admin-entidades" element={<AdminRoute><ManageAllies /></AdminRoute>} />
            <Route path="admin-entregas" element={<AdminRoute><ManageDeliveries /></AdminRoute>} />"""

content = content.replace(old_routes, new_routes)

with open('src/App.tsx', 'w') as f:
    f.write(content)
