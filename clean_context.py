import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# Remove migrateLegacyProductsImages block
start1 = content.find("const migrateLegacyProductsImages = async (): Promise<string> => {")
end1 = content.find("const migrateLegacyEvaluations = async (): Promise<string> => {")

if start1 != -1 and end1 != -1:
    content = content[:start1] + content[end1:]

# Remove migrateLegacyEvaluations block
start2 = content.find("const migrateLegacyEvaluations = async (): Promise<string> => {")
end2 = content.find("const updateProductStatus = async ")

if start2 != -1 and end2 != -1:
    content = content[:start2] + content[end2:]

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)
