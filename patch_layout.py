import re

with open('src/components/Layout.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Menu, X, Skull, Store, Camera, LayoutDashboard, LogOut, Settings, Bell, Info, Mail, HeartHandshake, CalendarDays, Shirt } from 'lucide-react';", "import { Menu, X, Skull, Store, Camera, LayoutDashboard, LogOut, Settings, Bell, Info, Mail, HeartHandshake, CalendarDays, Shirt, Package } from 'lucide-react';")

old_links = """    { name: 'Donar Prenda', path: user ? '/donar' : '/login?mode=register', icon: <Camera className="w-5 h-5" />, public: true },
    { name: 'Mis Donaciones', path: '/mis-donaciones', icon: <Shirt className="w-5 h-5" />, requiresAuth: true },
    { name: 'Panel Admin', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, role: 'administrador' },"""

new_links = """    { name: 'Donar Prenda', path: user ? '/donar' : '/login?mode=register', icon: <Camera className="w-5 h-5" />, public: true },
    { name: 'Mis Donaciones', path: '/mis-donaciones', icon: <Shirt className="w-5 h-5" />, requiresAuth: true },
    { name: 'Mis Órdenes', path: '/mis-ordenes', icon: <Package className="w-5 h-5" />, requiresAuth: true },
    { name: 'Panel Admin', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, role: 'administrador' },"""

content = content.replace(old_links, new_links)

with open('src/components/Layout.tsx', 'w') as f:
    f.write(content)

