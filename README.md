# GestIT V2

GestIT - Gestión de activos de IT (V2). Trabajo práctico del Grupo 12 para la materia **Testing de Aplicaciones**.

## Requisitos

- **Node.js 18 o superior** (incluye `npm`). Descarga: https://nodejs.org (versión LTS).
- **Git** (para clonar el repositorio). Descarga: https://git-scm.com

Para verificar que están instalados:

```bash
node -v
npm -v
git --version
```

## Cómo iniciar el programa localmente

### En Mac (Terminal)

1. Abrir la app **Terminal** (Cmd + Espacio → escribir "Terminal").
2. Si no tenés Node.js, instalarlo desde https://nodejs.org, o con Homebrew:
   ```bash
   brew install node
   ```
3. Clonar el repositorio y entrar a la carpeta:
   ```bash
   git clone https://github.com/jrua182/GestITV2-Testing-de-Aplicaciones.git
   cd GestITV2-Testing-de-Aplicaciones
   ```
4. Instalar dependencias (el repo ya incluye `node_modules`, pero conviene correrlo igual):
   ```bash
   npm install
   ```
5. Iniciar el servidor:
   ```bash
   npm start
   ```
6. Abrir en el navegador:
   ```bash
   open http://localhost:3000
   ```

### En Windows (PowerShell o Símbolo del sistema)

1. Abrir **PowerShell** (tecla Windows → escribir "PowerShell").
2. Si no tenés Node.js, instalarlo desde https://nodejs.org, o con winget:
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
   Después de instalarlo, cerrar y volver a abrir PowerShell.
3. Clonar el repositorio y entrar a la carpeta:
   ```powershell
   git clone https://github.com/jrua182/GestITV2-Testing-de-Aplicaciones.git
   cd GestITV2-Testing-de-Aplicaciones
   ```
4. Instalar dependencias:
   ```powershell
   npm install
   ```
5. Iniciar el servidor:
   ```powershell
   npm start
   ```
6. Abrir en el navegador:
   ```powershell
   start http://localhost:3000
   ```

> **Sin Git:** también se puede descargar el proyecto desde GitHub con el botón **Code → Download ZIP**, descomprimirlo, abrir la terminal dentro de la carpeta y seguir desde el paso 4.

> **Nota Windows:** si PowerShell muestra un error de "ejecución de scripts deshabilitada" al correr `npm`, usar el **Símbolo del sistema (cmd)** en su lugar, o ejecutar una vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

Para detener el servidor (Mac y Windows): presionar **Ctrl + C** en la terminal.

Modo desarrollo (se reinicia solo al modificar `server.js`):

```bash
npm run dev
```

## Usuarios de prueba

| Usuario    | Contraseña    | Rol           |
|------------|---------------|---------------|
| `admin`    | `admin123`    | Administrador |
| `operador` | `operador123` | Operador      |

## Restaurar datos para pruebas (RNF-09)

Los datos se guardan en memoria y se restauran al reiniciar el servidor. También se pueden restaurar
los datos iniciales antes de cada ciclo de pruebas con sesión de Administrador:
`POST /api/test/reset`.

## Problemas comunes

- **`EADDRINUSE: address already in use :::3000`**: el puerto 3000 ya está en uso (probablemente otra instancia del servidor). Cerrar esa terminal o detenerla con Ctrl + C y volver a correr `npm start`.
- **`node` o `npm` no se reconoce como comando**: Node.js no está instalado o falta reiniciar la terminal después de instalarlo.
