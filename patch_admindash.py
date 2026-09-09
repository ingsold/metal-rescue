import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useApp } from '../context/AppContext';")
content = content.replace("export const AdminDashboard: React.FC = () => {", "export const AdminDashboard: React.FC = () => {\n  const { user } = useApp();")

old_links = """    { to: "/admin-usuarios", icon: <Users className="w-8 h-8 mb-4 text-yellow-400" />, title: "Control de Usuarios", desc: "Administración de roles y estados" },
    { to: "/admin-golden-set", icon: <Beaker className="w-8 h-8 mb-4 text-green-400" />, title: "Experimento Golden Set", desc: "Gestión y exportación de muestras IA (TFM)" },
  ];"""

new_links = """    { to: "/admin-usuarios", icon: <Users className="w-8 h-8 mb-4 text-yellow-400" />, title: "Control de Usuarios", desc: "Administración de roles y estados" },
  ];

  if (user?.email === 'admin@metalrescue.org') {
    adminLinks.push({ to: "/admin-golden-set", icon: <Beaker className="w-8 h-8 mb-4 text-green-400" />, title: "Experimento Golden Set", desc: "Gestión y exportación de muestras IA (TFM)" });
  }"""

content = content.replace(old_links, new_links)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
