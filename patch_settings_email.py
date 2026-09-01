import re

with open('src/pages/Settings.tsx', 'r') as f:
    content = f.read()

content = content.replace("value={user.email}", "value={user.email || ''}")

with open('src/pages/Settings.tsx', 'w') as f:
    f.write(content)
