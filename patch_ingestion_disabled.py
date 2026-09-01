import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

# Add disabled={isSubmitting} to inputs
content = re.sub(
    r'(<input[^>]*?)(\s*(?:type="text"|type="number"|required|value=|onChange=|placeholder=|className=)[^>]*?)>',
    r'\1 disabled={isSubmitting}\2>',
    content
)

# Add disabled={isSubmitting} to selects
content = re.sub(
    r'(<select[^>]*?)(\s*(?:required|value=|onChange=|className=)[^>]*?)>',
    r'\1 disabled={isSubmitting}\2>',
    content
)

# Add disabled={isSubmitting} to handleImageClick button
content = content.replace(
    'onClick={handleImageClick}',
    'onClick={handleImageClick}\n                disabled={isSubmitting}'
)

# Add disabled={isSubmitting} to removeImage button
content = content.replace(
    'onClick={() => removeImage(index)}',
    'onClick={() => removeImage(index)}\n                        disabled={isSubmitting}'
)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)
