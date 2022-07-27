import { Schema, model } from 'mongoose';

const SintomaSchema = new Schema({
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

SintomaSchema.methods.toJSON = function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = this._id;
    return object;
}

export default model('Sintoma', SintomaSchema);