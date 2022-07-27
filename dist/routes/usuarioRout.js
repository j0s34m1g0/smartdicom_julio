"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
//Modelo
const usuario_1 = __importDefault(require("../models/usuario"));
const usuarioRout = (0, express_1.Router)();
const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};
usuarioRout.post('/save', [
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty(),
    (0, express_validator_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    validar_campos_1.validarCampos
], (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        let { password, usuario } = req.body;
        if (usuario) {
            const exiteUsuario = yield usuario_1.default.findOne({ usuario });
            if (exiteUsuario) {
                return respuesta.status(200).json({
                    ok: false,
                    msg: 'El Usuario ya está registrado'
                });
            }
        }
        let data = req.body;
        delete data.password;
        const usuarioN = new usuario_1.default(data);
        //Encriptar contraseña
        const salt = bcryptjs_1.default.genSaltSync();
        usuarioN.password = bcryptjs_1.default.hashSync(password, salt);
        //Guardando usuario
        yield usuarioN.save();
        var jsonString = {
            ok: true,
            usuario: usuarioN
        };
        respuesta.status(200).json(jsonString);
    }
    catch (err) {
        var bodyError = {
            ok: false,
            error: err
        };
        respuesta.status(500).json(bodyError);
    }
}));
usuarioRout.get('/findById/:id', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const usuario = yield usuario_1.default.findById(id)
            .populate({ path: 'role', populate: { path: 'modulos' } });
        var jsonString = {
            ok: true,
            usuario
        };
        respuesta.status(200).json(jsonString);
    }
    catch (err) {
        var bodyError = {
            ok: false,
            error: err
        };
        respuesta.status(500).json(bodyError);
    }
}));
usuarioRout.get('/find', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    respuesta.set(headers);
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 10;
    const nombres = req.query.nombres || '';
    const usuario = req.query.usuario || '';
    const regex = new RegExp(nombres, 'i');
    let query = {
        nombres: regex
    };
    if (usuario !== '') {
        query.usuario = usuario;
    }
    const [usuarios, total] = yield Promise.all([
        usuario_1.default.find(query)
            .populate('role')
            .skip(desde)
            .limit(limite),
        usuario_1.default.countDocuments(query)
    ]);
    var jsonString = {
        ok: true,
        usuarios,
        total
    };
    respuesta.status(200).json(jsonString);
}));
usuarioRout.get('/existe/:usuario', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const usuario = req.params.usuario;
        let valid = false;
        const usuarios = yield usuario_1.default.find({ usuario }, 'usuario role estado');
        if (usuarios.length !== 0)
            valid = true;
        var jsonString = {
            ok: true,
            existe: valid
        };
        respuesta.status(200).json(jsonString);
    }
    catch (err) {
        var bodyError = {
            ok: false,
            error: err
        };
        respuesta.status(500).json(bodyError);
    }
}));
usuarioRout.post('/update', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const usuario = yield usuario_1.default.findById(req.body.id);
        if (!usuario) {
            return respuesta.status(404).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        const data = req.body;
        delete data.password;
        delete data.usuario;
        //Actualizar usuario
        const usuarioActualizado = yield usuario_1.default.findByIdAndUpdate(usuario.id, data, { new: true });
        var jsonString = {
            ok: true,
            usuario: usuarioActualizado
        };
        respuesta.status(200).json(jsonString);
    }
    catch (err) {
        var bodyError = {
            ok: false,
            error: err
        };
        respuesta.status(500).json(bodyError);
    }
}));
usuarioRout.post('/updatePassword', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const { actual } = req.body;
        const usuario = yield usuario_1.default.findById(req.body.id);
        if (!usuario) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        const data = req.body;
        delete data.actual;
        // verificar contraseña
        const validPassword = bcryptjs_1.default.compareSync(actual, usuario.password);
        if (!validPassword) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'Contraseña actual no es valida'
            });
        }
        //Encriptar contraseña
        const salt = bcryptjs_1.default.genSaltSync();
        usuario.password = bcryptjs_1.default.hashSync(data.password, salt);
        //Actualizar contraseña de usuario
        const usuarioActualizado = yield usuario_1.default.findByIdAndUpdate(usuario.id, usuario, { new: true });
        var jsonString = {
            ok: true,
            usuario: usuarioActualizado
        };
        respuesta.status(200).json(jsonString);
    }
    catch (err) {
        var bodyError = {
            ok: false,
            error: err
        };
        respuesta.status(500).json(bodyError);
    }
}));
usuarioRout.post('/updatePassword2', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const usuario = yield usuario_1.default.findById(req.body.id);
        if (!usuario) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        const data = req.body;
        //Encriptar contraseña
        const salt = bcryptjs_1.default.genSaltSync();
        usuario.password = bcryptjs_1.default.hashSync(data.password, salt);
        //Actualizar contraseña de usuario
        const usuarioActualizado = yield usuario_1.default.findByIdAndUpdate(usuario.id, usuario, { new: true });
        var jsonString = {
            ok: true,
            usuario: usuarioActualizado
        };
        respuesta.status(200).json(jsonString);
    }
    catch (err) {
        var bodyError = {
            ok: false,
            error: err
        };
        respuesta.status(500).json(bodyError);
    }
}));
exports.default = usuarioRout;
