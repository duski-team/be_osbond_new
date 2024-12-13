import { sq ,osbond} from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'


export class Controller {

    static async list(req,res){
        try {
            let data = await osbond.query(`SELECT * FROM APPS_LISTCLUB()`,tipe())
            data = data.recordset
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
}