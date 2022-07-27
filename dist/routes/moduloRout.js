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
// Modelo
const modulo_1 = __importDefault(require("../models/modulo"));
const moduloRout = (0, express_1.Router)();
const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};
moduloRout.post('/save', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        let { roles } = req.body;
        roles = JSON.parse(roles);
        let obj = req.body;
        obj.roles = roles;
        const modulo = new modulo_1.default(obj);
        //Guardando modulo
        yield modulo.save();
        var jsonString = {
            ok: true,
            modulo
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
moduloRout.get('/findById/:id', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const modulo = yield modulo_1.default.findById(id);
        var jsonString = {
            ok: true,
            modulo
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
moduloRout.get('/find', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        const nombre = req.query.nombre || '';
        const regex = new RegExp(nombre, 'i');
        let query = {
            nombre: regex
        };
        const [modulos, total] = yield Promise.all([
            modulo_1.default.find(query)
                .skip(desde)
                .limit(limite),
            modulo_1.default.countDocuments(query)
        ]);
        var jsonString = {
            ok: true,
            modulos,
            total
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
moduloRout.post('/update', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        let { roles } = req.body;
        roles = JSON.parse(roles);
        let obj = req.body;
        obj.roles = roles;
        const modulo = yield modulo_1.default.findById(obj.id);
        if (!modulo) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        //Actualizar modulo
        const moduloActualizado = yield modulo_1.default.findByIdAndUpdate(obj.id, obj, { new: true });
        var jsonString = {
            ok: true,
            modulo: moduloActualizado
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
exports.default = moduloRout;
