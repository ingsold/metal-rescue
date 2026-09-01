import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { Transparency } from './pages/Transparency';",
    "import { Transparency } from './pages/Transparency';\nimport { ManageAllies } from './pages/ManageAllies';\nimport { ManageDeliveries } from './pages/ManageDeliveries';"
)

routes_target = '<Route path="admin-toques" element={<ManageEvents />} />'
new_routes = routes_target + """
            <Route path="admin-entidades" element={<ManageAllies />} />
            <Route path="admin-entregas" element={<ManageDeliveries />} />"""
content = content.replace(routes_target, new_routes)

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    admin_content = f.read()

import_target = "import { ShieldAlert, Users, Package, Calendar, Beaker, CheckSquare, Settings } from 'lucide-react';"
new_import = "import { ShieldAlert, Users, Package, Calendar, Beaker, CheckSquare, Settings, HeartHandshake, Building2 } from 'lucide-react';"
admin_content = admin_content.replace(import_target, new_import)

links_target = """    { to: "/admin-ordenes", icon: <Package className="w-8 h-8 mb-4 text-blue-400" />, title: "Gestión de Órdenes", desc: "Preparar pedidos de los usuarios" },
    { to: "/admin-donaciones", icon: <Package className="w-8 h-8 mb-4 text-purple-400" />, title: "Donaciones de Impacto", desc: "Registro de entregas a refugios" },"""
new_links = """    { to: "/admin-ordenes", icon: <Package className="w-8 h-8 mb-4 text-blue-400" />, title: "Gestión de Órdenes", desc: "Preparar pedidos de los usuarios" },
    { to: "/admin-donaciones", icon: <Package className="w-8 h-8 mb-4 text-purple-400" />, title: "Mis Prendas Subidas", desc: "Ver prendas que he publicado como admin" },
    { to: "/admin-entregas", icon: <HeartHandshake className="w-8 h-8 mb-4 text-emerald-400" />, title: "Registro de Entregas", desc: "Registro de entregas a refugios y galerías" },
    { to: "/admin-entidades", icon: <Building2 className="w-8 h-8 mb-4 text-teal-400" />, title: "Entidades Apoyadas", desc: "Directorio de refugios y organizaciones" },"""
admin_content = admin_content.replace(links_target, new_links)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(admin_content)
