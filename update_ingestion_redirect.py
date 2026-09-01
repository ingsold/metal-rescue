import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

content = content.replace("navigate('/login');", "navigate('/login?mode=register');")

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)
