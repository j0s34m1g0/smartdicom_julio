import { Client } from 'pg';

const conectionData = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    port: Number(process.env.PORT_DB),
    database: process.env.DATABASE_POSTGRES
}

function initializeConnection() {
    try {
        const client = new Client(conectionData)
        client.connect(err => {
            if (err) {
                console.error('error al conectarse', err.stack);
            }
        });
        return client;
    } catch (error) {
        throw new Error('Error al iniciar la Base de datos');
    }
}

const connection = initializeConnection();

export default connection;