import { Router, Request, Response } from 'express';

// Modelo
import Modulo from '../models/modulo'


const moduloRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

moduloRout.post('/save', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        let { roles } = req.body;
        roles = JSON.parse(roles);
        let obj = req.body;
        obj.roles = roles;
        const modulo: any = new Modulo(obj);

        //Guardando modulo
        await modulo.save();

        var jsonString = {
            ok: true,
            modulo
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

moduloRout.get('/findById/:id', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const modulo = await Modulo.findById(id);

        var jsonString = {
            ok: true,
            modulo
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

moduloRout.get('/find', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        const nombre: any = req.query.nombre || '';

        const regex = new RegExp(nombre, 'i');
        let query: any = {
            nombre: regex
        }

        const [modulos, total] = await Promise.all([
            Modulo.find(query)
                .skip(desde)
                .limit(limite),
                Modulo.countDocuments(query)
        ]);

        var jsonString = {
            ok: true,
            modulos,
            total
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


moduloRout.post('/update', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        let { roles } = req.body;
        roles = JSON.parse(roles);
        let obj = req.body;
        obj.roles = roles;
        const modulo = await Modulo.findById(obj.id);

        if (!modulo) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        //Actualizar modulo
        const moduloActualizado = await Modulo.findByIdAndUpdate(obj.id, obj, { new: true });

        var jsonString = {
            ok: true,
            modulo: moduloActualizado
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



export default moduloRout;