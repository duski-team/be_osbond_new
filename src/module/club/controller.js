import { sq ,osbond} from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'


// async function asd() {
//     let data = await osbond.query(`EXEC APPS_DISTANCE '-7.072044','110.420251'`)
//     console.log(data.recordset);
    
//     return data
// }

// console.log(asd());



export class Controller {

    static async list(req,res){
        try {
            let data = await osbond.query(`SELECT * FROM APPS_LISTCLUB()`,tipe())
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
            let data = await osbond.query(`SELECT * FROM APPS_LISTCLUB()`,tipe())
            data = data.recordset
            let detail=``
            data.forEach(el => {        
               if(el.club_id==club_id){
                detail=el
               }
            });
            res.status(200).json({ status: 200, message: "sukses" ,detail})
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async jarak_terdekat(req,res){
        const{lat,long}=req.body
        try {
            
            let jarak = await osbond.query(`EXEC APPS_DISTANCE '${lat}','${long}'`)
            let data= jarak.recordset
            res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
}