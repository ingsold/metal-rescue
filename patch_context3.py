import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# 4. Remove implementation of migrateLegacyEvaluations
content = re.sub(r'^\s*const migrateLegacyEvaluations = async \(\): Promise<string> => \{.*?(?=^\s*const updateProductStatus)/sm', '', content, flags=re.MULTILINE | re.DOTALL)

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

