import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# I see the problem. filteredEvaluations is inside exportToCSV!
target = r"const exportToCSV = \(\) => \{\n\s*const headers = \[\n\s*'Muestra ID',\n\s*'Fecha Evaluación',\n\s*'Banda',\n\s*'Tipo',\n\s*'Estado',\n\s*'Origen',\n\s*'Evento',\n\s*'Precio Donante',\n\s*'Precio Sugerido IA',\n\s*'Precio Final',\n\s*'Autenticidad IA',\n\s*'Confianza %',\n\s*'Razonamiento'\n\s*\];\n\s*const escapeCSV = \(str: any\) => \{\n\s*if \(str === null \|\| str === undefined\) return '';\n\s*const s = String\(str\)\.replace\(/\"/g, '\"\"'\);\n\s*return `\"$\{s\}\"`;\n\s*\};\n\s*const filteredEvaluations = evaluations\.filter\(ev => \{"

import re
match = re.search(r"const exportToCSV = \(\) => \{.*?(?=const filteredEvaluations = evaluations\.filter)", content, re.DOTALL)
if match:
    pass

# We can just extract filteredEvaluations outside of exportToCSV.
