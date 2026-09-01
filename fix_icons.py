import re

with open('src/pages/Transparency.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import { HandHeart, Navigation, Phone, Mail, Building2 } from 'lucide-react';", 
    "import { HandHeart, Navigation, Phone, Mail, Building2, ChevronLeft, ChevronRight } from 'lucide-react';"
)

# Update arrows
content = content.replace("←", "<ChevronLeft className=\"w-5 h-5\" />")
content = content.replace("→", "<ChevronRight className=\"w-5 h-5\" />")

with open('src/pages/Transparency.tsx', 'w') as f:
    f.write(content)
