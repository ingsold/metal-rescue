# MetalRescue 🤘🐾

**MetalRescue** es una plataforma solidaria que transforma la pasión por la música Metal en ayuda directa para animales en situación de calle y refugios en Guatemala.

Los usuarios pueden donar mercadería, playeras o chumpas que ya no utilizan. A través de **Inteligencia Artificial (Gemini AI)**, la plataforma clasifica, evalúa la autenticidad y sugiere precios para las prendas. Estas se publican en un catálogo en línea, y el 95% de los fondos recaudados por su venta se destinan a la compra de alimento y medicina para refugios de animales (el 5% restante cubre costos operativos de la plataforma).

## 🚀 Características Principales

*   **Gestión de Donaciones**: Los usuarios pueden subir fotos de su mercadería para donarla directamente desde la plataforma.
*   **Tasación con IA (Gemini)**: Integración con IA para analizar imágenes, identificar bandas, evaluar el estado de conservación y sugerir un precio de venta justo.
*   **Catálogo y E-Commerce**: Tienda en línea con carrito de compras y gestión de órdenes (transferencias bancarias con validación de boletas).
*   **Transparencia en Tiempo Real**: Contadores de impacto que muestran las prendas vendidas, el dinero recaudado y los kilogramos de alimento entregados a los refugios.
*   **Panel de Administración (Admin Dashboard)**: Herramientas completas para gestionar donaciones entrantes, verificar pagos, administrar usuarios, eventos y evaluar la precisión de la IA (Golden Set).

## 🛠️ Stack Tecnológico

*   **Frontend**: React 19, TypeScript, Vite
*   **Estilos**: Tailwind CSS, Lucide React (Íconos)
*   **Enrutamiento**: React Router v7
*   **Backend & Base de Datos**: Firebase (Firestore Database, Firebase Auth, Firebase Storage)
*   **Inteligencia Artificial**: API de Google Gemini (Server-side capability / Edge API)

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu entorno local:
*   [Node.js](https://nodejs.org/) (Versión 18 o superior)
*   npm o yarn

## ⚙️ Instalación y Configuración

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/metalrescue.git
   cd metalrescue
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Copia el archivo `.env.example` y renómbralo a `.env`.
   ```bash
   cp .env.example .env
   ```
   Rellena el archivo `.env` con tus credenciales de Firebase y tu API Key de Gemini.

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

## 📦 Construcción para Producción

Para compilar la aplicación para producción, ejecuta:
```bash
npm run build
```
Los archivos optimizados se generarán en el directorio `dist/`. Para previsualizar el build, puedes usar `npm run preview`.

## 📂 Estructura del Proyecto

*   `/src/assets/`: Imágenes y recursos estáticos (como el logo principal).
*   `/src/components/`: Componentes reutilizables de React (Layout, botones, paneles de admin).
*   `/src/context/`: Contextos globales (Autenticación, Carrito, Notificaciones, Toast).
*   `/src/lib/`: Configuración e inicialización de servicios externos (Firebase).
*   `/src/pages/`: Vistas completas de la aplicación correspondientes a cada ruta.
*   `/src/types/`: Definiciones de interfaces y tipos de TypeScript.

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas apoyar a mejorar la plataforma:
1. Haz un Fork del proyecto.
2. Crea una nueva rama para tu característica (`git checkout -b feature/NuevaCaracteristica`).
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`).
4. Haz Push a la rama (`git push origin feature/NuevaCaracteristica`).
5. Abre un Pull Request.

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU General Public License v3.0 (GPLv3)**.

Puedes redistribuir y/o modificar este software bajo los términos de la Licencia Pública General de GNU publicada por la Free Software Foundation, ya sea la versión 3 de la Licencia, o (a tu elección) cualquier versión posterior.

Para más detalles, visita [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html).
