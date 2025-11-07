import __dirname from "./index.js";
import multer from 'multer';

//fs & path

import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Detectar la ruta base para decidir la carpeta
        let folder;
        // Si la ruta contiene '/pets', guardamos en /img/pets
        if (req.baseUrl.includes('/pets')) {
            folder = path.join(__dirname, '../public/img/pets');
        }
        // Si la ruta contiene '/users' y el endpoint es documents, guardamos en /documents
        else if (req.baseUrl.includes('/users') && req.originalUrl.includes('/documents')) {
            folder = path.join(__dirname, '../public/documents');
        } else {
            // Carpeta por defecto
            folder = path.join(__dirname, '../public/img');
        }
        // Crear la carpeta si no existe
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({ storage });
export default uploader;
