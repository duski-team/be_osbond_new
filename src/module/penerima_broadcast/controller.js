import { osbond, sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import penerima_broadcast from './model.js'
import moment from 'moment';
moment.updateLocale('id', {/**/ });
moment.locale("id")




export class Controller {

    static async list(req,res){
        const{user_id}=req.body
        try {
            let data = await sq.query(`select pb.id as penerima_broadcast_id,* from penerima_broadcast pb join "user" u on u.id = pb.user_id
                join broadcast b on b.id = pb.broadcast_id
                where now()<=b.tanggal_akhir_broadcast and now()>= b.tanggal_awal_broadcast and u.id = :user_id`,tipe({user_id}))
                res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
   

}