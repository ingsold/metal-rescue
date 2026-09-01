import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

replacement = """  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Dispatch custom event for UI to pick up
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('firestore-error', { detail: errInfo });
    window.dispatchEvent(event);
  }
  throw new Error(JSON.stringify(errInfo));"""

content = content.replace("  console.error('Firestore Error: ', JSON.stringify(errInfo));\n  throw new Error(JSON.stringify(errInfo));", replacement)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
