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
const rol_1 = __importDefault(require("../models/rol"));
const rolRout = (0, express_1.Router)();
const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};
rolRout.post('/save', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        let { modulos } = req.body;
        modulos = JSON.parse(modulos);
        let obj = req.body;
        obj.modulos = modulos;
        const rol = new rol_1.default(obj);
        //Guardando Rol
        yield rol.save();
        var jsonString = {
            ok: true,
            rol
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
rolRout.get('/findById/:id', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const rol = yield rol_1.default.findById(id)
            .populate('modulos');
        var jsonString = {
            ok: true,
            rol
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
rolRout.get('/find', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre = req.query.nombre || '';
        const value = req.query.value || '';
        const regex = new RegExp(nombre, 'i');
        let query = {
            nombre: regex
        };
        if (value !== '') {
            query.value = value;
        }
        const [roles, total] = yield Promise.all([
            rol_1.default.find(query)
                .populate({ path: 'modulos', populate: { path: 'modulos' } })
                .skip(desde)
                .limit(limite),
            rol_1.default.countDocuments(query)
        ]);
        var jsonString = {
            ok: true,
            roles,
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
rolRout.post('/update', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        let { modulos } = req.body;
        modulos = JSON.parse(modulos);
        const data = req.body;
        data.modulos = modulos;
        const rol = yield rol_1.default.findById(data.id);
        if (!rol) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        //Actualizar Rol
        const rolActualizado = yield rol_1.default.findByIdAndUpdate(data.id, data, { new: true });
        var jsonString = {
            ok: true,
            rol: rolActualizado
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
exports.default = rolRout;
