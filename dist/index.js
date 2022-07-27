"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server_1 = __importDefault(require("./classes/server"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./database/config");
//Rutas
const usuarioRout_1 = __importDefault(require("./routes/usuarioRout"));
const auth_1 = __importDefault(require("./routes/auth"));
const rolRout_1 = __importDefault(require("./routes/rolRout"));
const moduloRout_1 = __importDefault(require("./routes/moduloRout"));
const diagnosticoRout_1 = __importDefault(require("./routes/diagnosticoRout"));
const sintomaRout_1 = __importDefault(require("./routes/sintomaRout"));
const laboratorioRout_1 = __importDefault(require("./routes/laboratorioRout"));
const antecedenteRout_1 = __importDefault(require("./routes/antecedenteRout"));
//Conexion a base de datos Mongo
(0, config_1.dbConnectionMongo)();
const server = server_1.default.instance;
const path = '/api';
//BodyParser
server.app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
server.app.use(body_parser_1.default.json({ limit: '50mb' }));
//CORS
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
const html = '<title>Api rest</title><p><b>Api rest</b> <span style="color: green;">Online</span> </p>';
//Rutas de servicios
server.app.get('/', (req, res) => {
    res.send(html);
});
server.app.get(`${path}`, (req, res) => {
    res.send(html);
});
server.app.use(`${path}/sesion`, auth_1.default);
server.app.use(`${path}/usuario`, usuarioRout_1.default);
server.app.use(`${path}/rol`, rolRout_1.default);
server.app.use(`${path}/modulo`, moduloRout_1.default);
server.app.use(`${path}/diagnostico`, diagnosticoRout_1.default);
server.app.use(`${path}/sintoma`, sintomaRout_1.default);
server.app.use(`${path}/laboratorio`, laboratorioRout_1.default);
server.app.use(`${path}/antecedente`, antecedenteRout_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
