"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsuarioSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
    const _a = this.toObject(), { __v, _id, password } = _a, object = __rest(_a, ["__v", "_id", "password"]);
    object.id = this._id;
    return object;
};
exports.default = (0, mongoose_1.model)('Usuario', UsuarioSchema);
