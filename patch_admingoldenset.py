import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';", "import { collection, getDocs, query, orderBy } from 'firebase/firestore';\nimport { db } from '../lib/firebase';")
content = content.replace("        const db = getFirestore();\n", "")

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
