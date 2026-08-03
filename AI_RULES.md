# REGLAS ESTRICTAS DE DESARROLLO PARA LECTORMAT (AI AGENT)

Estás trabajando en "LectorMat", una plataforma educativa (SPA) construida con React, Vite, Tailwind CSS v4 y Zustand.

## 1. PRINCIPIO DE DESARROLLO ADITIVO (¡CRÍTICO!)
* **Prohibido sobrescribir:** NUNCA borres, simplifiques o elimines código existente (imports, funciones, componentes de UI, variables de estado) a menos que se te ordene explícitamente con la palabra "REFACTORIZAR".
* **Archivos intocables:** Tienes estrictamente prohibido modificar `frontend/src/index.css`, `frontend/vite.config.ts` o `setup.sh`. La configuración de Tailwind v4 ya está establecida y funciona.

## 2. SISTEMA DE DISEÑO (PREMIUM CLEAN WHITE UI)
* El diseño debe mantenerse idéntico a las referencias de Umaximo.com.
* **Fondos:** Usa `bg-slate-50` para el fondo global (Layouts, Login, Dashboard).
* **Tarjetas y Contenedores:** Usa `bg-white` puro con bordes ultra curvos (`rounded-[2rem]`, `rounded-3xl`) y sombras levitantes (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]` o `shadow-sm`).
* **Espaciado (Whitespace):** Usa paddings masivos (`p-8`, `p-10`, `p-12`) para que la interfaz respire.
* **Colores de Interacción:** 
  - Estudiantes / Acciones primarias: Azul Lector (`bg-blue-600`).
  - Docentes / Acciones secundarias: Naranja Mat (`bg-orange-500`).
  - Éxito/Completado: Verde (`bg-emerald-500`).

## 3. ARQUITECTURA Y ESTADO GLOBAL
* Todo el progreso, roles (`student` | `teacher`) y autenticación (`isAuthenticated`) viven en `src/store/useProgressStore.ts` (Zustand).
* Nunca uses `useState` local para datos que deben persistir entre vistas (ej. progreso de un módulo, resultados de un cuestionario).

## 4. FORMATO DE RESPUESTA
* No incluyas saludos, despedidas ni explicaciones filosóficas sobre el código.
* Entrega únicamente las rutas de los archivos afectados y los bloques de código exactos listos para copiar y pegar.