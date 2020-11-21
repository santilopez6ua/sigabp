const { response } = require('express');
const validator = require('validator');

const Curso = require('../models/cursos');

const obtenerCursos = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    try {
        let cursos, total;
        if (id) {
            [cursos, total] = await Promise.all([
                Curso.findById(id),
                Curso.countDocuments()
            ]);
        } else {
            [cursos, total] = await Promise.all([
                Curso.find({}).skip(desde).limit(registropp),
                Curso.countDocuments()
            ]);
        }


        res.status(400).json({
            ok: true,
            msg: 'obtenerCurso',
            cursos,
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
            msg: 'Error al obtener cursos'
        });
    }
}

/*
post / 
<-- nombre (unico), proyecto?, descripcion?
--> curso registrado
*/
const crearCurso = async(req, res = response) => {

    const { nombre, nombrecorto } = req.body;


    try {
        // Comrprobar que no existe un curso con ese nombre registrado
        const existeCurso = await Curso.findOne({ nombre });

        if (existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe un curso con el mismo nombre'
            });
        }

        // Comrprobar que no existe un curso con ese nombre registrado
        const existeCursonc = await Curso.findOne({ nombrecorto });

        if (existeCursonc) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe un curso con el mismo nombre corto'
            });
        }

        const curso = new Curso(req.body);

        // Almacenar en BD
        await curso.save();

        res.json({
            ok: true,
            msg: 'Curso creado',
            curso,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando curso'
        });
    }
}

const actualizarCurso = async(req, res = response) => {

    const { nombre, nombrecorto } = req.body;
    const uid = req.params.id;

    try {

        // Comrprobar que no existe un curso con ese nombre registrado
        const existeCurso = await Curso.findById(uid);

        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        // Comrprobar que no existe un curso con ese nombre registrado
        const existeCurson = await Curso.findOne({ nombre });

        if (existeCurson && (existeCurson._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede cambiar el nombre porque ya existe un curso con el mismo nombre'
            });
        }

        // Comrprobar que no existe un curso con ese nombre corto registrado
        const existeCursonc = await Curso.findOne({ nombrecorto });

        if (existeCursonc && (existeCursonc._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede cambiar el nombre corto porque ya existe un curso con el mismo nombre'
            });
        }

        const curso = await Curso.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Curso actualizado',
            curso
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando curso'
        });
    }
}

const borrarCurso = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const existeCurso = await Curso.findById(uid);
        if (!existeCurso) {
            return res.status(400).json({
                ok: true,
                msg: 'El curso no existe'
            });
        }
        // Lo eliminamos y devolvemos el curso recien eliminado
        const resultado = await Curso.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Curso eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando curso'
        });

    }
}



module.exports = { obtenerCursos, crearCurso, actualizarCurso, borrarCurso }