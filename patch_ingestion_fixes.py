import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

# Fix the div click handler
# Find: onClick={handleImageClick}\n                disabled={isSubmitting}
# Replace: onClick={isSubmitting ? undefined : handleImageClick}
# And remove the disabled={isSubmitting} on the div since divs don't support disabled
content = content.replace(
    'onClick={handleImageClick}\n                disabled={isSubmitting}',
    'onClick={isSubmitting ? undefined : handleImageClick}'
)

# Also apply disabled={isSubmitting} to the remove image button
# Find: onClick={(e) => removeImage(idx, e)}
# Replace: onClick={(e) => removeImage(idx, e)} disabled={isSubmitting}
content = content.replace(
    'onClick={(e) => removeImage(idx, e)}',
    'onClick={(e) => removeImage(idx, e)}\n                      disabled={isSubmitting}'
)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)
