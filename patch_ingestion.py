import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

# Fix React import
content = content.replace("import React, { useState, useRef } from 'react';", "import React, { useState, useRef, useEffect } from 'react';")

# Add isLoading to useApp extraction
content = content.replace("const { addProduct, addGoldenSetEvaluation, user } = useApp();", "const { addProduct, addGoldenSetEvaluation, user, isLoading } = useApp();")

# Add useEffect for redirect
hook = """
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
"""
content = content.replace("const fileInputRef = useRef<HTMLInputElement>(null);", "const fileInputRef = useRef<HTMLInputElement>(null);\n" + hook)

# Wait, we should also return null if loading or not user to avoid flashing
# Let's find the return statement
return_str = "return ("
new_return = """  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-500"></div></div>;
  }

  if (!user) {
    return null;
  }

  return ("""
content = content.replace(return_str, new_return, 1)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)
