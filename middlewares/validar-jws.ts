import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const validarJWT = (req: any, res: Response, next: NextFunction) => {
    try {
        //Leer el token
        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la peticion'
            });
        }

        const { id }: any = jwt.verify(token, process.env.JWT_SECRET + '');
        req.id = id;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
}