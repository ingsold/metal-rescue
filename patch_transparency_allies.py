import re

with open('src/pages/Transparency.tsx', 'r') as f:
    content = f.read()

# Update context usage
old_context = """  const { deliveries } = useApp();

  // MOCK DATA PARA VISUALIZACION
  const displayDeliveries = deliveries.length > 0 ? deliveries : [
    {
      id: "mock_1",
      refugio_nombre: "Refugio Patitas Desamparadas",
      monto_donado_gtq: 3500,
      alimento_comprado_kg: 250,
      foto_evidencia_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
      galeria_urls: [
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800"
      ],
      fecha_entrega: new Date().toISOString(),
      descripcion_impacto: "Gracias a los fondos recaudados en el toque de septiembre, pudimos donar 250kg de alimento balanceado, medicinas y material de limpieza para más de 40 perritos rescatados. ¡El metal salva vidas!"
    }
  ];

  const aliados = [
    {
      id: 1,
      nombre: "Dirección de Bienestar Animal Muniguate",
      telefono: "4479 7830",
      email: "bienestaranimal@muniguate.com",
      descripcion: "Entidad municipal dedicada a la protección, rescate y bienestar de los animales en la Ciudad de Guatemala.",
      imagen: "/logo unidad.png"
    }
  ];"""
new_context = "  const { deliveries, allies } = useApp();"
content = content.replace(old_context, new_context)

# Update the map iterators 
content = content.replace("{displayDeliveries.map((delivery) => (", "{deliveries.map((delivery) => (")
content = content.replace("          {aliados.map((aliado) => (", "          {allies.map((aliado) => (")
content = content.replace("key={aliado.id}", "key={aliado.id}") # It's already ally.id 
content = content.replace("aliado.imagen", "aliado.imagen")
content = content.replace("aliado.nombre", "aliado.nombre")

# Let's fix the hrefs for social networks if any
social_old = """                    <a href={`mailto:${aliado.email}`} className="flex items-center gap-3 text-sm text-zinc-300 hover:text-sabbath-400 transition-colors break-all">
                      <div className="bg-sabbath-900 p-2 rounded-lg">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{aliado.email}</span>
                    </a>
                  </div>
                </div>
              </div>"""

social_new = """                    <a href={`mailto:${aliado.email}`} className="flex items-center gap-3 text-sm text-zinc-300 hover:text-sabbath-400 transition-colors break-all">
                      <div className="bg-sabbath-900 p-2 rounded-lg">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{aliado.email}</span>
                    </a>
                    {aliado.redes_sociales && (
                      <a href={aliado.redes_sociales} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-zinc-300 hover:text-sabbath-400 transition-colors break-all mt-3">
                        <div className="bg-sabbath-900 p-2 rounded-lg">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Redes Sociales / Sitio Web</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>"""

content = content.replace(social_old, social_new)

with open('src/pages/Transparency.tsx', 'w') as f:
    f.write(content)
