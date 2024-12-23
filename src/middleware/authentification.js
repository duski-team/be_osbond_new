import userModel from '../module/user/model.js';
import { verifyToken } from '../helper/jwt.js';

async function authentification(req, res, next) {
    try {
        // console.log(req.headers);
        
        let token = req.headers.authorization.split(' ')[1]
        let decode = verifyToken(token);
        let cekUser = await userModel.findAll({ where: { id: decode.id, password: decode.password } })
        
        if (cekUser.length > 0) {
            req.dataUser = decode
            next()
        } else {
            res.status(201).json({ status: 204, message: "anda belum login" });
        }
    } catch (err) {
        console.log(err);
        res.status(201).json({ status: 204, message: "anda belum login" });
    }
}

// async function authentification(req, res, next) {
//     try {
//         next()
//     } catch (err) {
//         console.log(err);
//         res.status(201).json({ status: 201, message: "anda belum login" });
//     }
// }



export default authentification