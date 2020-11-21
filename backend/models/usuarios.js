const { Schema, model } = require('mongoose'); // extrae schema y model y los deja declarados con el mismo nombre(desestructuración)

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'ROL_ALUMNO'
    },
    alta: { // se generá de manera automática en la BD
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }
    /* ,
        grupo: {
            type: Schema.Types.ObjectId, // indica que debe ser identificador de mongo
            ref: 'Grupo' // hace referencia a grupo
        }, */
}, { collection: 'usuarios' }); // indica nombre de la colección en la BD (sino se indica se llama igual que model + 's')

// Sobreescribimos método que se encarga de escribir en JSON el contenido de un modelo (sobreescribe a toJSON)
UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject(); // se extrae versión,id,password y resto se pasa a object
    object.uid = _id; //añadimos propiedad uid

    return object;
})


module.exports = model('Usuario', UsuarioSchema);