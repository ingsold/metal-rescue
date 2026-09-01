import re

with open('src/components/Layout.tsx', 'r') as f:
    content = f.read()

# Add useEffect to layout
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

hook = """  const { showToast } = useToast();

  useEffect(() => {
    const handleFirestoreError = (e: any) => {
      const errInfo = e.detail;
      if (errInfo && errInfo.error) {
        if (errInfo.error.toLowerCase().includes('quota')) {
          showToast('Límite de Firebase excedido (Quota). Por favor intenta de nuevo mañana.', 'error');
        } else {
          // showToast(`Error de base de datos: ${errInfo.error}`, 'error'); // Too noisy for non-quota errors maybe?
        }
      }
    };
    window.addEventListener('firestore-error', handleFirestoreError);
    return () => window.removeEventListener('firestore-error', handleFirestoreError);
  }, [showToast]);

"""

content = content.replace("  const location = useLocation();", "  const location = useLocation();\n" + hook)

with open('src/components/Layout.tsx', 'w') as f:
    f.write(content)
