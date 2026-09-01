import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

# Update the cursor-pointer part
content = content.replace(
    'className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors relative overflow-hidden ${',
    'className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors relative overflow-hidden ${isSubmitting ? \'cursor-wait opacity-60\' : \'cursor-pointer\'} ${'
)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)
