import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# Remove the products listener
listener_start = content.find("  // Products Listener (Separated by role for Security Rules)")
listener_end = content.find("  // Deliveries Listener")

if listener_start != -1 and listener_end != -1:
    content = content[:listener_start] + content[listener_end:]

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

