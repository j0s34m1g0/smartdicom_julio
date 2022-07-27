import { Router, Request, Response } from 'express';

// Modelo
import Rol from '../models/rol'


const rolRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

rolRout.post('/save', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        let { modulos } = req.body;
        modulos = JSON.parse(modulos);

        let obj = req.body;
        obj.modulos = modulos;

        const rol: any = new Rol(obj);

        //Guardando Rol
        await rol.save();

        var jsonString = {
            ok: true,
            rol
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

rolRout.get('/findById/:id', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const rol = await Rol.findById(id)
            .populate('modulos');

        var jsonString = {
            ok: true,
            rol
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

rolRout.get('/find', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre: any = req.query.nombre || '';
        const value: any = req.query.value || '';

        const regex = new RegExp(nombre, 'i');
        let query: any = {
            nombre: regex
        }

        if (value !== '') {
            query.value = value;
        }

        const [roles, total] = await Promise.all([
            Rol.find(query)
                .populate({ path: 'modulos', populate: { path: 'modulos' } })
                .skip(desde)
                .limit(limite),
            Rol.countDocuments(query)
        ]);

        var jsonString = {
            ok: true,
            roles,
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


rolRout.post('/update', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        let { modulos } = req.body;
        modulos = JSON.parse(modulos);
        
        const data: any = req.body;
        data.modulos = modulos;

        const rol = await Rol.findById(data.id);

        if (!rol) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        //Actualizar Rol
        const rolActualizado = await Rol.findByIdAndUpdate(data.id, data, { new: true });

        var jsonString = {
            ok: true,
            rol: rolActualizado
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



export default rolRout;