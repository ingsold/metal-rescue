import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Camera, Upload, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { AcquisitionOrigin } from '../types';
import { compressImage } from '../utils/imageUtils';

export const Ingestion: React.FC = () => {
  const { addProduct, addGoldenSetEvaluation, user, isLoading } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?mode=register');
    }
  }, [user, isLoading, navigate]);

  
  const [banda, setBanda] = useState('');
  const [tipo, setTipo] = useState('Playera');
  const [talla, setTalla] = useState('L');
  const [otraTalla, setOtraTalla] = useState('');
  const [estado, setEstado] = useState('Vintage/Desgastado');
  const [origen, setOrigen] = useState<AcquisitionOrigin>('Mercado Local');
  const [evento, setEvento] = useState('');
  const [precio, setPrecio] = useState('');
  const [adminDonorName, setAdminDonorName] = useState('');
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', html: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Limit to 5 files total
      const newFiles = [...imageFiles, ...files].slice(0, 5);
      setImageFiles(newFiles);
      
      const newUrls = await Promise.all(newFiles.map(f => compressImage(f, 800, 800, 0.7)));
      setImageUrls(newUrls);
      
      setStatusMessage(null);
    }
  };

  const removeImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
  };


  const resetForm = () => {
    setBanda('');
    setTipo('Playera');
    setTalla('L');
    setOtraTalla('');
    setEstado('Vintage/Desgastado');
    setOrigen('Mercado Local');
    setEvento('');
    setPrecio('');
    setAdminDonorName('');
    setImageFiles([]);
    setImageUrls([]);
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageFiles.length === 0 || imageUrls.length === 0) {
      alert('¡Alto ahí! Por favor, espera a que las imágenes terminen de procesarse o sube al menos una foto.');
      return;
    }
    if (false) {
      alert('¡Alto ahí! Por favor, sube al menos una foto de la prenda antes de enviarla a revisión.');
      return;
    }
    
    if (!precio || Number(precio) <= 0) {
      alert('Debes ingresar un precio estimado válido en Quetzales antes de enviar tu prenda.');
      return;
    }
    
    setIsSubmitting(true);
    setStatusMessage(null);
    
    const finalTalla = talla === 'Otra' ? otraTalla : talla;
    
    try {
      const formData = new FormData();
      // Enviar todas las imágenes a n8n
      imageFiles.forEach((file, index) => {
        formData.append(index === 0 ? "foto" : `foto_${index + 1}`, file);
      });
      formData.append("precio_estimado_donante", precio);
      formData.append("origen_adquisicion", origen);
      formData.append("evento_origen", evento || "Toque Bar Guatemala");
      formData.append("usuario_donante_id", user?.id || "anonimo");
      formData.append("usuario_donante_nombre", user?.name || "Donante Anónimo");

      const response = await fetch("https://metalrescue.app.n8n.cloud/webhook/api/v1/donaciones", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor de automatización (HTTP ${response.status})`);
      }

      const responseText = await response.text();
      let result = responseText ? JSON.parse(responseText) : {};
      
      // Si n8n devuelve un arreglo en lugar de un objeto directo, extraemos el primer elemento
      if (Array.isArray(result) && result.length > 0) {
        result = result[0];
      }
      
      if (result.error || result.message === 'error') {
         throw new Error(result.error || "Error interno en el flujo de IA");
      }

      setStatusMessage({
        type: 'success',
        html: `
          <div class="bg-green-900/50 border border-green-500 text-green-200 p-4 rounded-lg mt-4 text-left space-y-2">
            <h4 class="font-bold text-lg text-green-400 border-b border-green-500/30 pb-2">¡Prenda Catalogada Exitosamente! 🎉</h4>
            <p class="text-sm mt-1"><strong>Banda identificada:</strong> ${result.banda_artista || banda || 'Genérica'}</p>
            <p class="text-sm"><strong>Tasación IA:</strong> ${result.precio_sugerido_ia ? 'Q ' + result.precio_sugerido_ia : '<em>Pendiente de revisión manual</em>'}</p>
            <p class="text-sm"><strong>Autenticidad IA:</strong> ${result.autenticidad_ia || 'Desconocido'} ${result.nivel_confianza_ia ? `(${result.nivel_confianza_ia}%)` : ''}</p>
            ${result.razonamiento_analisis ? `<p class="text-xs text-green-100/70 bg-green-950 p-2 rounded border border-green-900 mt-2"><em>" ${result.razonamiento_analisis} "</em></p>` : ''}
            <p class="text-xs text-gray-300 mt-2 pt-2 border-t border-green-500/30">La prenda está en revisión por un administrador antes de su publicación en el catálogo.</p>
          </div>
        `
      });

      const productId = await addProduct({
        banda_artista: result.banda_artista || banda,
        tipo_prenda: tipo,
        talla: finalTalla,
        estado_conservacion: estado,
        origen_adquisicion: origen,
        evento_origen: evento,
        precio_estimado_donante: Number(precio),
        precio_sugerido_ia: result.precio_sugerido_ia && !isNaN(Number(result.precio_sugerido_ia)) ? Number(result.precio_sugerido_ia) : 0,
        autenticidad_ia: result.autenticidad_ia || 'Desconocido',
        descripcion_marketing: result.descripcion_marketing || '',
        imagenes_url: imageUrls,
        ...(user?.role === 'administrador' && adminDonorName.trim() !== '' ? { usuario_donante_nombre: adminDonorName } : {})
      });

      addGoldenSetEvaluation({
        producto_id: productId,
        banda_artista: result.banda_artista || banda,
        tipo_prenda: tipo,
        estado_conservacion: estado,
        origen_adquisicion: origen,
        evento_origen: evento || "Toque Bar Guatemala",
        precio_estimado_donante: Number(precio),
        precio_sugerido_ia: result.precio_sugerido_ia && !isNaN(Number(result.precio_sugerido_ia)) ? Number(result.precio_sugerido_ia) : 0,
        autenticidad_ia: result.autenticidad_ia || 'Desconocido',
        nivel_confianza_ia: result.nivel_confianza_ia && !isNaN(Number(result.nivel_confianza_ia)) ? Number(result.nivel_confianza_ia) : 0,
        razonamiento_analisis: result.razonamiento_analisis || 'Sin razonamiento provisto.',
        descripcion_marketing: result.descripcion_marketing || '',
        imagen_url: imageUrls[0]
      });

      

    } catch (error) {
      console.error("Error al enviar la donación:", error);
      setStatusMessage({
        type: 'error',
        html: `
          <div class="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mt-4 text-left">
            <p class="font-bold">Hubo un problema al procesar la prenda con IA.</p>
            <p class="text-xs mt-1">La prenda se guardó y será revisada de forma manual por nuestro equipo (IA pendiente).</p>
          </div>
        `
      });

      await addProduct({
        banda_artista: banda || "Pendiente de revisión manual",
        tipo_prenda: tipo,
        talla: finalTalla,
        estado_conservacion: estado,
        origen_adquisicion: origen,
        evento_origen: evento,
        precio_estimado_donante: Number(precio),
        precio_sugerido_ia: 0,
        autenticidad_ia: 'Desconocido',
        imagenes_url: imageUrls,
        ...(user?.role === 'administrador' && adminDonorName.trim() !== '' ? { usuario_donante_nombre: adminDonorName } : {})
      });
      
      
    } finally {
      setIsSubmitting(false);
    }
  };

    if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-500"></div></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">DONAR PRENDA</h1>
        <p className="text-zinc-400">Sube fotos de tu mercadería (máx. 5). Gemini AI la evaluará automáticamente.</p>
      </div>

      <div className="bg-sabbath-900 border border-sabbath-800 rounded-2xl p-6 sm:p-8">
        {statusMessage?.type === 'success' ? (
          <div className="space-y-6">
            <div dangerouslySetInnerHTML={{ __html: statusMessage.html }} />
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/mis-donaciones')}
                className="flex-1 bg-sabbath-600 hover:bg-sabbath-500 text-white font-bold py-3 px-4 rounded-md flex justify-center items-center gap-2 transition-colors border border-sabbath-500 shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Ir a Mis Donaciones
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-sabbath-900 hover:bg-sabbath-800 text-white border border-sabbath-700 font-bold py-3 px-4 rounded-md flex justify-center items-center gap-2 transition-colors"
              >
                Donar otra prenda
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Multi-Image Upload */}
          <div>
            <div 
              onClick={isSubmitting ? undefined : handleImageClick}
              className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors relative overflow-hidden ${isSubmitting ? 'cursor-wait opacity-60' : 'cursor-pointer'} ${
                imageFiles.length > 0 ? 'border-sabbath-700 bg-sabbath-950/50 hover:bg-sabbath-900' : 'border-sabbath-700 bg-sabbath-950/50 hover:bg-sabbath-900'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} disabled={isSubmitting}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              <Camera className="w-12 h-12 text-sabbath-500 mb-4" />
              <p className="text-white font-medium mb-2">Añadir fotos (hasta 5) <span className="text-red-400">*</span></p>
              
              <div className="text-zinc-400 text-sm mb-6 text-left max-w-md mx-auto space-y-2 bg-sabbath-950/50 p-4 rounded-lg border border-sabbath-800/50">
                <p className="font-bold text-sabbath-300 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Consejos para una mejor tasación IA:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Entre más fotos adjuntes, mejor será la tasación.</li>
                  <li>Una foto de la <strong>etiqueta</strong> sería excelente.</li>
                  <li>Asegúrate de que se vea bien el <strong>logo de la banda</strong>.</li>
                  <li>Muestra cualquier detalle, estampado trasero o desgaste.</li>
                </ul>
              </div>
              
              <div className="px-6 py-3 bg-sabbath-800 text-white rounded-md font-medium text-sm flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Seleccionar Archivos</span>
              </div>
            </div>

            {/* Image Previews */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-sabbath-700 group">
                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={(e) => removeImage(idx, e)}
                      disabled={isSubmitting}
                      className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-sabbath-950/80 text-center text-xs py-1 text-sabbath-400 font-bold">
                        PRINCIPAL
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Banda / Artista <span className="text-red-400">*</span></label>
              <input disabled={isSubmitting}
                type="text"
                required
                value={banda}
                onChange={(e) => setBanda(e.target.value)}
                placeholder="Ej. Metallica, Bohemia Suburbana..."
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Tipo de Prenda <span className="text-red-400">*</span></label>
              <select disabled={isSubmitting}
                required
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              >
                <option value="Playera">Playera</option>
                <option value="Chumpa">Chumpa</option>
                <option value="Sudadero">Sudadero</option>
                <option value="Gorra">Gorra</option>
                <option value="Accesorio">Accesorio</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Talla <span className="text-red-400">*</span></label>
              <select disabled={isSubmitting}
                required
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="2XL">2XL</option>
                <option value="3XL">3XL</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
            
            {talla === 'Otra' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Especificar Talla <span className="text-red-400">*</span></label>
                <input disabled={isSubmitting}
                  type="text"
                  required
                  value={otraTalla}
                  onChange={(e) => setOtraTalla(e.target.value)}
                  placeholder="Ej. Talla única, Niño 12..."
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Estado de Conservación</label>
              <select disabled={isSubmitting}
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              >
                <option value="Nueva con etiqueta">Nueva con etiqueta</option>
                <option value="Excelente">Excelente (Casi nuevo)</option>
                <option value="Bueno">Bueno (Uso normal)</option>
                <option value="Vintage/Desgastado">Vintage / Desgastado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Origen</label>
              <select disabled={isSubmitting}
                value={origen}
                onChange={(e) => setOrigen(e.target.value as AcquisitionOrigin)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              >
                <option value="Tienda Oficial en Linea">Tienda Oficial en Linea</option>
                <option value="Oficial Local">Oficial Local</option>
                <option value="Mercadería de tour">Mercadería de tour</option>
                <option value="Mercado Local">Mercado Local</option>
                <option value="Colección Personal">Colección Personal</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Evento de Origen (Opcional)</label>
              <input disabled={isSubmitting}
                type="text"
                value={evento}
                onChange={(e) => setEvento(e.target.value)}
                placeholder="Ej. Concierto en Fórum Majadas 2019"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Precio Estimado (Q) <span className="text-red-400">*</span></label>
              <input disabled={isSubmitting}
                type="number"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="¿Cuánto crees que vale? (Q)"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
              />
              <p className="text-xs text-zinc-500 mt-2">Nota de transparencia: Al venderse esta prenda, se deducirá un 5% del precio final para cubrir gastos de funcionamiento. El 95% íntegro será destinado a los refugios.</p>
            </div>
            
            {user?.role === 'administrador' && (
              <div className="sm:col-span-2 p-4 bg-sabbath-950/80 border border-sabbath-500/30 rounded-lg mt-4">
                <label className="block text-sm font-bold text-sabbath-400 mb-2">
                  [ADMIN] Nombre del donante (Opcional)
                </label>
                <p className="text-xs text-zinc-400 mb-3">Si omites este campo, la prenda aparecerá a tu nombre. Úsalo para registrar prendas donadas en eventos físicos por usuarios sin cuenta.</p>
                <input disabled={isSubmitting}
                  type="text"
                  value={adminDonorName}
                  onChange={(e) => setAdminDonorName(e.target.value)}
                  placeholder="Ej. Anónimo / Donación Física Fórum Majadas"
                  className="w-full bg-sabbath-900 border border-sabbath-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-sabbath-500"
                />
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-md font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
                isSubmitting 
                  ? 'bg-sabbath-800 text-sabbath-400 cursor-wait' 
                  : 'bg-sabbath-600 hover:bg-sabbath-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span>Gemini IA analizando rareza y autenticidad...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Enviar a Catalogación con IA</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-zinc-500 mt-3">
              Nuestro sistema de inteligencia artificial revisará las imágenes para sugerir un precio y verificar si es mercadería oficial o bootleg.
            </p>
            
            {statusMessage && (
              <div className="space-y-4">
                <div dangerouslySetInnerHTML={{ __html: statusMessage.html }} />
                <button
                  type="button"
                  onClick={() => navigate('/mis-donaciones')}
                  className="w-full bg-sabbath-600 hover:bg-sabbath-500 text-white font-bold py-3 px-4 rounded-md flex justify-center items-center gap-2 transition-colors border border-sabbath-500 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Ir a Mis Donaciones para ver detalles
                </button>
              </div>
            )}
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
