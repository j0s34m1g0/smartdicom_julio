"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const conectionData = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    port: Number(process.env.PORT_DB),
    database: process.env.DATABASE_POSTGRES
};
function initializeConnection() {
    try {
        const client = new pg_1.Client(conectionData);
        client.connect(err => {
            if (err) {
                console.error('error al conectarse', err.stack);
            }
        });
        return client;
    }
    catch (error) {
        throw new Error('Error al iniciar la Base de datos');
    }
}
const connection = initializeConnection();
exports.default = connection;
