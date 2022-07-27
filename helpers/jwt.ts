import jwt from 'jsonwebtoken'

export const generarJWT = async (id: any) => {


    return new Promise((resolve, reject) => {

        const payload = {
            id
        };

        jwt.sign(payload, process.env.JWT_SECRET + '', {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });


}

