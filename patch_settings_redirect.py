import re

with open('src/pages/Settings.tsx', 'r') as f:
    content = f.read()

if "useNavigate" not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';")

content = content.replace("const { user, updateProfile, logout } = useApp();", "const { user, updateProfile, logout } = useApp();\n  const navigate = useNavigate();")

new_catch = """    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        showToast('Por seguridad, cerraremos tu sesión. Vuelve a ingresar para cambiar tu contraseña.', 'error');
        setTimeout(async () => {
          await logout();
          navigate('/login');
        }, 3000);
      } else {"""

content = re.sub(r"    } catch \(err: any\) \{\n      if \(err.code === 'auth/requires-recent-login'\) \{\n        showToast\('Por seguridad, cerraremos tu sesión. Vuelve a ingresar para cambiar tu contraseña.', 'error'\);\n        setTimeout\(\(\) => \{\n          logout\(\);\n        \}, 3000\);\n      \} else \{", new_catch, content, flags=re.MULTILINE)

with open('src/pages/Settings.tsx', 'w') as f:
    f.write(content)
