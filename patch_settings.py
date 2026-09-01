with open('src/pages/Settings.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useApp } from '../context/AppContext';", "import { useApp } from '../context/AppContext';\nimport { useToast } from '../context/ToastContext';")

content = content.replace("const { user, updateProfile } = useApp();", "const { user, updateProfile } = useApp();\n  const { showToast } = useToast();")

# Remove local success/error and use toast for profile updates
content = content.replace("setSuccessMsg('Perfil actualizado correctamente.');", "showToast('Perfil actualizado correctamente.', 'success');\n      setSuccessMsg(null);")
content = content.replace("setError(err.message || 'Error al actualizar el perfil.');", "showToast(err.message || 'Error al actualizar el perfil.', 'error');")

# Remove local success/error and use toast for password updates
content = content.replace("setPasswordSuccess('Contraseña actualizada correctamente.');", "showToast('Contraseña actualizada correctamente.', 'success');\n        setPasswordSuccess(null);")
content = content.replace("setPasswordError('Las contraseñas no coinciden.');", "showToast('Las contraseñas no coinciden.', 'error');")
content = content.replace("setPasswordError('La contraseña es demasiado débil.');", "showToast('La contraseña es demasiado débil.', 'error');")
content = content.replace("setPasswordError('No hay usuario autenticado.');", "showToast('No hay usuario autenticado.', 'error');")
content = content.replace("setPasswordError('Por seguridad, debes cerrar sesión y volver a ingresar para cambiar tu contraseña.');", "showToast('Por seguridad, debes cerrar sesión y volver a ingresar para cambiar tu contraseña.', 'error');")
content = content.replace("setPasswordError(err.message || 'Error al actualizar la contraseña.');", "showToast(err.message || 'Error al actualizar la contraseña.', 'error');")

with open('src/pages/Settings.tsx', 'w') as f:
    f.write(content)
