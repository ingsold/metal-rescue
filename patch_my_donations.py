import re

with open('src/pages/MyDonations.tsx', 'r') as f:
    content = f.read()

# Add useEffect and useNavigate
content = content.replace("import React from 'react';", "import React, { useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';")

# Add isLoading
content = content.replace("const { products, user, deleteProduct } = useApp();", "const { products, user, deleteProduct, isLoading } = useApp();")

# Add hook and logic
hook = """  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?mode=register');
    }
  }, [user, isLoading, navigate]);
"""

content = content.replace("  const [deletingId, setDeletingId] = React.useState<string | null>(null);", "  const [deletingId, setDeletingId] = React.useState<string | null>(null);\n" + hook)

new_return = """  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-500"></div></div>;
  }

  if (!user) {
    return null;
  }

  return ("""

content = content.replace("  return (", new_return, 1)

with open('src/pages/MyDonations.tsx', 'w') as f:
    f.write(content)
