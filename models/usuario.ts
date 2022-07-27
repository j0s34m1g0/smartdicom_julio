import { Schema, model } from 'mongoose';

const UsuarioSchema = new Schema({
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    tipo_documento: {
        type: String,
        required: true
    },
    nro_documento: {
        type: String,
        required: true,
        unique: true
    },
    sexo: {
        type: String,
       // required: true
    },
    correo: {
        type: String
    },
    celular: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        //required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Rol'
    },
    fecha_creacion: {
        type: Number,
        default: (new Date()).getTime()
    },
    estado: {
        type: Boolean,
        default: true
    }
}, { collection: 'usuarios' });

UsuarioSchema.methods.toJSON = function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.id = this._id;
    return object;
}

export default model('Usuario', UsuarioSchema);