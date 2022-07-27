import express from 'express';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {

        this.app = express();
        this.port = Number(process.env.PORT) || 5000;
        // this.app.use(express.urlencoded({ limit: '50mb', extended: false }));

        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private escucharSockets() {
        this.io.on('connection', cliente => {

            //Conectar cliete
            socket.conectarCliente(cliente, this.io);

            //Configurar usuario
            socket.configurarUsuario(cliente, this.io);

            //Obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);

            //Recibiendo mensajes
            socket.mensaje(cliente, this.io);

            //Escuchar cuando estan escribiendo
            socket.emitirEscribiendo(cliente, this.io);

            //Escuchar cuando se detubo la escritura
            socket.emitirStopEscribir(cliente, this.io);

            //Escuchar invitacion a video llamada
            socket.emitirInvitacionVideo(cliente, this.io);

            //Responder invitacion a video llamada
            socket.emitirRespuestaVideo(cliente, this.io);

            //Emitir streaming de video
            socket.emitirStream(cliente, this.io);

            //Emitir stop video llamada
            socket.emitirCloseVideoStreaming(cliente, this.io);

            //Emitir Cancelacion de invitacion video llamada
            socket.emitirCancelarInvitacionVideo(cliente, this.io);

            //Desconectar
            socket.desconectar(cliente, this.io);

        });
    }

    start(callback: any) {

        this.httpServer.listen(this.port, callback);
    }
}