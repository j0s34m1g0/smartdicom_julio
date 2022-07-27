import { UsuarioWs } from '../models/UsuarioWs';
export class usuariosLista {
    private lista: UsuarioWs[] = [];

    constructor() {

    }

    public agregar(usuario: UsuarioWs) {
        this.lista.push(usuario);
        return usuario;
    }

    public actualizarUsuario(idWs: string, usuarioSes: any) {
        for (let usuario of this.lista) {
            if (usuario.idWs === idWs) {
                usuario.nombre = usuarioSes.nom_usr !== 'sin-nombre' ? `${usuarioSes.nom_usr} ${usuarioSes.ape_usr}` : usuarioSes.nom_usr;
                usuario.id = usuarioSes.cod_usr;
                break;
            }
        }
    }

    //Obtener lista de usuarios
    public getLista() {
        return this.lista.filter( usuario => usuario.nombre !== 'sin-nombre');
    }

    public getusuario(idWs: string) {
        return this.lista.find(usuario => usuario.idWs === idWs);

    }

    // obtener usuario por codigo 
    public getusuarioId(cod_usr: string) {
        return this.lista.find(usuario => usuario.id === cod_usr);
    }

    //Obtener usuarios en una sala en particular
    public getUsuariosEnSala(sala: string) {
        let list = this.lista.filter(usuario => usuario.sala === sala)
        return list !== undefined ? list[0] : list;
    }

    //Borrar usuario

    public borrarUsuario(idWs: string) {
        const tempUsuario = this.getusuario(idWs);
        this.lista = this.lista.filter(usuario => usuario.idWs !== idWs);
        return tempUsuario;
    }

}