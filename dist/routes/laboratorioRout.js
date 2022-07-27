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
const laboratorio_1 = __importDefault(require("../models/laboratorio"));
const laboratorioRout = (0, express_1.Router)();
const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};
laboratorioRout.post('/save', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const laboratorio = new laboratorio_1.default(req.body);
        //Guardando laboratorio
        yield laboratorio.save();
        var jsonString = {
            ok: true,
            laboratorio: laboratorio
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
laboratorioRout.get('/findById/:id', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const laboratorio = yield laboratorio_1.default.findById(id);
        var jsonString = {
            ok: true,
            laboratorio: laboratorio
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
laboratorioRout.get('/find', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre = req.query.nombre || '';
        const regex = new RegExp(nombre, 'i');
        let query = {
            nombre: regex
        };
        const [laboratorios, total] = yield Promise.all([
            laboratorio_1.default.find(query)
                .skip(desde)
                .limit(limite),
            laboratorio_1.default.countDocuments(query)
        ]);
        var jsonString = {
            ok: true,
            laboratorios,
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
laboratorioRout.post('/update', (req, respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        respuesta.set(headers);
        const data = req.body;
        const laboratorio = yield laboratorio_1.default.findById(data.id);
        if (!laboratorio) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }
        //Actualizar sintoma
        const laboratorioActualizado = yield laboratorio_1.default.findByIdAndUpdate(data.id, data, { new: true });
        var jsonString = {
            ok: true,
            laboratorio: laboratorioActualizado
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
exports.default = laboratorioRout;
