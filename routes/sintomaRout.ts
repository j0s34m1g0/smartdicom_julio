import { Router, Request, Response } from 'express';

// Modelo
import Sintoma from '../models/sintoma'


const sintomaRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

sintomaRout.post('/save', 
async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const sintoma: any = new Sintoma(req.body);

        //Guardando sintoma
        await sintoma.save();

        var jsonString = {
            ok: true,
            sintoma
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

sintomaRout.get('/findById/:id', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const sintoma = await Sintoma.findById(id);

        var jsonString = {
            ok: true,
            sintoma
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

sintomaRout.get('/find', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre: any = req.query.nombre || '';

        const regex = new RegExp(nombre, 'i');

        let query: any = {
            nombre: regex
        }

        const [sintomas, total] = await Promise.all([
            Sintoma.find(query)
                .skip(desde)
                .limit(limite),
                Sintoma.countDocuments(query)
        ]);

        var jsonString = {
            ok: true,
            sintomas,
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


sintomaRout.post('/update', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
       const data: any = req.body;
        const sintomas = await Sintoma.findById(data.id);

        if (!sintomas) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        //Actualizar sintoma
        const sintomasActualizado = await Sintoma.findByIdAndUpdate(data.id, data, { new: true });

        var jsonString = {
            ok: true,
            sintoma: sintomasActualizado
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



export default sintomaRout;