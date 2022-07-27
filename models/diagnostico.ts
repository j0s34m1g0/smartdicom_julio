import { Schema, model } from 'mongoose';

const DiagnosticoSchema = new Schema({
    cie10: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }
});

DiagnosticoSchema.methods.toJSON = function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = this._id;
    return object;
}

export default model('Diagnostico', DiagnosticoSchema);