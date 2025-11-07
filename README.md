Backendiii Adoptions

Backend para la gestión de usuarios, mascotas y adopciones, construido con Node.js, Express y MongoDB. La API permite registrar usuarios, añadir mascotas (con opción de subir imágenes) y registrar adopciones.

Prerrequisitos

Node.js 16 o superior y npm.

MongoDB 5.x o superior accesible en la URI que configures (por defecto mongodb://127.0.0.1:27017/adoptme).

(Opcional) Docker si prefieres ejecutar la aplicación y la base de datos en contenedores.

Instalación y ejecución local

Clona este repositorio y entra en su directorio.

Instala las dependencias:

npm install


Copia .env.example a .env y ajusta MONGODB_URI y PORT si es necesario.

Asegúrate de que tienes un servicio de MongoDB en marcha (por ejemplo con mongod --dbpath <ruta>).

Inicia el servidor en modo producción:

npm start


Para un entorno de desarrollo con recarga automática:

npm run dev


La API estará disponible en http://localhost:<PORT> (por defecto 8080).

Pruebas

Para ejecutar las pruebas unitarias y funcionales (requieren las dependencias de desarrollo):

npm install    # asegura que mongodb-memory-server y otras devDependencies están instaladas
npm test


Esto ejecutará los tests sobre usuarios, mascotas, sesiones, mocks y adopciones utilizando una instancia de MongoDB en memoria.

Documentación de la API

La documentación interactiva con Swagger está disponible cuando el servidor está corriendo en:

http://localhost:<PORT>/api-docs


A través de esta interfaz podrás consultar todas las rutas disponibles (Users, Pets, Adoptions y Sessions) y sus esquemas de request/response.

Docker

Esta aplicación incluye un Dockerfile para construir una imagen lista para producción.

Construir y ejecutar la imagen

Construye la imagen desde la raíz del proyecto:

docker build -t armandodom/backendiii-adoptions:latest .


Lanza un contenedor de MongoDB si no tienes uno en marcha (puedes cambiar el nombre mongo si ya existe):

docker run --name mongo -p 27017:27017 -d mongo


Ejecuta tu aplicación, mapeando un puerto libre del host al puerto 8080 del contenedor y apuntando a tu instancia de MongoDB:

docker run --rm -p 3000:8080 \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/adoptme" \
  -e PORT=8080 \
  armandodom/backendiii-adoptions:latest


En Linux o WSL, si host.docker.internal no funciona, usa 127.0.0.1 o la IP del host (por ejemplo, 172.17.0.1).

Si el puerto 8080 del host está libre, puedes usar -p 8080:8080 y acceder a la API en http://localhost:8080.

La app servirá la API en http://localhost:<puerto-host> y la documentación Swagger en /api-docs.

Publicar en Docker Hub

Para compartir la imagen, súbela a Docker Hub tras hacer login:

docker login
docker push armandodom/backendiii-adoptions:latest


Reemplaza armandodom por tu usuario de Docker Hub si es distinto y actualiza el enlace en este README.