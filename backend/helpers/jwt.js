const jwt = require('jsonwebtoken');

// En forma de promesa -> si todo bien resolve, sino reject, y bloque try catch que invoca a esta funcion puede manejar error
const generarJWT = (uid, rol) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid,
            rol
        }

        // Se firma, si no hay errores, se devuelve token, sino se devuelve error
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '1y'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}
module.exports = { generarJWT }