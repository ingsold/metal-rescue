import re

with open('src/pages/ManageEvents.tsx', 'r') as f:
    content = f.read()

old_delete = """                            if(window.confirm('¿Estás seguro de querer eliminar este evento completamente?')) {
                              deleteEvent(event.id);
                            }"""

new_delete = """                            deleteEvent(event.id);"""

content = content.replace(old_delete, new_delete)

with open('src/pages/ManageEvents.tsx', 'w') as f:
    f.write(content)
