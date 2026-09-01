import re

with open('src/components/Layout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { useApp } from '../context/AppContext';",
    "import { useApp } from '../context/AppContext';\nimport { useToast } from '../context/ToastContext';"
)

with open('src/components/Layout.tsx', 'w') as f:
    f.write(content)
