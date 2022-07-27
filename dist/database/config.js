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
exports.dbConnectionMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnectionMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let host = process.env.HOST_LOCAL;
        let port = process.env.PORT_MONGO;
        let bd = process.env.DATABASE_LOCAL;
        mongoose_1.default.set('useCreateIndex', true);
        yield mongoose_1.default.connect('mongodb://' + host + ':' + port + '/' + bd, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        // console.log('Conectado a Mongo');
    }
    catch (error) {
        throw new Error('Error al iniciar la Base de datos');
    }
});
exports.dbConnectionMongo = dbConnectionMongo;
