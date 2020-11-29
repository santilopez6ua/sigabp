/*
Ruta base: /api/usuarios
*/
const { Router } = require('express'); // cargar clase Router de express -> desusctruturación mediante { parte } (solo se extrae parte de la librería)
const { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, actualizarPassword } = require('../controllers/usuarios'); // importar método getUsuarios
const { check } = require('express-validator'); // check comprueba si existe cierto campo, si es de cierto tipo u otras validaciones, comprueba todo el contenido, no solo partes
const { validarCampos } = require('../middleware/validar-campos');
//const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
//const { setHeaders } = require('../middleware/set-headers');

const router = Router(); // declarar objeto router de tipo Router

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'La busqueda debe contener texto').optional().trim(),
    validarCampos,
], obtenerUsuarios); // ruta raíz '/' a partir de la ruta base (/api/usuarios) se atiende mediante getUsuarios

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(), // añade erores a la req si los hay, y en controladores comprobamos si tiene errores
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(), // trim limpia de espacios al final y al principio
    //check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
    //validarRol
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
    // validarRol,
], actualizarUsuario);

router.put('/np/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('password', 'El argumento password es obligatorio').not().isEmpty().trim(),
    check('nuevopassword', 'El argumento nuevopassword es obligatorio').not().isEmpty().trim(),
    check('nuevopassword2', 'El argumento nuevopassword2 es obligatorio').not().isEmpty().trim(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
], actualizarPassword);


router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

module.exports = router;