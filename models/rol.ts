import { Schema, model } from 'mongoose';

const RolSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

RolSchema.methods.toJSON = function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = this._id;
    return object;
}

export default model('Rol', RolSchema);