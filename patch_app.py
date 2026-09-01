with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { AppProvider } from './context/AppContext';", "import { AppProvider } from './context/AppContext';\nimport { ToastProvider } from './context/ToastContext';")
content = content.replace("<AppProvider>", "<ToastProvider>\n      <AppProvider>")
content = content.replace("</AppProvider>", "</AppProvider>\n    </ToastProvider>")

with open('src/App.tsx', 'w') as f:
    f.write(content)
