import dotenv from 'dotenv';
dotenv.config();
import Server from './classes/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import { dbConnectionMongo } from './database/config'

// Middelwares
import {validarJWT} from './middlewares/validar-jws';
//Rutas
import usuarioRout from './routes/usuarioRout';
import authRout from './routes/auth';
import rolRout from './routes/rolRout';
import moduloRout from './routes/moduloRout';
import diagnosticoRout from './routes/diagnosticoRout';
import sintomaRout from './routes/sintomaRout';
import laboratorioRout from './routes/laboratorioRout';
import antecedenteRout from './routes/antecedenteRout';


//Conexion a base de datos Mongo
dbConnectionMongo();

const server = Server.instance;
const path = '/api';

//BodyParser
server.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
server.app.use(bodyParser.json({ limit: '50mb' }))


//CORS
server.app.use(cors({ origin: true, credentials: true }));

const html = '<title>Api rest</title><p><b>Api rest</b> <span style="color: green;">Online</span> </p>';
//Rutas de servicios
server.app.get('/', (req, res) => {
    res.send(html);
});
server.app.get(`${path}`, (req, res) => {
    res.send(html);
});

server.app.use(`${path}/sesion`, authRout);
server.app.use(`${path}/usuario`,  usuarioRout);
server.app.use(`${path}/rol`, rolRout);
server.app.use(`${path}/modulo`, moduloRout);
server.app.use(`${path}/diagnostico`, diagnosticoRout);
server.app.use(`${path}/sintoma`, sintomaRout);
server.app.use(`${path}/laboratorio`, laboratorioRout);
server.app.use(`${path}/antecedente`, antecedenteRout);

server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});