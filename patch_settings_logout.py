import re

with open('src/pages/Settings.tsx', 'r') as f:
    content = f.read()

# Add logout to useApp destructuring
content = content.replace(
    "const { user, updateProfile } = useApp();", 
    "const { user, updateProfile, logout } = useApp();"
)

# Update the catch block for requires-recent-login
old_catch = """    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        showToast('Por seguridad, debes cerrar sesión y volver a ingresar para cambiar tu contraseña.', 'error');
      } else {"""

new_catch = """    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        showToast('Por seguridad, cerraremos tu sesión. Vuelve a ingresar para cambiar tu contraseña.', 'error');
        setTimeout(() => {
          logout();
        }, 3000);
      } else {"""

content = content.replace(old_catch, new_catch)

with open('src/pages/Settings.tsx', 'w') as f:
    f.write(content)
