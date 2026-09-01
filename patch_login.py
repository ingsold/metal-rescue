import re

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

# Replace import { useNavigate } from 'react-router-dom';
# with import { useNavigate, useLocation } from 'react-router-dom';
content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, useLocation } from 'react-router-dom';")

# Add useLocation and useEffect logic
hook_spot = "  const navigate = useNavigate();\n"
new_hook = """  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'register') {
      setMode('register');
    }
  }, [location]);\n"""

content = content.replace(hook_spot, new_hook)

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
