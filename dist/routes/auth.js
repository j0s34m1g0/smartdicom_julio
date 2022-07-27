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
const usuario_1 = __importDefault(require("../models/usuario"));
const jwt_1 = require("../helpers/jwt");
const validar_jws_1 = require("../middlewares/validar-jws");
const authRout = (0, express_1.Router)();
const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};
authRout.post('/login', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const { usuario, password } = req.body;
        //verificar usuario
        const usuarioBD = yield usuario_1.default.findOne({ usuario });
        if (!usuarioBD) {
            return respuesta.status(200).json({
                ok: false,
                token: 'Usuario o contraseña incorrecta'
            });
        }
        // verificar contraseña
        const validPassword = bcryptjs_1.default.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return respuesta.status(200).json({
                ok: false,
                token: 'Usuario o contraseña incorrecta'
            });
        }
        //Generar token
        const token = yield (0, jwt_1.generarJWT)(usuarioBD.id);
        var jsonString = {
            ok: true,
            token
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
authRout.get('/renew', validar_jws_1.validarJWT, (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    respuesta.set(headers);
    const id = req.id;
    //Generar token
    const token = yield (0, jwt_1.generarJWT)(id);
    const usuario = yield usuario_1.default.findById(id)
        .populate({ path: 'role', populate: { path: 'modulos' } });
    var jsonString = {
        ok: true,
        token,
        usuario
    };
    respuesta.status(200).json(jsonString);
}));
exports.default = authRout;
