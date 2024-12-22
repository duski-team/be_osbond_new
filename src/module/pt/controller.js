import { sq ,osbond} from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import user from '../user/model.js';
import { uuid } from 'uuidv4';


export class Controller {

    static async list(req,res){
        try {
            let data = await osbond.query(`SELECT * FROM APPS_LISTTRAINER()`,tipe())
            data = data.recordset
            res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async details_by_club_id(req,res){
        const{club_id}=req.body
        try {
            let data = await osbond.query(`SELECT * FROM APPS_LISTTRAINER()`,tipe())
            data = data.recordset
            let detail=[]
            data.forEach(el => {        
               if(el.CLUB==club_id){
                detail.push(el)
               }
            });
            res.status(200).json({ status: 200, message: "sukses" ,detail})
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async sync_pt(req,res){
        try {
            let data = await osbond.query(`SELECT * FROM APPS_LISTTRAINER()`,tipe())
            data = data.recordset
            let bulknya=[]
            data.forEach(el => {        
                bulknya.push({
                    id:nanoid(14),
                    username:el.ID,
                    nama_user:el.NAMA,
                    nik:el.NIK,
                    role:"PT",
                    kode_club:el.CLUB,
                    // no_hp_user:el.HP
                })
             });
            await user.bulkCreate(bulknya,{updateOnDuplicate:["nik"]})

            res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
}