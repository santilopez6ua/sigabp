const { response } = require('express');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const subirArchivo = async(req, res = repsonse) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo'
        });
    }

    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`
        })
    }

    const tipo = req.params.tipo; // fotoperfil(imgs) o evidencia(imgs,zip,pdf,...)
    const id = req.params.id;

    const archivosValidos = {
        fotoperfil: ['jpeg', 'jpg', 'png'],
        evidencia: ['doc', 'docx', 'xls', 'pdf', 'zip'],
    }


    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];



    switch (tipo) {
        case 'fotoperfil':
            if (!archivosValidos.fotoperfil.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no está permitido (${archivosValidos.fotoperfil})`,
                });
            }
            break;

        case 'evidencia':
            if (!archivosValidos.evidencia.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no está permitido (${archivosValidos.evidencia})`,
                });
            }
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operación no está permitida`,
                tipoOperacion: tipo
            });
            break;
    }

    const patharchivo = `${process.env.PATHUPLOAD}/${tipo}/${uuidv4()}.${extension}`;

    archivo.mv(patharchivo, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
                tipoOperacion: tipo
            });
        }

        res.json({
            ok: true,
            msg: 'subirArchivo'
        });
    })


}

const enviarArchivo = async(req, res = repsonse) => {

    res.json({
        ok: true,
        msg: 'enviarArchivo',
        items,
    });
}

module.exports = { subirArchivo, enviarArchivo }