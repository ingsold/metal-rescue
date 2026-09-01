import re

with open('src/components/AdminGoldenSet.tsx', 'r') as f:
    content = f.read()

# Add useToast import
content = content.replace("import { GoldenSetEvaluation } from '../types';", "import { GoldenSetEvaluation } from '../types';\nimport { useToast } from '../context/ToastContext';")

# Extract showToast
content = content.replace("  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);", "  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);\n  const { showToast } = useToast();")

# Update catch block
catch_block = """      } catch (e: any) {
        console.error("Error fetching golden set:", e);
        if (e.message?.includes('Quota') || e.message?.includes('quota')) {
          setActionMessage({ type: 'error', text: 'Límite de cuota gratuita de Firebase excedido. Por favor intenta mañana o habilita la facturación.' });
        } else {
          setActionMessage({ type: 'error', text: 'Error al cargar el Golden Set: ' + (e.message || 'Error desconocido') });
        }
      } finally {"""
content = re.sub(r'\} catch \(e\) \{\s*console\.error\("Error fetching golden set:", e\);\s*\} finally \{', catch_block, content)

with open('src/components/AdminGoldenSet.tsx', 'w') as f:
    f.write(content)
