with open('src/components/Layout.tsx', 'r') as f:
    content = f.read()

old_block = """    { 
      name: 'Panel Admin', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      role: 'administrador',
      subLinks: [
        { name: 'Dashboard Principal', path: '/admin' },
        { name: 'Prendas Pendientes', path: '/admin-pendientes' },
        { name: 'Experimento Golden Set', path: '/admin-golden-set' },
        { name: 'Prendas Donadas', path: '/admin-donaciones' },
        { name: 'Órdenes Pendientes', path: '/admin-ordenes' },
        { name: 'Panel Usuarios', path: '/admin-usuarios' },
        { name: 'Gestión Toques', path: '/admin-toques' }
      ]
    },"""

# Note: The output from grep showed:
#    { 
#      name: 'Panel Admin', 
#      icon: <LayoutDashboard className="w-5 h-5" />, 
#      role: 'administrador',
#      subLinks: [ ...

# Let's do a more robust replacement using regex.
import re
new_content = re.sub(
    r"\{\s*name:\s*'Panel Admin',\s*icon: <LayoutDashboard className=\"w-5 h-5\" />,\s*role: 'administrador',\s*subLinks: \[\s*\{ name: 'Dashboard Principal', path: '/admin' \},\s*\{ name: 'Prendas Pendientes', path: '/admin-pendientes' \},\s*\{ name: 'Experimento Golden Set', path: '/admin-golden-set' \},\s*\{ name: 'Prendas Donadas', path: '/admin-donaciones' \},\s*\{ name: 'Órdenes Pendientes', path: '/admin-ordenes' \},\s*\{ name: 'Panel Usuarios', path: '/admin-usuarios' \},\s*\{ name: 'Gestión Toques', path: '/admin-toques' \}\s*\]\s*\},",
    "{ name: 'Panel Admin', path: '/admin', icon: <LayoutDashboard className=\"w-5 h-5\" />, role: 'administrador' },",
    content
)

with open('src/components/Layout.tsx', 'w') as f:
    f.write(new_content)
