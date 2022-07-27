import { Router, Request, Response } from 'express';

// Modelo
import Laboratorio from '../models/laboratorio'


const laboratorioRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

laboratorioRout.post('/save', 
async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const laboratorio: any = new Laboratorio(req.body);

        //Guardando laboratorio
        await laboratorio.save();

        var jsonString = {
            ok: true,
            laboratorio: laboratorio
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

laboratorioRout.get('/findById/:id', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const laboratorio = await Laboratorio.findById(id);

        var jsonString = {
            ok: true,
            laboratorio: laboratorio
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

laboratorioRout.get('/find', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre: any = req.query.nombre || '';

        const regex = new RegExp(nombre, 'i');

        let query: any = {
            nombre: regex
        }

        const [laboratorios, total] = await Promise.all([
            Laboratorio.find(query)
                .skip(desde)
                .limit(limite),
                Laboratorio.countDocuments(query)
        ]);

        var jsonString = {
            ok: true,
            laboratorios,
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


laboratorioRout.post('/update', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const data: any = req.body;
        const laboratorio = await Laboratorio.findById(data.id);

        if (!laboratorio) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        //Actualizar sintoma
        const laboratorioActualizado = await Laboratorio.findByIdAndUpdate(data.id, data, { new: true });

        var jsonString = {
            ok: true,
            laboratorio: laboratorioActualizado
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



export default laboratorioRout;