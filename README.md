# FormularioReactivo & Sistema de Gestión (Ionic 9 + Angular Standalone)

**Módulo:** Desarrollo de Interfaces (0488) — 2º DAM  
**Instituto:** Nebrija de Formación Profesional  
**Autor:** Luis Lázaro Pimentel  
**Ecosistema:** Ionic Framework 9 (`@ionic/angular`) · Angular 22 (Standalone Architecture) · TypeScript

---

## 📋 Resumen del Proyecto

**FormularioReactivo** es una aplicación móvil y web construida sobre **Ionic Framework 9** y **Angular 22 Standalone Components**. La aplicación implementa dos paradigmas fundamentales de gestión de formularios en Angular (**Reactive Forms** y **Template-Driven Forms**), junto con el módulo previo de gestión logística (**WMS - Warehouse Management System**), todo unificado bajo una arquitectura modular limpia y un diseño visual de autor **Swiss Editorial / Industrial Design** (libre de plantillas genéricas de IA y tonos azules por defecto).

La suite incorpora validadores personalizados, encriptación criptográfica SHA-256 en cliente para contraseñas, generación nativa de comprobantes en PDF, conmutador de tema claro/oscuro persistente en `localStorage` y un cuadro técnico comparativo en vivo.

---

## 🧭 Enrutamiento y Navegación Unificada

La aplicación cuenta con una barra de navegación superior interactiva (`<ion-segment>`) presente en todas las vistas principales, permitiendo alternar fluidamente entre los tres módulos de la práctica:

1. **`/registro` (Formulario Reactivo):** Ruta principal por defecto (`''` redirige a `'registro'`). Formulario basado en `FormGroup`, `FormControl`, `ReactiveFormsModule` y Signals reactivos.
2. **`/driven` (Formulario Template-Driven):** Formulario basado en `FormsModule`, directivas `[(ngModel)]`, validación declarativa en plantilla y cuadro comparativo técnico en vivo.
3. **`/inventario` (Gestión de Inventario WMS):** Módulo previo de gestión de almacén con SKU de 12 caracteres alfanuméricos, categorías, stock mínimo y persistencia Offline-First.

---

## 🚀 Cumplimiento de los 12 Requisitos Técnicos

### 1. Renombrado Oficial del Proyecto a `FormularioReactivo`
- Metadatos actualizados en `package.json`, `angular.json`, `ionic.config.json` e `index.html`.
- Enlace simbólico / unión NTFS (`junction`) `FormularioReactivo` activo en Windows que permite la navegación simultánea mediante `cd FormularioReactivo` o `cd gestion-inventario`.
- Metadatos de autoría institucional: **Luis Lázaro Pimentel** (2º DAM - Instituto Nebrija).

### 2. Refactorización de `HomePage` a `RegistroPage`
- Se eliminó completamente la antigua carpeta `src/app/home`.
- Se creó `src/app/registro/` conteniendo `registro.page.ts`, `registro.page.html`, `registro.page.scss` y `registro.page.spec.ts`.
- Componente standalone con selector `app-registro`.

### 3. Limpieza y Reconfiguración de `app.routes.ts`
- Se erradicaron todas las referencias a `home`.
- La ruta raíz `''` redirige automáticamente a `'registro'` (`pathMatch: 'full'`).
- Rutas declaradas con carga perezosa (`loadComponent`):
  - `'registro'` ➡️ `RegistroPage`
  - `'driven'` ➡️ `DrivenPage`
  - `'inventario'` ➡️ `InventarioFormComponent`

### 4. Formulario Reactivo con Angular Signals (`RegistroPage`)
El formulario se encuentra tipado e inyectado con `FormBuilder`, gestionando los siguientes campos y validaciones:
1. **`nombre`**: Obligatorio (`Validators.required`), mínimo 3 caracteres (`Validators.minLength(3)`).
2. **`email`**: Obligatorio (`Validators.required`), formato email RFC (`Validators.email`), `type="email"`, `inputmode="email"`.
3. **`password`**: Obligatorio (`Validators.required`), expresión regular `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/` (mínimo 8 caracteres, al menos una letra y al menos un número).
4. **`fechaNacimiento`**: Obligatorio (`Validators.required`), validado con validador personalizado y restricción nativa de calendario.

### 5. Notificación de Envío y Feedback Visual
- Al enviar el formulario reactivo o template-driven, la interfaz activa el estado de envío reactivo (`isSubmitting = signal<boolean>(false)`), desactiva controles para evitar dobles envíos y muestra un `<ion-toast>` flotante con feedback positivo.
- También se incluye diálogo informativo modal `<ion-alert>` con confirmación del registro.

### 6. Validador Personalizado de Fecha (`fechaNoFuturaValidator`)
- Ubicado en `src/app/validators/registro.validators.ts`.
- Compara la fecha seleccionada por el usuario contra la fecha actual normalizada a las 23:59:59 de hoy.
- Si el usuario introduce una fecha futura, el control emite el error `{ fechaFutura: true }` y la plantilla muestra el aviso de error: *"La fecha de nacimiento no puede ser superior a hoy."*.
- Además, los componentes de entrada enlazan el atributo `[max]="maxDateToday"` para bloquear fechas futuras en los selectores de calendario nativos del navegador y de Ionic.

### 7. Conmutador de Modo Oscuro / Claro Persistente
- Implementado en `src/app/services/theme.service.ts` mediante Angular Signals (`isDarkMode = signal<boolean>(false)`).
- Alterna las clases `.dark-theme` e `.ion-palette-dark` sobre `document.documentElement` y `document.body`.
- Persiste la preferencia del usuario en `localStorage` bajo la clave `'pref_tema_oscuro'`.
- Botón accesible ubicado en el `<ion-toolbar>` superior con icono dinámico (Sol / Luna).

### 8. Generación y Descarga de Comprobante en PDF
- Módulo nativo en TypeScript `src/app/utils/pdf-generator.util.ts`.
- Genera un archivo binario válido conforme al estándar `%PDF-1.4` sin depender de librerías externas rotas o incompatibles con bundlers modernos.
- Al pulsar el botón **"Descargar Comprobante PDF"** (habilitado tras un envío válido y disponible en la tarjeta de resumen), descarga automáticamente el archivo `comprobante-registro.pdf`.
- Contenido del comprobante: Cabecera institucional de Nebrija FP, datos del estudiante/autor, identificador de transacción, nombre del registrado, correo electrónico, fecha de nacimiento formateada, hash criptográfico SHA-256 de la contraseña (truncado por confidencialidad) y marca de tiempo ISO.

### 9. Eliminación Absoluta de Rutas Rotas
- Se eliminaron todos los vestigios del módulo anterior `src/app/home`.
- Cero advertencias de compilación en Angular 22 y Vite.

### 10. Hashing Criptográfico SHA-256 de Contraseña en Consola
- Implementado en `src/app/utils/crypto.util.ts` (`hashPasswordSHA256()`).
- Utiliza la Web Crypto API nativa del navegador (`window.crypto.subtle.digest('SHA-256', ...)`).
- **Garantía de Seguridad:** La contraseña en texto plano **NUNCA** se imprime en `console.log` ni se almacena en el estado de último envío.
- En consola se visualiza:
  ```javascript
  console.log('Payload enviado (Registro Reactive):', {
    nombre: "...",
    email: "...",
    passwordHashSHA256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    fechaNacimiento: "...",
    fechaEnvio: "..."
  });
  ```

### 11. Rediseño Visual Anti-IA y Responsividad Móvil (RWD)
- **Cero azul Ionic (`#3880ff`) y cero degradados morados genéricos de IA.**
- Paleta **Editorial / Industrial Swiss Design**:
  - **Modo Claro:** Fondo de papel piedra cálido (`#F4F3EF`), tarjetas en blanco marfil (`#FFFFFF`), bordes sutiles grafito (`#E5E0D8` y `#1C1917`), textos en carbón profundo (`#18181B`) y acentos en **Terracota / Cobre Quemado (`#C2410C` / `#EA580C`)**, con verde salvia oscuro (`#15803D`) para estados válidos.
  - **Modo Oscuro:** Fondo carbón obsidiana (`#121316`), tarjetas grafito (`#1C1E24`), bordes oscuros (`#2E323B`), tipografía hueso (`#F3F4F6`) y acentos en **Ámbar Cobre (`#F97316`)**.
- **Accesibilidad y RWD Móvil:**
  - Áreas táctiles con altura mínima de **48px** (`min-height: 48px; touch-action: manipulation;`).
  - Optimizado para pantallas móviles (360px a 430px) y centrado con ancho máximo de 580px en pantallas grandes.
  - Tipografía técnica monospace para hashes y etiquetas de metadatos.

### 12. Página `DrivenPage` con Formulario Template-Driven
- Ubicado en `src/app/driven/` (`driven.page.ts`, `.html`, `.scss`).
- Utiliza `FormsModule`, variables de plantilla `#registroNgForm="ngForm"`, `#nombreNg="ngModel"`, `#emailNg="ngModel"`, `#passNg="ngModel"` y `#fechaNg="ngModel"`.
- Implementa exactamente las mismas reglas de validación que el formulario reactivo.
- Cifra la contraseña con SHA-256 antes del log y permite igualmente descargar el comprobante en PDF.
- **Cuadro Comparativo Técnico en Vivo:** Incluye una tabla didáctica interactiva que evalúa y resume en tiempo real las diferencias clave entre ambos paradigmas:
  - Paradigma (Reactivo vs Declarativo en Plantilla).
  - Sincronización (Inmutable/Síncrono vs `[(ngModel)]` Asíncrono).
  - Testabilidad (Pruebas unitarias directas en TS sin DOM vs Requerimiento de renderizado en DOM).
  - Escalabilidad (Ideal para formularios dinámicos complejos vs Ideal para formularios simples o prototipos rápidos).

---

## 🛠️ Estructura del Código

```text
FormularioReactivo / gestion-inventario/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── inventario-form/           # Módulo WMS (SKU, categorías, stock mínimo)
│   │   │       ├── inventario-form.component.ts
│   │   │       ├── inventario-form.component.html
│   │   │       ├── inventario-form.component.scss
│   │   │       └── inventario-form.component.spec.ts
│   │   ├── driven/                        # Módulo Template-Driven (Punto 12)
│   │   │   ├── driven.page.ts
│   │   │   ├── driven.page.html
│   │   │   └── driven.page.scss
│   │   ├── models/                        # Interfaces tipadas
│   │   │   ├── inventario.model.ts
│   │   │   └── registro.model.ts
│   │   ├── registro/                      # Módulo Formulario Reactivo (Puntos 2, 3, 4, 10)
│   │   │   ├── registro.page.ts
│   │   │   ├── registro.page.html
│   │   │   ├── registro.page.scss
│   │   │   └── registro.page.spec.ts
│   │   ├── services/
│   │   │   └── theme.service.ts           # Servicio reactivo de Modo Oscuro con Signals
│   │   ├── shared/
│   │   │   └── ionic.module.ts            # Componentes Ionic centralizados para Standalone
│   │   ├── utils/
│   │   │   ├── crypto.util.ts             # Hashing SHA-256 con Web Crypto API
│   │   │   └── pdf-generator.util.ts      # Generador binario nativo PDF-1.4
│   │   ├── validators/
│   │   │   ├── inventario.validators.ts   # SKU y mayor que cero
│   │   │   └── registro.validators.ts     # Validador de fecha no futura
│   │   ├── app.component.ts
│   │   └── app.routes.ts                  # Enrutador principal ('', 'registro', 'driven', 'inventario')
│   ├── theme/
│   │   └── variables.scss                 # Tokens de diseño Swiss Editorial (Terracota / Carbón)
│   ├── global.scss                        # Resets, tipografía, modo oscuro y utilidades RWD
│   ├── index.html                         # Metadatos del proyecto y autor
│   └── main.ts                            # Bootstrap Standalone con provideIonicAngular()
├── angular.json
├── ionic.config.json
├── package.json
└── README.md
```

---

## 💻 Instrucciones de Ejecución

### Servidor de Desarrollo Local
```bash
npx ionic serve
# o alternativamente:
npm start
```
La aplicación se servirá en `http://localhost:8100/`.

### Verificación de Pruebas Unitarias
```bash
npx ng test --watch=false
```

### Compilación para Producción
```bash
npm run build
```
