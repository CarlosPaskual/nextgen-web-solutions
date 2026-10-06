# NextGen Web Solutions: entorno profesional, auditoría con DevTools y microservicio

## Introducción

Como desarrollador junior de NextGen, el encargo consiste en analizar una tienda online con problemas de rendimiento y errores silenciosos y proponer mejoras. Para la auditoría se ha elegido un caso real: la web de The True Mayhem (`thetruemayhem.com`) y su tienda online (`thetruemayhemstore.eu`).

El trabajo se divide en tres tareas: preparar un entorno profesional en VS Code, auditar la web con las herramientas de desarrollo del navegador y crear un pequeño microservicio con npm y Git.

El repositorio reúne la configuración de VS Code, ESLint y Prettier, las capturas de la auditoría, el código del microservicio y este informe. La estructura principal es la siguiente:

```text
nextgen-web-solutions/
├── .vscode/
│   ├── extensions.json   ← extensiones recomendadas
│   └── settings.json     ← ajustes comunes del proyecto
├── capturas/             ← imágenes del informe
├── index.js              ← el microservicio
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 1. Entorno profesional en VS Code

### 1.1. Herramientas de desarrollo

#### ESLint

ESLint es un *linter*: analiza el código sin ejecutarlo y avisa de errores y malas prácticas, como variables que se declaran pero no se usan. Permite detectar estos problemas mientras se escribe. En este proyecto, las reglas están definidas en `eslint.config.mjs` a partir de la configuración recomendada.

![ESLint instalado en VS Code](capturas/eslint.jpg)

#### Prettier

Prettier es un formateador de código. Se ocupa del aspecto del código, no de comprobar si funciona. Define cuestiones como las comillas, los puntos y coma, la sangría y la longitud de las líneas. En este proyecto, las reglas están en `.prettierrc`.

ESLint comprueba las reglas y la calidad del código; Prettier se encarga de que el formato sea uniforme.

![Prettier instalado en VS Code](capturas/prettier.jpg)

#### Error Lens

Error Lens muestra sobre la propia línea de código los avisos y errores que ya han detectado ESLint y VS Code. Así se pueden ver los problemas sin abrir el panel de Problemas. Su utilidad principal es hacerlos visibles mientras se trabaja.

![Error Lens mostrando un aviso en la línea](capturas/error-lens.jpg)

#### GitLens

GitLens amplía las funciones de Git que ya ofrece VS Code. Permite ver quién modificó una línea, cuándo lo hizo y en qué commit mediante la función *blame*. También permite consultar el historial de los archivos desde el propio editor.

![GitLens mostrando el autor y el commit de una línea](capturas/gitlens.jpg)

### 1.2. Configuración del entorno

El entorno de desarrollo tiene dos niveles de configuración. Uno es personal y recoge las preferencias de cada desarrollador. El otro pertenece al proyecto, se guarda en el repositorio y se comparte mediante Git. Si un ajuste aparece en los dos niveles, prevalece el del proyecto, por lo que las reglas comunes se mantienen aunque cada desarrollador tenga preferencias distintas.

#### Configuración del proyecto

La configuración compartida está en la carpeta `.vscode` y en los archivos de configuración del proyecto. Así, todos los desarrolladores trabajan con las mismas herramientas y reglas.

El archivo `.vscode/extensions.json` contiene las extensiones recomendadas para trabajar con el proyecto:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "usernamehw.errorlens",
    "eamodio.gitlens"
  ]
}
```

Cuando otro desarrollador abre el proyecto, VS Code le muestra estas extensiones como recomendadas y puede instalarlas desde ahí.

![Extensiones recomendadas del área de trabajo](capturas/extensiones-recomendadas.jpg)

El archivo `.vscode/settings.json` contiene tres ajustes específicos para este proyecto:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

`editor.formatOnSave` aplica el formateo al guardar, `editor.defaultFormatter` establece Prettier como formateador y `editor.codeActionsOnSave` ejecuta las correcciones de ESLint al guardar manualmente con `Ctrl + S`. Con `"explicit"`, ESLint no se ejecuta en los guardados automáticos.

Además, `.prettierrc` define las reglas de Prettier y `eslint.config.mjs` las reglas que usa ESLint para analizar el código. Como forman parte del repositorio, estas reglas son comunes para todo el equipo.

#### Configuración personal

No todas las preferencias deben formar parte del repositorio. El guardado automático al cambiar de archivo o de ventana es un ejemplo de una preferencia personal:

```json
{
  "files.autoSave": "onFocusChange"
}
```

Esta opción guarda los archivos cuando el editor pierde el foco, por ejemplo, al cambiar a otro archivo o a otra ventana. Se mantiene en la configuración personal porque es una preferencia de trabajo y no una regla del proyecto.

![Ajustes personales de VS Code](capturas/settings-json.jpg)

### 1.3. Flujo de trabajo

Las herramientas anteriores forman un flujo de trabajo que acompaña al código desde que se escribe hasta que se registra en el repositorio:

1. **Escritura.** Mientras se escribe, ESLint analiza el código y Error Lens muestra los avisos en la misma línea donde se producen, de modo que los problemas se corrigen en el momento.
2. **Guardado.** Al guardar con `Ctrl + S`, ESLint corrige automáticamente lo que puede y Prettier da formato al archivo. En el guardado automático, al cambiar de archivo o de ventana, solo actúa Prettier.
3. **Comprobación desde el terminal.** Los scripts `npm run lint` y `npm run format` aplican las mismas reglas sin depender del editor, por lo que el estándar se puede verificar en cualquier equipo.
4. **Registro del cambio.** Tras el commit, GitLens muestra en cada línea quién la modificó, cuándo y en qué commit, lo que permite seguir la evolución del código sin salir del editor.

Así, el estándar de trabajo queda definido en el proyecto y no depende de los hábitos de cada desarrollador.

## 2. Auditoría con DevTools: Network

### 2.1. Objeto de estudio y metodología

La auditoría se ha realizado sobre la tienda `thetruemayhemstore.eu`, construida con Shopify, y sobre la web principal `thetruemayhem.com`, construida con WordPress. Se han usado las herramientas de desarrollo de Chrome (`F12`): **Network** para revisar los recursos descargados, **Console** para detectar errores y **Lighthouse** para medir el rendimiento.

Las pruebas de Lighthouse se han ejecutado en modo móvil, emulando un Moto G Power con una conexión *Slow 4G*.

### 2.2. Visión general de la carga

Al cargar la página principal de la tienda, Network registra **374 peticiones** y una transferencia total de **4,9 MB**. Es una cifra alta para una página de inicio. En una conexión móvil lenta, tantas peticiones y tantos datos aumentan el tiempo de carga.

![Resumen de peticiones en la pestaña Network](capturas/[COMPLETAR].jpg)

### 2.3. Recursos que retrasan la carga

| Recurso | Peso | Problema |
|---|---|---|
| `app.js` | 246 kB | Script principal de gran tamaño que el navegador debe descargar y ejecutar antes de que la página responda |
| Scripts de terceros (Facebook Pixel, Google Analytics) | ~385 kB | Código de rastreo y publicidad que no aporta nada a la experiencia de compra |
| Imágenes de producto | [COMPLETAR] | Se descargan todas al inicio, aunque no estén visibles en pantalla |
| Logo | [COMPLETAR] | Imagen mucho más grande de lo que se muestra en pantalla |

**Scripts de terceros.** El píxel de Facebook lo añade una aplicación de Shopify llamada Orichi. En la columna *Initiator* de Network se puede comprobar que lo carga `orichi-v2.min.js`. Las aplicaciones de Shopify pueden añadir sus propios scripts, por lo que conviene revisar qué recursos incorpora cada una. También habría que comprobar si el píxel se está cargando dos veces: una desde la aplicación y otra desde la configuración de Shopify.

**Imágenes sin carga diferida.** Las imágenes de producto se descargan aunque todavía no sean visibles. Con `loading="lazy"`, el navegador puede esperar a que el usuario se acerque a ellas antes de descargarlas.

**Logo sobredimensionado.** El logo se descarga con unas dimensiones mucho mayores que las que tiene en pantalla. Eso hace que se descarguen datos que no son necesarios.

![Recursos más pesados ordenados por tamaño](capturas/[COMPLETAR].jpg)

### 2.4. Medición con Lighthouse

La puntuación de rendimiento de la tienda estuvo **entre 29 y 56 sobre 100** en distintas ejecuciones, sin cambios en la web. Lighthouse puede dar resultados diferentes según las condiciones de la prueba, especialmente por la red y por la carga de los scripts de terceros. Las métricas siguientes corresponden a la ejecución con puntuación 29:

| Métrica | Valor | Qué mide |
|---|---|---|
| FCP (First Contentful Paint) | [COMPLETAR] | Cuándo aparece el primer contenido en pantalla |
| LCP (Largest Contentful Paint) | [COMPLETAR] | Cuándo se muestra el elemento principal de la página |
| TBT (Total Blocking Time) | [COMPLETAR] | Tiempo en que la página no responde porque el navegador está ejecutando JavaScript |
| CLS (Cumulative Layout Shift) | [COMPLETAR] | Cuánto se mueven los elementos mientras se carga la página |
| Speed Index | [COMPLETAR] | Rapidez con la que se completa visualmente la página |

Las otras tres categorías de Lighthouse (accesibilidad, buenas prácticas y SEO) obtuvieron 100. El principal problema detectado está, por tanto, en el rendimiento.

![Puntuaciones de Lighthouse](capturas/mayhem-lighthouse-1.jpg)
![Métricas de rendimiento](capturas/mayhem-lighthouse-2.jpg)
![Mejoras propuestas por Lighthouse](capturas/mayhem-lighthouse-3.jpg)
![Diagnóstico del peso de JavaScript](capturas/mayhem-lighthouse-4.jpg)
![Condiciones de la prueba](capturas/mayhem-lighthouse-5.jpg)

### 2.5. Recomendaciones de rendimiento

1. Revisar las aplicaciones de Shopify instaladas y eliminar las que no se usen, empezando por las que añaden scripts de rastreo.
2. Comprobar si el píxel de Facebook se carga por duplicado y dejar una sola integración.
3. Aplicar carga diferida (`loading="lazy"`) a las imágenes que no son visibles al cargar la página.
4. Redimensionar el logo al tamaño con el que se muestra y servirlo en un formato moderno como WebP.
5. Revisar el contenido de `app.js` para dividirlo o retrasar la carga de las partes que no hacen falta al inicio.

## 3. Auditoría con DevTools: Console

El encargo habla de "errores silenciosos": fallos que no rompen nada visible, pero que indican que algo no funciona bien. En la web principal de The True Mayhem se han encontrado dos tipos.

### 3.1. Errores de script de MailerLite

MailerLite es el servicio de *email marketing* que gestiona la suscripción a la newsletter del grupo. En la consola aparecen dos errores relacionados y cada uno se repite dos veces:

```text
Invalid argument "accounts" passed to MailerLite script
Uncaught TypeError: window[window.MailerLiteObject](...) is not a function
```

Los errores no aparecían en todas las recargas. Por eso fue necesario activar **Preserve log** en la consola para conservar los mensajes entre cargas.

![Errores de MailerLite en la consola](capturas/mayhem-errores.jpg)

**Origen de los errores.** Al buscar `mailerlite` en Network se localizó `popups.js`, servido desde `static.mailerlite.com`. Sus líneas 35 a 37 permiten entender los dos errores:

```js
window.MailerLiteObject = window.MailerLiteObject || 'ml';
window[window.MailerLiteObject] = window[window.MailerLiteObject] || function () {};
// [COMPLETAR: copiar la línea 37 tal como aparece en la captura]
```

1. La línea 35 establece que la función de MailerLite se llamará `ml`.
2. La línea 36 crea `ml` como función vacía si todavía no existe.
3. La línea 37 hace dos llamadas encadenadas: primero `ml('accounts')` y después una segunda llamada usando el resultado.

La versión actual de MailerLite no reconoce el argumento `'accounts'` y produce el **primer error**. Como la llamada devuelve `undefined`, la línea 37 intenta ejecutar ese resultado como si fuera una función y produce el **segundo error**. Por tanto, **el primer error provoca el segundo**.

![Líneas 35 a 37 de popups.js](capturas/mayhem-mailerlite.jpg)

**Diagnóstico.** En la página aparecen dos integraciones de MailerLite de épocas distintas: `popups.js`, del sistema antiguo de ventanas emergentes, y `universal.js`, el script actual, que ya no acepta la llamada `accounts`. Además, `custom.js?ver=1625936861` tiene una versión de julio de 2021. Todo apunta a una web montada en 2021 y actualizada solo en parte: se añadió el script nuevo sin retirar el antiguo.

**Por qué los errores son intermitentes.** La explicación más probable es que los scripts se cargan de forma asíncrona y el orden puede cambiar según la velocidad de la red. Si uno llega antes que otro, se produce el fallo. Esto encaja con que los errores aparecieran con Lighthouse, que simula una red lenta, y en algunas primeras visitas, pero no siempre al recargar.

**Una pista falsa.** Buscar `mailerlite` en Network devuelve cientos de coincidencias en más de 150 archivos. La mayoría corresponden a una cookie de MailerLite que el navegador envía en cada petición al dominio, no a cientos de scripts. Por eso hay que distinguir esas coincidencias del código que realmente provoca el error.

### 3.2. Contenido mixto (Mixed Content)

La consola muestra **12 avisos de Mixed Content**. Aparecen cuando una página cargada por HTTPS intenta cargar recursos mediante HTTP. En este caso, son imágenes cuyas direcciones siguen apuntando a `http://` en la carpeta de subidas de WordPress de 2021.

Los navegadores actuales pueden intentar cargar esos recursos por HTTPS o bloquearlos. El resultado puede ser que algunas imágenes no se muestren y que aparezca una advertencia de seguridad.

![Avisos de Mixed Content en la consola](capturas/[COMPLETAR].jpg)

### 3.3. Recomendaciones

1. Eliminar la integración antigua de MailerLite (`popups.js` y la llamada desde `custom.js`) y mantener solo el código de inserción actual.
2. Actualizar las direcciones de las imágenes de `http://` a `https://` en la base de datos de WordPress.
3. Incorporar una herramienta de registro de errores en producción, ya que los fallos intermitentes como estos son difíciles de detectar revisando la consola a mano.

## 4. Microservicio con npm y Git

### 4.1. Inicialización y dependencias

El proyecto se ha creado con `npm init -y`, que genera `package.json`, donde se define la información y las dependencias del proyecto. Las dependencias se dividen en dos grupos:

| Tipo | Paquete | Uso |
|---|---|---|
| `dependencies` | `express` | Framework con el que se crea el servidor; el programa lo necesita para funcionar |
| `devDependencies` | `eslint`, `@eslint/js`, `globals` | Análisis del código y configuración de ESLint para Node |
| `devDependencies` | `prettier` | Formateo del código |

Las dependencias de desarrollo se utilizan durante el desarrollo y no son necesarias para ejecutar el programa en producción.

![package.json del proyecto](capturas/package-json.jpg)

### 4.2. Scripts de npm

[COMPLETAR: copiar el bloque `"scripts"` del package.json]

- `npm start` arranca el servidor.
- `npm run lint` analiza el código con ESLint.
- `npm run format` da formato al código con Prettier.

### 4.3. La ruta `/api/servicios`

El microservicio, definido en `index.js`, expone la ruta `/api/servicios` y devuelve en JSON la lista de servicios de la agencia. El puerto está definido como una constante al principio del archivo, de modo que se puede cambiar desde un único punto.

![Respuesta de la ruta /api/servicios en el navegador](capturas/servicios-api.jpg)

### 4.4. Cómo ejecutarlo

```powershell
git clone https://github.com/CarlosPaskual/nextgen-web-solutions.git
cd nextgen-web-solutions
npm install
npm start
```

Después, abre en el navegador `http://localhost:[COMPLETAR: puerto]/api/servicios`.

### 4.5. Control de versiones con Git

El archivo `.gitignore` excluye la carpeta `node_modules`, donde se guardan las dependencias instaladas. No se sube al repositorio porque se puede volver a generar con `npm install` a partir de `package.json` y `package-lock.json`.

Cada paso del proyecto se ha guardado en un commit con un mensaje descriptivo. Así, el historial permite seguir la evolución del trabajo:

```text
[COMPLETAR: pegar la salida actual de git log --oneline]
```

## 5. Mentalidad de desarrollador

Este trabajo ha permitido comprobar en la práctica que algunas ideas habituales sobre el desarrollo web no siempre son ciertas.

**"VS Code es un IDE."** Un IDE (entorno de desarrollo integrado) reúne en una sola herramienta funciones como el análisis del código, la depuración, el terminal y el control de versiones. Al instalar VS Code, no tenía avisos de ESLint, ni el formateo de Prettier, ni la información de historial que aporta GitLens. En este proyecto, esas funciones se han añadido mediante extensiones y configuración.

**"Si la web se ve bien, no tiene errores."** La web de The True Mayhem funciona aparentemente con normalidad, pero la consola muestra errores de MailerLite que solo aparecen en algunas cargas. Un error silencioso puede afectar a una función, como la suscripción a la newsletter, sin que el usuario lo vea.

**"La nota de Lighthouse es un dato fijo."** La misma tienda obtuvo 56 en una ejecución y 29 en otra, sin cambios en la web. Por eso conviene repetir las mediciones y mirar las métricas, no quedarse con una sola puntuación.

**"`node_modules` se sube al repositorio."** Las dependencias no se suben: se indican en `package.json` y se instalan con `npm install`. Por eso `node_modules` aparece en `.gitignore`.

**"El formato del código es cosa de cada uno."** Con `.prettierrc` y la carpeta `.vscode` en el repositorio, el equipo puede usar el mismo formato aunque cada desarrollador tenga sus propias preferencias.

## 6. Conclusión

El trabajo cubre las tres tareas del encargo. La configuración de VS Code queda en el repositorio junto con las reglas de ESLint y Prettier, de modo que el proyecto mantiene un estándar común. La auditoría ha detectado demasiadas peticiones y scripts de terceros en la tienda, además de una integración antigua de MailerLite que provoca errores silenciosos en la web principal. El microservicio queda preparado con npm y Git, sus dependencias, sus scripts y un historial de cambios.

Las mejoras más urgentes son reducir los scripts de terceros de la tienda y retirar la integración antigua de MailerLite. Son dos cambios concretos que pueden mejorar el rendimiento y evitar errores que el usuario no ve.
