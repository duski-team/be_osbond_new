import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import referral from './model.js'

export class Controller {

    static async register(req, res) {
        const { pengguna_referral_id, kode_referral, tanggal_referral,user_referral_id } = req.body

        try {
           

            let data = await referral.create({ id: nanoid(14), pengguna_referral_id, kode_referral, tanggal_referral,user_referral_id })
            res.status(200).json({ status: 200, message: "sukses", data })

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req, res) {
        const { id, pengguna_referral_id, kode_referral, tanggal_referral,user_referral_id } = req.body

        try {
         
             
                let data = await referral.update({ pengguna_referral_id, kode_referral, tanggal_referral,user_referral_id }, { where: { id } })
                res.status(200).json({ status: 200, message: "sukses" });
     
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async delete(req, res) {
        const { id } = req.body

        try {
            await referral.destroy({ where: { id } })
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list(req, res) {
        const { halaman, jumlah,id,pengguna_referral_id, kode_referral, tanggal_referral_awal,tanggal_referral_akhir,user_referral_id, } = req.body

        try {
            let isi = ''
            let isi2 = ''

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            } 
            if (id) {
                isi += ` and r.id  = :id `
            }
            if (pengguna_referral_id) {
                isi += ` and r.pengguna_referral_id  = :pengguna_referral_id `
            }
            if (kode_referral) {
                isi += ` and r.kode_referral  = :kode_referral `
            }
            if (tanggal_referral_awal) {
                isi += ` and r.tanggal_referral  >= :tanggal_referral_awal `
            }
            if (tanggal_referral_akhir) {
                isi += ` and r.tanggal_referral  <= :tanggal_referral_akhir `
            }
            if (user_referral_id) {
                isi += ` and r.user_referral_id  = :user_referral_id `
            }

           

            let data = await sq.query(`select r.*, u1.nama_user as nama_pengguna_referral, u2.nama_user as nama_user_referral,u1.foto_user as foto_pengguna_referral, u2.foto_user as foto_user_referral from referral r join "user" u1 on r.pengguna_referral_id = u1.id join "user" u2 on r.user_referral_id = u2.id where r."deletedAt" isnull ${isi} order by r."createdAt" desc ${isi2}`,
                tipe({ offset: (+halaman * jumlah), jumlah,id,pengguna_referral_id,kode_referral,tanggal_referral_awal,tanggal_referral_akhir,user_referral_id }))
            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as "total" from referral r where r."deletedAt" isull  ${isi}`, tipe({id,pengguna_referral_id,kode_referral,tanggal_referral_awal,tanggal_referral_akhir,user_referral_id }))
                res.status(200).json({ status: 200, message: "sukses", data, count: jml[0].total, jumlah, halaman })
            } else {
                res.status(200).json({ status: 200, message: "sukses", data })
            }
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async referral_terbanyak(req,res){
        try {
            let data = await sq.query(`select count(*),u2.nama_user from referral r join "user" u1 on r.pengguna_referral_id = u1.id 
            join "user" u2 on r.user_referral_id = u2.id where r."deletedAt" isnull group by u2.nama_user order by count(*) desc `)

            res.status(200).json({ status: 200, message: "sukses", data })
                        

        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async cek_referral(req,res){
        const{kode_referral}=req.body

        try {
            let data = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.kode_referral =:kode_referral`,tipe({kode_referral}))
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

}

