/*
Importación de módulos
*/
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

require('dotenv').config();
const { dbConnection } = require('./database/configdb');


// Crear una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(express.json()); // permite manejar argumentos que nos llegan en la request como si se tratase de un json, construye request como json -> ej. req.body.nombre

app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    abortOnLimit: false, // si se alcanza tamaño limite, se aborta la subida,false para poder manejar el error
    createParentPath: true, // si carpeta donde se va a alamacenar no existe, se crea
}));


// cualquier cosa con la ruta usuarios lo atenderá el archivo usurios.js
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/grupos', require('./routes/grupos'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/asignaturas', require('./routes/asignaturas'));
app.use('/api/items', require('./routes/items'));
app.use('/api/uploads', require('./routes/uploads'));



// Abrir la aplicación en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});