import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "addProduct({\n        banda_artista: banda,",
    "await addProduct({\n        banda_artista: banda,"
)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)
