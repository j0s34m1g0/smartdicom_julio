import mongoose from 'mongoose';

export const dbConnectionMongo = async () => {

    try {
        let host = process.env.HOST_LOCAL;
        let port = process.env.PORT_MONGO;
        let bd = process.env.DATABASE_LOCAL;

       mongoose.set('useCreateIndex', true);
        await mongoose.connect('mongodb://' + host + ':' + port + '/' + bd, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        // console.log('Conectado a Mongo');
    } catch (error) {
        throw new Error('Error al iniciar la Base de datos');
    }
}
