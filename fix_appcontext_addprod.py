import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

target = r"""    const id = `p_${Date.now()}`;
    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch \(e\) \{
      handleFirestoreError\(e, OperationType.CREATE, 'products'\);
    \}
  \};"""

repl = """    const id = `p_${Date.now()}`;
    try {
      await setDoc(doc(db, 'products', id), newProduct);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'products');
      throw e;
    }
  };"""

content = re.sub(target, repl, content)

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)
