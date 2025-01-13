import { osbond, sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import moment from 'moment';
moment.updateLocale('id', {/**/ });
moment.locale("id")




export class Controller {

    static async member_aktif_perbulan(req,res){
        try {
            let bulan_ini = moment().format('MM')
// console.log(bulan_ini);

            let data = await sq.query(`select count(*) from absensi a where  EXTRACT(MONTH FROM a.check_in) ='${bulan_ini}'`,tipe())
            res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
      
    }

    static async daily_check_in(req,res){
        try {
            let hari_ini = moment().format('YYYY-MM-DD')


            let data = await sq.query(`select count(*) from absensi a where date(a.check_in) = '${hari_ini}'`,tipe())
            res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
      
    }

    static async new_member(req,res){
        try {
            let bulan_ini = moment().format('MM')


            let data = await sq.query(`select count(*) from "user" u where  EXTRACT(MONTH FROM u."createdAt") ='${bulan_ini}'`,tipe())
            res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
      
    }
   

}