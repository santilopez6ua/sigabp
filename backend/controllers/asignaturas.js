const { response } = require('express');
const validator = require('validator');

const Asignatura = require('../models/asignaturas');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');
const asignaturas = require('../models/asignaturas');

/*
get / 
--> devuleve todas las asignaturas
*/
const obtenerAsignaturas = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    try {

        let asignaturas, total;
        if (id) {
            [asignaturas, total] = await Promise.all([
                Asignatura.findById(id).populate('curso').populate('profesores.usuario', '-password -alta -__v'), //filtros para el populate
                Asignatura.countDocuments()
            ]);
        } else {
            [asignaturas, total] = await Promise.all([
                Asignatura.find({}).skip(desde).limit(registropp).populate('curso').populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments()
            ]);
        }

        res.json({
            ok: true,
            msg: 'obtenerAsignaturas',
            asignaturas,
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
            msg: 'Error al obtener asignaturas'
        });
    }
}

/*
post / 
<-- nombre, nombrecorto, curso, profesores?
--> asignatura registrada
*/
const crearAsignatura = async(req, res = response) => {

    const { curso, profesores } = req.body;

    try {

        // Comprobar que el curso que se va a asignar a la asignatura existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        let listaprofesoresinsertar = [];
        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {
            let listaprofesoresbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(registro => { // map parecido a foreach
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });

            // Comprobamos que los profesores que nos pasan existen, buscamos todos los profesores de la lista
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la asignatura no existe o están repetidos'
                });
            }

        }

        const asignatura = new Asignatura(req.body);
        // Sustituir el campo profesores por la lista de profesores preparada
        asignatura.profesores = listaprofesoresinsertar;
        // Almacenar en BD
        await asignatura.save();

        res.json({
            ok: true,
            msg: 'Asignatura creada',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

const actualizarAsignatura = async(req, res) => {

    const { profesores, curso } = req.body;
    const uid = req.params.id;

    try {

        // Comprobar que la asignatura que se va a actualizar existe
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // Comprobar que el curso que se va a asignar a la asignatura existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        let listaprofesoresinsertar = [];
        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {
            let listaprofesoresbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });
            // Comprobamos que los profesores que nos pasan existen, buscamos todos los profesores de la lista
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la asignatura no existe o están repetidos'
                });
            }
        }

        const object = req.body;
        object.profesores = listaprofesoresinsertar;

        const asignatura = await Asignatura.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Asignatura actualizada',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

const borrarAsignatura = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el asignatura que queremos borrar
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: true,
                msg: 'El asignatura no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Asignatura.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Asignatura eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando asignatura'
        });

    }
}



module.exports = { obtenerAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura }