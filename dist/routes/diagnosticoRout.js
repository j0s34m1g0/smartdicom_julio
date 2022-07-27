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
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
// Modelo
const diagnostico_1 = __importDefault(require("../models/diagnostico"));
const diagnosticoRout = (0, express_1.Router)();
const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};
diagnosticoRout.post('/save', [
    (0, express_validator_1.check)('cie10', 'El codigo cie10 es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validar_campos_1.validarCampos
], (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const diagnostico = new diagnostico_1.default(req.body);
        //Guardando Diagnostico
        yield diagnostico.save();
        var jsonString = {
            ok: true,
            diagnostico
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
diagnosticoRout.get('/findById/:id', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const diagnostico = yield diagnostico_1.default.findById(id);
        var jsonString = {
            ok: true,
            diagnostico
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
diagnosticoRout.get('/find', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre = req.query.nombre || '';
        const cie10 = req.query.cie10 || '';
        const regex = new RegExp(nombre, 'i');
        let query = {
            nombre: regex
        };
        if (cie10 !== '') {
            query.cie10 = cie10;
        }
        const [diagnosticos, total] = yield Promise.all([
            diagnostico_1.default.find(query)
                .skip(desde)
                .limit(limite),
            diagnostico_1.default.countDocuments(query)
        ]);
        var jsonString = {
            ok: true,
            diagnosticos,
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
diagnosticoRout.post('/update', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const data = req.body;
        const diagnostico = yield diagnostico_1.default.findById(data.id);
        if (!diagnostico) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        //Actualizar diagnostico
        const diagnosticoActualizado = yield diagnostico_1.default.findByIdAndUpdate(data.id, data, { new: true });
        var jsonString = {
            ok: true,
            diagnostico: diagnosticoActualizado
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
exports.default = diagnosticoRout;
