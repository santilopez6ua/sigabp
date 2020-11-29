const mongoose = require('mongoose');


//await y async para esperar a que se ejecuta acción
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DBCONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
}

module.exports = { dbConnection };