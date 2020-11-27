/*
Ruta base: /api/uploads
*/

const { Router } = require('express');
const { subirArchivo, enviarArchivo } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/:tipo/:id', validarJWT, enviarArchivo);
router.post('/:tipo/:id', validarJWT, subirArchivo);


module.exports = router;