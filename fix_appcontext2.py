import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# I apparently failed to actually remove the products listener in the previous attempt because of whitespace or exact match issues.
# Let's use regex to be safe.
content = re.sub(r"// Products Listener \(Separated by role for Security Rules\)[\s\S]*?// Deliveries Listener", "// Deliveries Listener", content)

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

