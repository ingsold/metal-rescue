import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

old_auth = "export const auth = getAuth();"
new_auth = """import { setPersistence, browserLocalPersistence } from 'firebase/auth';
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);"""

content = content.replace(old_auth, new_auth)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
