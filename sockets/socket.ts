import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { usuariosLista } from '../services/usuarios-lista';
import { UsuarioWs } from '../models/UsuarioWs';


export const usuariosConectados = new usuariosLista();



export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
    const usuarioWs = new UsuarioWs(cliente.id);
    usuariosConectados.agregar(usuarioWs);
}

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });
}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: { cod_usr: string, destino: string, de: string, cuerpo: string, fecha: string }) => {
        io.emit('mensaje-grupo', payload);
    })
}

//Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload, callback: Function) => {
        usuariosConectados.actualizarUsuario(cliente.id, payload.usuario);

        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `usuario ${payload.usuario.nom_usr}, configurado`
        });
    });
}

//Obtener usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });
}

//Escuchar cuando estan escribiendo
export const emitirEscribiendo = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('escribiendo', (payload) => {
        if (!payload.grupo) {
            let usuario: any = usuariosConectados.getusuarioId(payload.destino);
            if (usuario !== undefined)
                io.in(usuario.idWs).emit('escribiendo', payload);
        }
    })
}

//Escuchar cuando se detubo la escritura
export const emitirStopEscribir = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('stop-escribir', (payload) => {
        if (!payload.grupo) {
            let usuario: any = usuariosConectados.getusuarioId(payload.destino);
            if (usuario !== undefined)
                io.in(usuario.idWs).emit('stop-escribir', payload);
        }
    })
}


//Escuchar invitacion a video llamada
export const emitirInvitacionVideo = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('invitacion-video', (payload) => {
        let usuario: any = usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('invitacion-video', payload);

    })
}

//Responder invitacion a video llamada
export const emitirRespuestaVideo = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('respuesta-video', (payload) => {
        let usuario: any = usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('respuesta-video', payload);

    })
}

//Emitir streaming de video
export const emitirStream = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('stream', (payload) => {
        let usuario: any = usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('stream', payload);

    })
}

//Emitir stop video llamada
export const emitirCloseVideoStreaming = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('stop-video', (payload) => {
        let usuario: any = usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('stop-video', payload);

    })
}

//Emitir Cancelacion de invitacion video llamada
export const emitirCancelarInvitacionVideo = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('cancelar-invitacion', (payload) => {
        let usuario: any = usuariosConectados.getusuarioId(payload.destino);
        if (usuario !== undefined)
            io.in(usuario.idWs).emit('cancelar-invitacion', payload);

    })
}

