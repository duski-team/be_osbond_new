import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import broadcast_m from './model.js'
import penerima_broadcast from '../penerima_broadcast/model.js';
import kirim_notif from '../../helper/fcm.js';

export class Controller {

    static async register(req, res) {
        const { nama_broadcast, konten_broadcast,tanggal_awal_broadcast,tanggal_akhir_broadcast,tipe_penerima,usia_awal,usia_akhir } = req.body

        try {
            let f1
            if (req.files) {
                if (req.files.file1) {
                    f1 = req.files.file1[0].key;
                }
            }

            let data = await broadcast_m.create({ id: nanoid(14), nama_broadcast, konten_broadcast,tanggal_awal_broadcast,tanggal_akhir_broadcast,tipe_penerima,gambar_broadcast:f1,usia_awal,usia_akhir })

            let isi =''


            // let penerima = await sq.query(`select * from ""`)
            let fcm_id=['cGm1WS_CSDy0ZsxjCnIshU:APA91bHMq2fq7psKkFaDRFa7bnEgVucwC-LnVlugmOtQC2KP68fG4GqsadL78UynUJ1ZDM649xe28JW3gg2lNL1W6ZHQaYg_lOE0pdTs8GjNCk37LgwDImw','esq-pvAQR-iwbFG9jHSC81:APA91bFjkR2Pl9obvH_7RtJ_W35vhKhUG2yocNmU7QfHRDHmST2ZU2RjtfVCsg982LuPsDLs3uWz_bzsXN3XoEyfRm3-ls6UL4XSbavfB345--U3Z5MnoMU']

            kirim_notif(nama_broadcast,konten_broadcast)

            res.status(200).json({ status: 200, message: "sukses", data })

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req, res) {
        const { id, nama_broadcast, konten_broadcast,tanggal_awal_broadcast,tanggal_akhir_broadcast,tipe_penerima,usia_awal,usia_akhir } = req.body

        try {
            await sq.transaction(async t => {
                if (req.files) {
                    if (req.files.file1) {
                        await broadcast_m.update({ gambar_broadcast: req.files.file1[0].key }, { where: { id }, transaction: t })
                    }
                }
                let data = await broadcast_m.update({ nama_broadcast, konten_broadcast,tanggal_awal_broadcast,tanggal_akhir_broadcast,tipe_penerima,usia_awal,usia_akhir }, { where: { id }, transaction: t })
                res.status(200).json({ status: 200, message: "sukses" });
            })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async delete(req, res) {
        const { id } = req.body

        try {
            await broadcast_m.destroy({ where: { id } })
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list(req, res) {
        const { halaman, jumlah,id, nama_broadcast,tanggal_awal_broadcast,tanggal_akhir_broadcast,tipe_penerima } = req.body

        try {
            let isi = ''
            let isi2 = ''
            if (nama_broadcast) {
                isi += ` and b.nama_broadcast ilike :nama_broadcast `
            }
            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }
            if(tanggal_awal_broadcast){
                isi+=` and b.tanggal_awal_broadcast >= :tanggal_awal_broadcast `
            }
            if(tanggal_akhir_broadcast){
                isi+=` and b.tanggal_akhir_broadcast <= :tanggal_akhir_broadcast `
            }
            if (tipe_penerima) {
                isi += ` and b.tipe_penerima = :tipe_penerima `
            }
            if (id) {
                isi += ` and b.id = :id `
            }

            let data = await sq.query(`select b.id as broadcast_id,*
            from broadcast b
            where b."deletedAt" isnull ${isi} order by b."createdAt" desc ${isi2}`,
                tipe({ offset: (+halaman * jumlah), jumlah,id,tanggal_awal_broadcast,tanggal_akhir_broadcast,tipe_penerima,nama_broadcast:`%${nama_broadcast}%` }))
            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as "total" from broadcast b
                where b."deletedAt" isnull ${isi}`, tipe({ id,tanggal_awal_broadcast,tanggal_akhir_broadcast,tipe_penerima,nama_broadcast:`%${nama_broadcast}%` }))
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

    static async details_by_id(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select b.id as broadcast_id,*
            from broadcast b
            where b."deletedAt" isnull and b.id = :id`, tipe({ id }))
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
}

