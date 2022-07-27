import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos';
// Modelo
import Diagnostico from '../models/diagnostico'


const diagnosticoRout = Router();

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Allow-Credentials": true
};

diagnosticoRout.post('/save', 
[
    check('cie10', 'El codigo cie10 es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],
async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const diagnostico: any = new Diagnostico(req.body);

        //Guardando Diagnostico
        await diagnostico.save();

        var jsonString = {
            ok: true,
            diagnostico
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

diagnosticoRout.get('/findById/:id', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const id = req.params.id;
        const diagnostico = await Diagnostico.findById(id);

        var jsonString = {
            ok: true,
            diagnostico
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

diagnosticoRout.get('/find', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
        const desde = Number(req.query.desde);
        const limite = Number(req.query.limite);
        const nombre: any = req.query.nombre || '';
        const cie10: any = req.query.cie10 || '';

        const regex = new RegExp(nombre, 'i');
        let query: any = {
            nombre: regex
        }

        if (cie10 !== '') {
            query.cie10 = cie10;
        }

        const [diagnosticos, total] = await Promise.all([
            Diagnostico.find(query)
                .skip(desde)
                .limit(limite),
                Diagnostico.countDocuments(query)
        ]);

        var jsonString = {
            ok: true,
            diagnosticos,
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


diagnosticoRout.post('/update', async (req: Request, respuesta: Response) => {
    try {
        respuesta.set(headers);
       const data: any = req.body;
        const diagnostico = await Diagnostico.findById(data.id);

        if (!diagnostico) {
            return respuesta.status(200).json({
                ok: false,
                msg: 'No existe id'
            });
        }

        //Actualizar diagnostico
        const diagnosticoActualizado = await Diagnostico.findByIdAndUpdate(data.id, data, { new: true });

        var jsonString = {
            ok: true,
            diagnostico: diagnosticoActualizado
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



export default diagnosticoRout;