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
const antecedente_1 = __importDefault(require("../models/antecedente"));
const antecedenteRout = (0, express_1.Router)();
const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};
antecedenteRout.post('/save', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const antecedente = new antecedente_1.default(req.body);
        //Guardando antecedente
        yield antecedente.save();
        var jsonString = {
            ok: true,
            antecedente: antecedente
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
antecedenteRout.get('/findById/:id', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const antecedente = yield antecedente_1.default.findById(id);
        var jsonString = {
            ok: true,
            antecedente: antecedente
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
antecedenteRout.get('/find', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre = req.query.nombre || '';
        const regex = new RegExp(nombre, 'i');
        let query = {
            nombre: regex
        };
        const [antecedentes, total] = yield Promise.all([
            antecedente_1.default.find(query)
                .skip(desde)
                .limit(limite),
            antecedente_1.default.countDocuments(query)
        ]);
        var jsonString = {
            ok: true,
            antecedentes: antecedentes,
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
antecedenteRout.post('/update', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const data = req.body;
        const antecedentes = yield antecedente_1.default.findById(data.id);
        if (!antecedentes) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        //Actualizar sintoma
        const antecedenteActualizado = yield antecedente_1.default.findByIdAndUpdate(data.id, data, { new: true });
        var jsonString = {
            ok: true,
            antecedente: antecedenteActualizado
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
exports.default = antecedenteRout;
