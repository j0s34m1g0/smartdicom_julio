"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuariosLista = void 0;
class usuariosLista {
    constructor() {
        this.lista = [];
    }
    agregar(usuario) {
        this.lista.push(usuario);
        return usuario;
    }
    actualizarUsuario(idWs, usuarioSes) {
        for (let usuario of this.lista) {
            if (usuario.idWs === idWs) {
                usuario.nombre = usuarioSes.nom_usr !== 'sin-nombre' ? `${usuarioSes.nom_usr} ${usuarioSes.ape_usr}` : usuarioSes.nom_usr;
                usuario.id = usuarioSes.cod_usr;
                break;
            }
        }
    }
    //Obtener lista de usuarios
    getLista() {
        return this.lista.filter(usuario => usuario.nombre !== 'sin-nombre');
    }
    getusuario(idWs) {
        return this.lista.find(usuario => usuario.idWs === idWs);
    }
    // obtener usuario por codigo 
    getusuarioId(cod_usr) {
        return this.lista.find(usuario => usuario.id === cod_usr);
    }
    //Obtener usuarios en una sala en particular
    getUsuariosEnSala(sala) {
        let list = this.lista.filter(usuario => usuario.sala === sala);
        return list !== undefined ? list[0] : list;
    }
    //Borrar usuario
    borrarUsuario(idWs) {
        const tempUsuario = this.getusuario(idWs);
        this.lista = this.lista.filter(usuario => usuario.idWs !== idWs);
        return tempUsuario;
    }
}
exports.usuariosLista = usuariosLista;
