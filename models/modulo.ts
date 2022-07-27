import { Schema, model } from 'mongoose';

const ModuloSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    nivel: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Rol'
    }],
});

ModuloSchema.methods.toJSON = function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = this._id;
    return object;
  }

export default model('Modulo', ModuloSchema);