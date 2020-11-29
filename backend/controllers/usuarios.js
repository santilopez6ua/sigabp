const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const Grupo = require('../models/grupos');
const { infoToken } = require('../helpers/infotoken');

/*
get / 
<-- desde? el salto para buscar en la lista de usuarios
    id? un identificador concreto, solo busca a este
--> devuleve todos los usuarios
*/

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const obtenerUsuarios = async(req, res = response) => {

    // Lo tipamos
    const desde = Number(req.query.desde) || 0; // Si no es número o no viene se inicializa a 0
    const registropp = Number(process.env.DOCSPERPAGE); // Por página
    const texto = req.query.texto;
    let textoBusqueda = '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    // Id de usuario por si solo quiere buscar uno
    const id = req.query.id || '';


    try {

        // Solo puede listar usuarios un admin
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar usuarios',
            });
        }

        let usuarios, total;

        // Si ha llegado Id, hacemos el get /id
        if (id) {

            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            if (texto) {
                [usuarios, total] = await Promise.all([
                    Usuario.find({ $or: [{ nombre: textoBusqueda }, { apellidos: textoBusqueda }, { email: textoBusqueda }] }).skip(desde).limit(registropp),
                    Usuario.countDocuments({ $or: [{ nombre: textoBusqueda }, { apellidos: textoBusqueda }, { email: textoBusqueda }] })
                ]);
            } else {
                // Lanzar de forma paralela, + eficiente (es una secuencia de promesas que se ejecutan de manera paralela)
                [usuarios, total] = await Promise.all([
                    Usuario.find({}).skip(desde).limit(registropp), // await + asyn hace que tengamos que esperar a resultado; populate hace que el campo grupo no se vea como un id, sino que muestra la información del grupo
                    Usuario.countDocuments()
                ]);
            }
        }


        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios, // = usuarios: usuarios (porque se llaman igual)
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuarios'
        });
    }
}

/*
post / 
<-- nombre, apellidos, email, password, rol?
--> usuario registrado
*/
const crearUsuario = async(req, res = response) => {
    // ya se habrán hecho todas las comprobaciones 
    const { email, password } = req.body;

    try {

        // Solo puede crear usuarios un admin
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear usuarios',
            });
        }

        // Comprobar que no existe un usuario con ese email registrado
        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        // Cifrar la contraseña, obtenemos el salt y cifamos
        const salt = bcrypt.genSaltSync(); // devuelve cadena pseudoaleatoria
        const cpassword = bcrypt.hashSync(password, salt); // hash de la contraseña

        // Tomamos todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta es autómatica
        const { alta, ...object } = req.body;
        const usuario = new Usuario(object);
        usuario.password = cpassword;

        // Alamacenar en BD
        await usuario.save(); // almacenamos, esperar a que se resuelva save

        res.json({
            ok: true,
            msg: 'crearUsuarios',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    // Asegurarnos de que aunq venga el password no se va a actualizar, la modificacion del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, email, alta, ...object } = req.body;
    const uid = req.params.id;

    try {

        // Para actualizar usuario o eres admin o eres usuario del token y el uid que nos llega es el mismo
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un usuario en BD con el email que nos llega en post
        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            // Si existe alguien con ese email tengo que ser yo
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        // Comprobar si existe el usuario que queremos actualizar
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        // Es el mismo o se actualiza correctamente
        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;

        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        if ((infoToken(token).rol === 'ROL_ADMIN') && activo) {
            object.activo = activo;
        }

        // Password se ha extraido , no se actualiza
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true }); // con 'new: true' nos devuelve usuario actualizado

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }
}

/*
post /:id
<-- nombre, apellidos, email, rol   
--> usuario actualizado
*/

const actualizarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (infoToken(token).uid === uid) {

            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

        res.json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}

/*
delete /:id
--> OK si ha podido borrar
*/
const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Solo puede borrar usuarios un admin
        const token = req.header('x-token');

        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para borrar usuarios',
            });
        }

        // No me puedo borrar a mi mismo
        if ((infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no puede eliminarse a si mismo',
            });
        }

        // Comporbamos si esxiste el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuario recien eliminado
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando usuario'
        })
    }
}


module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, actualizarPassword, borrarUsuario }