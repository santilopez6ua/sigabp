const { response } = require('express'); // objeto response, tipamos 'res' para más facilidad de uso (hacerlo siempre que podamos)
const { validationResult } = require('express-validator');


/* Recibe req, si hay errores recibe res con errores, si no llama a next
   Next llama al siguiente paso (middleware)
*/
const validarCampos = (req, res = response, next) => {

    const erroresVal = validationResult(req);

    if (!erroresVal.isEmpty()) {
        return res.status(400).json({
            ok: false,
            msg: 'Argumentos recibidos inválidos',
            errores: erroresVal.mapped()
        });
    }

    next();
}

module.exports = { validarCampos }