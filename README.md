<h1>TIDE Blocks</h1>
<h2>Directorio</h2>
<pre style="color:#a0a">
+--+TIDE Blocks
   +--+bin
   |  +--+builder
   |     +---hardware
   |     +---java
   |     +---lib
   |     +---libraries
   |     +---tools-builder
   |     +---arduino-builder.exe
   |
   +--+build
   |  +---favicon.ico
   |
   +---css
   +---fonts
   +---js
   +---libraries
   +---pictures
   +--+temp
   |  +--+build
   |  |  +--+sketch
   |  |  |  +---temp.ino.cpp
   |  |  |
   |  |  +---temp.ino.hex
   |  |
   |  +temp.ino
   |
   +---home.html
   +---main.js
   +---package.json
</pre>
<h2>Scripts</h2>
<p>
<pre>
<em>/* NOTE: Se ejecutan en la carpeta TIDE Blocks. */</em>
</pre>
</p>
<code>npm install</code>
<p>
Se ejecuta cada vez que se tiene el repositorio limpio.<br/>
Instala todas las dependencias del proyecto.
</p>
<code>npm start</code>
<p>
Inicia la aplicacion en modo de desarrollo.<br/>
<pre>
<em>/* TODO: Agregar herramientas de desarrollo en el menu. */</em>
</pre>
</p>
<code>npm run dist</code>
<p>
Empaqueta la aplicación en un instalador.<br/>
<pre>
<em>/* NOTE: Disponible solo para Windows. */</em>
<em>/* TODO: Diferenciar x86 y x64. */</em>
<em>/* TODO: Agregar compilador para Linux y Mac. */
</pre>
</p>
