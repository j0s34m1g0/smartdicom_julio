import { Router, Request, Response } from 'express';

// Modelo
import Antecedente from '../models/antecedente'


const antecedenteRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

antecedenteRout.post('/save', 
async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const antecedente: any = new Antecedente(req.body);

        //Guardando antecedente
        await antecedente.save();

        var jsonString = {
            ok: true,
            antecedente: antecedente
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

antecedenteRout.get('/findById/:id', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const antecedente = await Antecedente.findById(id);

        var jsonString = {
            ok: true,
            antecedente: antecedente
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

antecedenteRout.get('/find', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre: any = req.query.nombre || '';

        const regex = new RegExp(nombre, 'i');

        let query: any = {
            nombre: regex
        }

        const [antecedentes, total] = await Promise.all([
            Antecedente.find(query)
                .skip(desde)
                .limit(limite),
                Antecedente.countDocuments(query)
        ]);

        var jsonString = {
            ok: true,
            antecedentes: antecedentes,
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


antecedenteRout.post('/update', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
       const data: any = req.body;
        const antecedentes = await Antecedente.findById(data.id);

        if (!antecedentes) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        //Actualizar sintoma
        const antecedenteActualizado = await Antecedente.findByIdAndUpdate(data.id, data, { new: true });

        var jsonString = {
            ok: true,
            antecedente: antecedenteActualizado
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



export default antecedenteRout;