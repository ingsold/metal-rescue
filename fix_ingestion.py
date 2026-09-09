import re

with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

target1 = r"precio_sugerido_ia: result\.precio_sugerido_ia \? Number\(result\.precio_sugerido_ia\) : 0,"
repl1 = "precio_sugerido_ia: result.precio_sugerido_ia && !isNaN(Number(result.precio_sugerido_ia)) ? Number(result.precio_sugerido_ia) : 0,"
content = re.sub(target1, repl1, content)

target2 = r"nivel_confianza_ia: result\.nivel_confianza_ia \? Number\(result\.nivel_confianza_ia\) : 0,"
repl2 = "nivel_confianza_ia: result.nivel_confianza_ia && !isNaN(Number(result.nivel_confianza_ia)) ? Number(result.nivel_confianza_ia) : 0,"
content = re.sub(target2, repl2, content)

target3 = r"if \(imageFiles\.length === 0\) \{"
repl3 = """if (imageFiles.length === 0 || imageUrls.length === 0) {
      alert('¡Alto ahí! Por favor, espera a que las imágenes terminen de procesarse o sube al menos una foto.');
      return;
    }
    if (false) {"""
content = re.sub(target3, repl3, content)

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)

