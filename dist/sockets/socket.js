"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitirCancelarInvitacionVideo = exports.emitirCloseVideoStreaming = exports.emitirStream = exports.emitirRespuestaVideo = exports.emitirInvitacionVideo = exports.emitirStopEscribir = exports.emitirEscribiendo = exports.obtenerUsuarios = exports.configurarUsuario = exports.mensaje = exports.desconectar = exports.conectarCliente = exports.usuariosConectados = void 0;
const usuarios_lista_1 = require("../services/usuarios-lista");
const UsuarioWs_1 = require("../models/UsuarioWs");
exports.usuariosConectados = new usuarios_lista_1.usuariosLista();
const conectarCliente = (cliente, io) => {
    const usuarioWs = new UsuarioWs_1.UsuarioWs(cliente.id);
    exports.usuariosConectados.agregar(usuarioWs);
};
exports.conectarCliente = conectarCliente;
const desconectar = (cliente, io) => {
    cliente.on('disconnect', () => {
        exports.usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', exports.usuariosConectados.getLista());
    });
};
exports.desconectar = desconectar;
//Escuchar mensajes
const mensaje = (cliente, io) => {
    cliente.on('mensaje', (payload) => {
        io.emit('mensaje-grupo', payload);
    });
};
exports.mensaje = mensaje;
//Configurar usuario
const configurarUsuario = (cliente, io) => {
    cliente.on('configurar-usuario', (payload, callback) => {
        exports.usuariosConectados.actualizarUsuario(cliente.id, payload.usuario);
        io.emit('usuarios-activos', exports.usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `usuario ${payload.usuario.nom_usr}, configurado`
        });
    });
};
exports.configurarUsuario = configurarUsuario;
//Obtener usuarios
const obtenerUsuarios = (cliente, io) => {
    cliente.on('obtener-usuarios', () => {
        io.to(cliente.id).emit('usuarios-activos', exports.usuariosConectados.getLista());
    });
};
exports.obtenerUsuarios = obtenerUsuarios;
//Escuchar cuando estan escribiendo
const emitirEscribiendo = (cliente, io) => {
    cliente.on('escribiendo', (payload) => {
        if (!payload.grupo) {
            let usuario = exports.usuariosConectados.getusuarioId(payload.destino);
            if (usuario !== undefined)
                io.in(usuario.idWs).emit('escribiendo', payload);
        }
    });
};
exports.emitirEscribiendo = emitirEscribiendo;
//Escuchar cuando se detubo la escritura
const emitirStopEscribir = (cliente, io) => {
    cliente.on('stop-escribir', (payload) => {
        if (!payload.grupo) {
            let usuario = exports.usuariosConectados.getusuarioId(payload.destino);
            if (usuario !== undefined)
                io.in(usuario.idWs).emit('stop-escribir', payload);
        }
    });
};
exports.emitirStopEscribir = emitirStopEscribir;
//Escuchar invitacion a video llamada
const emitirInvitacionVideo = (cliente, io) => {
    cliente.on('invitacion-video', (payload) => {
        let usuario = exports.usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('invitacion-video', payload);
    });
};
exports.emitirInvitacionVideo = emitirInvitacionVideo;
//Responder invitacion a video llamada
const emitirRespuestaVideo = (cliente, io) => {
    cliente.on('respuesta-video', (payload) => {
        let usuario = exports.usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('respuesta-video', payload);
    });
};
exports.emitirRespuestaVideo = emitirRespuestaVideo;
//Emitir streaming de video
const emitirStream = (cliente, io) => {
    cliente.on('stream', (payload) => {
        let usuario = exports.usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('stream', payload);
    });
};
exports.emitirStream = emitirStream;
//Emitir stop video llamada
const emitirCloseVideoStreaming = (cliente, io) => {
    cliente.on('stop-video', (payload) => {
        let usuario = exports.usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('stop-video', payload);
    });
};
exports.emitirCloseVideoStreaming = emitirCloseVideoStreaming;
//Emitir Cancelacion de invitacion video llamada
const emitirCancelarInvitacionVideo = (cliente, io) => {
    cliente.on('cancelar-invitacion', (payload) => {
        let usuario = exports.usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('cancelar-invitacion', payload);
    });
};
exports.emitirCancelarInvitacionVideo = emitirCancelarInvitacionVideo;
