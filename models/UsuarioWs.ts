

export class UsuarioWs {
    public idWs: string;
    public id: string;
    public nombre: string;
    public sala: string;

    constructor(idWs: string) {
        this.idWs = idWs;
        this.id = 'sin-id'
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
    }
}