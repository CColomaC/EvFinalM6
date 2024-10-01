// Importa módulos 'http' para crear un servidor HTTP, fs para trabajar con el sistema de archivos usando promesas y la función v4 de uuid
const http = require('http');
const url = require('url');
const URLSearchParams = url.URLSearchParams;
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

// Crea un servidor HTTP y después extrae los parámetros de búsqueda y la ruta de la URL de la solicitud
const server = http.createServer(async (req, res) => {
    const { searchParams, pathname } = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(searchParams);

    // Verifica si la ruta es '/anime' y el método de la solicitud es 'GET'
    if (pathname === '/anime' && req.method === 'GET') {
        // Obtiene los parámetros 'id' y 'nombre' de la URL
        const id = params.get('id');
        const nombre = params.get('nombre');
        // Lee el archivo 'anime.json' y lo convierte a un objeto JavaScript
        const lecturaArchivo = await fs.readFile('anime.json', 'utf-8');
        const datos = JSON.parse(lecturaArchivo);

        // Si se proporciona un 'id', busca el anime correspondiente
        if (id) {
            const anime = datos[id];
            if (anime) {
                // Si se encuentra el anime, lo envía como respuesta en formato JSON
                res.write(JSON.stringify(anime, null, 2));
            } else {
                // Si no se encuentra el anime, envía un mensaje de error
                res.write("Anime no encontrado");
            }
            // Si se proporciona un 'nombre', busca el anime correspondiente, lo demás sigue igual que para id...
        } else if (nombre) {
            const anime = Object.values(datos).find(anime => anime.nombre === nombre);
            if (anime) {
                res.write(JSON.stringify(anime, null, 2));
            } else {
                res.write("Anime no encontrado");
            }
        } else {
             // Si no se proporciona ni 'id' ni 'nombre', envía todos los datos como respuesta en formato JSON
            res.write(JSON.stringify(datos, null, 2));
        }
        // Finaliza la respuesta
        res.end();
    }

    if (pathname === '/anime' && req.method === 'POST') {
        // Leer el archivo 'anime.json' y convertir su contenido a un objeto JavaScript
        const archivoOriginal = await fs.readFile('anime.json', 'utf-8');
        const datosOriginales = JSON.parse(archivoOriginal);
        // Generar un nuevo ID único para el nuevo anime
        const id = uuidv4();
        let datosAnime;

        // Escuchar los datos enviados en la solicitud
        req.on('data', (data) => {
            datosAnime = JSON.parse(data);
        });

        // Una vez que se han recibido todos los datos, agregar el nuevo anime al objeto y escribirlo en el archivo
        req.on('end', async () => {
            datosOriginales[id] = datosAnime;
            await fs.writeFile('anime.json', JSON.stringify(datosOriginales, null, 2));
            res.write("Anime agregado exitosamente");
            res.end();
        });
    }

    if (pathname === '/anime' && req.method === 'PUT') {
        // Obtener el ID del anime a modificar de los parámetros de la solicitud
        const id = params.get('id');
        // Leer el archivo 'anime.json' y convertir su contenido a un objeto JavaScript
        const datosArchivo = await fs.readFile('anime.json', 'utf-8');
        const objetoArchivoOriginal = JSON.parse(datosArchivo);
        let datosParaModificar;

        // Escuchar los datos enviados en la solicitud
        req.on('data', (datos) => {
            datosParaModificar = JSON.parse(datos);
        });

        // Una vez que se han recibido todos los datos, actualizar el anime existente y escribir los cambios en el archivo
        req.on('end', async () => {
            const animeOriginal = objetoArchivoOriginal[id];
            const animeActualizado = { ...animeOriginal, ...datosParaModificar };
            objetoArchivoOriginal[id] = animeActualizado;
            await fs.writeFile('anime.json', JSON.stringify(objetoArchivoOriginal, null, 2));
            res.write("Los datos han sido modificados exitosamente");
            res.end();
        });
    }

    if (pathname === '/anime' && req.method === 'DELETE') {
        // Obtener el ID del anime a eliminar de los parámetros de la solicitud
        const id = params.get('id');
        // Leer el archivo 'anime.json' y convertir su contenido a un objeto JavaScript
        const archivoOriginal = await fs.readFile('anime.json', 'utf-8');
        const objetoArchivoOriginal = JSON.parse(archivoOriginal);
        // Eliminar el anime del objeto y escribir los cambios en el archivo
        delete objetoArchivoOriginal[id];
        await fs.writeFile('anime.json', JSON.stringify(objetoArchivoOriginal, null, 2));
        res.write("El anime ha sido eliminado exitosamente");
        res.end();
    }
});

//Puerto de escucha del servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = server;