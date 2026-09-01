import json

with open('firebase-blueprint.json', 'r') as f:
    data = json.load(f)

data['entities']['GoldenSetEvaluation'] = {
  "title": "GoldenSetEvaluation",
  "description": "TFM Golden Set Evaluation Record",
  "type": "object",
  "properties": {
    "id_muestra": { "type": "string" },
    "fecha_evaluacion": { "type": "string" },
    "banda_artista": { "type": "string" },
    "tipo_prenda": { "type": "string" },
    "estado_conservacion": { "type": "string" },
    "origen_adquisicion": { "type": "string" },
    "evento_origen": { "type": "string" },
    "precio_estimado_donante": { "type": "number" },
    "precio_sugerido_ia": { "type": "number" },
    "autenticidad_ia": { "type": "string" },
    "nivel_confianza_ia": { "type": "number" },
    "razonamiento_analisis": { "type": "string" },
    "descripcion_marketing": { "type": "string" },
    "imagen_url": { "type": "string" }
  },
  "required": ["fecha_evaluacion", "precio_estimado_donante"]
}

data['firestore']['/evaluaciones_golden_set/{evalId}'] = {
  "schema": { "$ref": "#/entities/GoldenSetEvaluation" },
  "description": "TFM Golden Set"
}

with open('firebase-blueprint.json', 'w') as f:
    json.dump(data, f, indent=2)
