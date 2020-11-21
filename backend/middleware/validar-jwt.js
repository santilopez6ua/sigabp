const jwt = require('jsonwebtoken');
const validarJWT = (req, res, next) => {
    // Extraemos nuestra cabecera que contiene el token, en este caso se llama 'x-token'
    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'Falta token de autorización'
        });
    }

    try {
        // Verify devuelve payload siempre y cuando se haya firmado con la misma llave, también verifica caducidad
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);
        req.uid = uid;
        req.rol = rol;
        next();

    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
}
module.exports = { validarJWT }