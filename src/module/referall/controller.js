import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import referall from './model.js'

export class Controller {

    static async register(req, res) {
        const { pengguna_referall_id, kode_referall, tanggal_referall,user_referall_id } = req.body

        try {
           

            let data = await referall.create({ id: nanoid(14), pengguna_referall_id, kode_referall, tanggal_referall,user_referall_id })
            res.status(200).json({ status: 200, message: "sukses", data })

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req, res) {
        const { id, pengguna_referall_id, kode_referall, tanggal_referall,user_referall_id } = req.body

        try {
         
             
                let data = await referall.update({ pengguna_referall_id, kode_referall, tanggal_referall,user_referall_id }, { where: { id } })
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
            await referall.destroy({ where: { id } })
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list(req, res) {
        const { halaman, jumlah,pengguna_referall_id, kode_referall, tanggal_referall,user_referall_id } = req.body

        try {
            let isi = ''
            let isi2 = ''

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }
            if (pengguna_referall_id) {
                isi += ` and r.pengguna_referall_id  = :pengguna_referall_id `
            }
            if (kode_referall) {
                isi += ` and r.kode_referall  = :kode_referall `
            }
            if (tanggal_referall) {
                isi += ` and r.tanggal_referall  = :tanggal_referall `
            }
            if (user_referall_id) {
                isi += ` and r.user_referall_id  = :user_referall_id `
            }

           

            let data = await sq.query(`select r.*, u1.nama_user, u2.nama_user from referall r join user u1 on r.pengguna_referall_id = u1.id join user u2 on r.user_referall_id = u2.id where r."deletedAt" isull ${isi} order by r."createdAt" desc ${isi2}`,
                tipe({ nama_banner: `%${nama_banner}%`, status_banner, offset: (+halaman * jumlah), jumlah: jumlah }))
            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as "total" from referall r where r."deletedAt" isull  ${isi}`, tipe({ nama_banner: `%${nama_banner}%`, status_banner }))
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

    static async referall_terbanyak(req,res){
        
    }

}

