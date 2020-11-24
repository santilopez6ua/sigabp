const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos (usu)', // no dar pistas
                token: ''
            });
        }
        // Ver si contraseña de la BD proviene de la que me pasan
        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos (pass)',
                token: ''
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);
        res.json({
            ok: true,
            msg: 'login',
            _id,
            rol,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }

}

const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido', // no dar pistas
                token: ''
            });
        }

        const nrol = usuarioBD.rol;
        const nuevoToken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            _id: uid,
            rol: nrol,
            token: nuevoToken
        })
    } catch (error) {

        return res.status(400).json({
            ok: false,
            msg: 'Token no válido',
            token: ''
        });
    }
}

module.exports = { login, token }