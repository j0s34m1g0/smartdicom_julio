"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarJWT = (req, res, next) => {
    try {
        //Leer el token
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la peticion'
            });
        }
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET + '');
        req.id = id;
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
};
exports.validarJWT = validarJWT;
