import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos';

//Modelo
import Usuario from '../models/usuario';


const usuarioRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

usuarioRout.post('/save',
    [
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        validarCampos
    ],
    async (req: Request, respuesta: Response) => {
        try {
            respuesta.set(headers);
            let { password, usuario } = req.body;
            if (usuario) {
                const exiteUsuario = await Usuario.findOne({ usuario });
                if (exiteUsuario) {
                    return respuesta.status(200).json({
                        ok: false,
                        msg: 'El Usuario ya está registrado'
                    });
                }
            }
            let data = req.body;
            delete data.password;
            const usuarioN: any = new Usuario(data);

            //Encriptar contraseña
            const salt = bcrypt.genSaltSync();
            usuarioN.password = bcrypt.hashSync(password, salt);
            //Guardando usuario
            await usuarioN.save();

            var jsonString = {
                ok: true,
                usuario: usuarioN
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

usuarioRout.get('/findById/:id', async (req: any, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const usuario = await Usuario.findById(id)
            .populate({ path: 'role', populate: { path: 'modulos' } });

        var jsonString = {
            ok: true,
            usuario
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

usuarioRout.get('/find', async (req: Request, respuesta: Response) => {
    respuesta.set(headers);
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 10;
    const nombres: any = req.query.nombres || '';
    const usuario: any = req.query.usuario || '';

    const regex = new RegExp(nombres, 'i');
    let query: any = {
        nombres: regex
    }

    if (usuario !== '') {
        query.usuario = usuario;
    }

    const [usuarios, total] = await Promise.all([
        Usuario.find(query)
            .populate('role')
            .skip(desde)
            .limit(limite),
        Usuario.countDocuments(query)
    ]);

    var jsonString = {
        ok: true,
        usuarios,
        total
    };

    respuesta.status(200).json(jsonString);
});

usuarioRout.get('/existe/:usuario', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const usuario: any = req.params.usuario;
        let valid = false;
        const usuarios = await Usuario.find({ usuario }, 'usuario role estado');
        if (usuarios.length !== 0)
            valid = true;

        var jsonString = {
            ok: true,
            existe: valid
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

usuarioRout.post('/update', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);

        const usuario: any = await Usuario.findById(req.body.id);

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
        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario.id, data, { new: true });

        var jsonString = {
            ok: true,
            usuario: usuarioActualizado
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

usuarioRout.post('/updatePassword', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const { actual } = req.body;
        const usuario: any = await Usuario.findById(req.body.id);

        if (!usuario) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        const data = req.body;
        delete data.actual;
        // verificar contraseña
        const validPassword = bcrypt.compareSync(actual, usuario.password);
        if (!validPassword) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'Contraseña actual no es valida'
            });
        }

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(data.password, salt);

        //Actualizar contraseña de usuario
        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario.id, usuario, { new: true });

        var jsonString = {
            ok: true,
            usuario: usuarioActualizado
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

usuarioRout.post('/updatePassword2', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const usuario: any = await Usuario.findById(req.body.id);

        if (!usuario) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        const data = req.body;

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(data.password, salt);

        //Actualizar contraseña de usuario
        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario.id, usuario, { new: true });

        var jsonString = {
            ok: true,
            usuario: usuarioActualizado
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


export default usuarioRout;