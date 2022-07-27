import { Schema, model } from 'mongoose';

const LaboratorioSchema = new Schema({
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

LaboratorioSchema.methods.toJSON = function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = this._id;
    return object;
}

export default model('Laboratorio', LaboratorioSchema);