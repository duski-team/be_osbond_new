import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import absensi_m from './model.js'
import moment from 'moment';
moment.updateLocale('id', {/**/ });
moment.locale("id")


export class Controller {

    static async register(req,res){
        try {
            let { user_id, kode_club } = req.body;
            let tanggal = moment()
            // let jam_sekarang = moment().add(7, 'hours').format('HH:mm')
            let tanggal_sekarang = moment().add(7, 'hours').format('YYYY/MM/DD')
            let type=''
            let cek_absensi = await sq.query(`select * from absensi a where a."deletedAt" isnull  and a.user_id = :user_id and date(a.check_in) = :tanggal and a.check_out isnull and a.kode_club = :kode_club`, tipe({ user_id, tanggal: tanggal_sekarang, kode_club }))

            if (cek_absensi.length > 0) {
                type = 'check_out'
                await absensi_m.update({ check_out: tanggal }, { where: { id: cek_absensi[0].id } })
            } else {
                type = 'check_in'
                await absensi_m.create({ id: nanoid(14), check_in: tanggal, kode_club, user_id })
            }

            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req, res) {
        const { id, check_in, check_out, hand_towel, body_towel, kode_club, user_id } = req.body

        try {
            let data = await absensi_m.update({ check_in, check_out, hand_towel, body_towel, kode_club, user_id }, { where: { id } })
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async delete(req, res) {
        const { id } = req.body

        try {
            await absensi_m.destroy({ where: { id } })
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list(req, res) {
        const { halaman, jumlah, tanggal_awal, tanggal_akhir, hand_towel, body_towel, kode_club, user_id, nama_user } = req.body

        try {
            let isi = ''
            let isi2 = ''
            if (tanggal_awal) {
                isi += ` and date(a.check_in) >= :tanggal_awal `
            }
            if (tanggal_akhir) {
                isi += ` and date(a.check_in) <= :tanggal_akhir `
            }
            if (hand_towel) {
                isi += ` and a.hand_towel = :hand_towel `
            }
            if (body_towel) {
                isi += ` and a.body_towel = :body_towel `
            }
            if (kode_club) {
                isi += ` and a.kode_club = :kode_club `
            }
            if (nama_user) {
                isi += ` and u.nama_user ilike :nama_user `
            }
            if (user_id) {
                isi += ` and a.user_id = :user_id `
            }

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }

            let data = await sq.query(`select a.id as absensi_id,u.id as user_id,u.nama_user,a.*
            from absensi a
            left join "user" u on u.id = a.user_id
            where a."deletedAt" isnull ${isi} order by a."createdAt" desc ${isi2}`,
                tipe({ tanggal_awal, tanggal_akhir, hand_towel, body_towel, kode_club, user_id, nama_user: `%${nama_user}%`, offset: (+halaman * jumlah), jumlah: jumlah }))
            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as "total"  from absensi a
                left join "user" u on u.id = a.user_id
                where a."deletedAt" isnull ${isi}`, tipe({ tanggal_awal, tanggal_akhir, hand_towel, body_towel, kode_club, user_id, nama_user: `%${nama_user}%` }))

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

}