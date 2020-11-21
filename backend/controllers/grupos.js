const { response } = require('express');
const validator = require('validator');

const Grupo = require('../models/grupos');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');

/*
get / 
--> devuleve todos los usuarios
*/
const obtenerGrupos = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    try {
        let grupos, total;
        if (id) {
            [grupos, total] = await Promise.all([
                Grupo.findById(id).populate('curso', '-__v').populate('alumnos.usuario', '-password -alta -__v'),
                Grupo.countDocuments()
            ]);
        } else {
            [grupos, total] = await Promise.all([
                Grupo.find({}).skip(desde).limit(registropp).populate('curso', '-__v').populate('alumnos.usuario', '-password -alta -__v'),
                Grupo.countDocuments()
            ]);
        }

        res.status(400).json({
            ok: true,
            msg: 'obtenerGrupos',
            grupos,
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
            msg: 'Error al obtener grupos'
        });
    }
}

/*
post / 
<-- nombre (unico por curso), proyecto?, descripcion?
--> grupo registrado
*/
const crearGrupo = async(req, res = response) => {

    const { nombre, alumnos, curso } = req.body;

    try {
        // Comprobar que el curso que se va a asignar al grupo existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en el grupo no existe'
            });
        }

        // Comrprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeGrupo = await Grupo.findOne({ nombre, curso });
        if (existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe en le mismo curso'
            });
        }

        // Comprobamos la lista de alumnos que nos envían que existan
        let listaalumnosinsertar = [];
        // Si nos ha llegado lista de alumnos comprobar que existen y limpiar campos raros
        if (alumnos) {
            let listaalumnosbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaalu = alumnos.map(registro => {
                if (registro.usuario) {
                    listaalumnosbusqueda.push(registro.usuario);
                    listaalumnosinsertar.push(registro);
                }
            });
            // Comprobamos que los alumnos que nos pasan existen, buscamos todos los alumnos de la lista
            const existenAlumnos = await Usuario.find().where('_id').in(listaalumnosbusqueda);
            if (existenAlumnos.length != listaalumnosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos indicados en el grupo no existe o están repetidos'
                });
            }
        }

        const grupo = new Grupo(req.body);
        grupo.alumnos = listaalumnosinsertar;

        // Almacenar en BD
        await grupo.save();

        res.json({
            ok: true,
            msg: 'Grupo creado',
            grupo,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando grupo'
        });
    }
}

const actualizarGrupo = async(req, res) => {

    const { nombre, alumnos, curso } = req.body;
    const uid = req.params.id;

    try {
        // Comprobar que el curso que se va a asignar al grupo existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        const existeGrupo = await Grupo.findById(uid);
        if (!existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo no existe'
            });
        }

        // Comprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeGrupon = await Grupo.findOne({ nombre, curso });
        if (existeGrupon && (existeGrupo._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe en le mismo curso'
            });
        }

        // Comprobamos la lista de alumnos que nos envían que existan
        let listaalumnosinsertar = [];
        // Si nos ha llegado lista de alumnos comprobar que existen y hay limpiar campos raros
        if (alumnos) {
            let listaalumnosbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaalu = alumnos.map(registro => {
                if (registro.usuario) {
                    listaalumnosbusqueda.push(registro.usuario);
                    listaalumnosinsertar.push(registro);
                }
            });
            // Comprobamos que los alumnos que nos pasan existen, buscamos todos los alumnos de la lista
            const existenAlumnos = await Usuario.find().where('_id').in(listaalumnosbusqueda);
            if (existenAlumnos.length != listaalumnosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos indicados en el grupo no existe o están repetidos'
                });
            }
        }

        // Creamos el registro para insertar pero con la lista de alumnos comprobados
        let object = req.body;
        object.alumnos = listaalumnosinsertar;

        const grupo = await Grupo.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Grupo actualizado',
            grupo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando grupo'
        });
    }
}

const borrarGrupo = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el grupo que queremos borrar
        const existeGrupo = await Grupo.findById(uid);
        if (!existeGrupo) {
            return res.status(400).json({
                ok: true,
                msg: 'El grupo no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Grupo.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Grupo eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando grupo'
        });

    }
}

module.exports = { obtenerGrupos, crearGrupo, actualizarGrupo, borrarGrupo }