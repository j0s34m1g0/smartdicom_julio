import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario';
import { generarJWT } from '../helpers/jwt';
import { validarJWT } from '../middlewares/validar-jws';

const authRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

authRout.post('/login', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const { usuario, password } = req.body;
        //verificar usuario
        const usuarioBD: any = await Usuario.findOne({ usuario });
        if (!usuarioBD) {
            return respuesta.status(200).json({
                ok: false,
                token: 'Usuario o contraseña incorrecta'
            });
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return respuesta.status(200).json({
                ok: false,
                token: 'Usuario o contraseña incorrecta'
            });
        }

        //Generar token
        const token = await generarJWT(usuarioBD.id);

        var jsonString = {
            ok: true,
            token
        };

        respuesta.status(200).json(jsonString);
    } catch (err) {
        var bodyError = {
            ok: false,
            error: err
        };
        respuesta.status(500).json(bodyError);
    }
});


authRout.get('/renew', validarJWT, async (req: any, respuesta: Response) => {
    respuesta.set(headers);

    const id = req.id;
    //Generar token
    const token = await generarJWT(id);

    const usuario = await Usuario.findById(id)
        .populate({ path: 'role', populate: { path: 'modulos' } });

    var jsonString = {
        ok: true,
        token,
        usuario
    };

    respuesta.status(200).json(jsonString);
});


export default authRout;