import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import foto_club from './model.js'

export class Controller {

    static async register(req, res) {
        const { kode_club } = req.body

        try {
            let f1
            if (req.files) {
                if (req.files.file1) {
                    f1 = req.files.file1[0].key;
                }
            }

            let data = await foto_club.create({ id: nanoid(14), kode_club,nama_foto:f1 })
            res.status(200).json({ status: 200, message: "sukses", data })

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req, res) {
        // const { id, kode_club } = req.body

        // try {
        //     await sq.transaction(async t => {
        //         if (req.files) {
        //             if (req.files.file1) {
        //                 await foto_club.update({ nama_foto: req.files.file1[0].key }, { where: { id }, transaction: t })
        //             }
        //         }
        //         let data = await foto_club.update({ nama_berita, status_berita, konten_berita,tanggal_awal_berita,tanggal_akhir_berita }, { where: { id }, transaction: t })
        //         res.status(200).json({ status: 200, message: "sukses" });
        //     })
        // } catch (error) {
        //     console.log(req.body)
        //     console.log(error)
        //     res.status(500).json({ status: 500, message: "gagal", data: error })
        // }
    }

    static async delete(req, res) {
        const { id } = req.body

        try {
            await foto_club.destroy({ where: { id } })
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list(req, res) {
        const { halaman, jumlah,id,kode_club } = req.body

        try {
            let isi = ''
            let isi2 = ''
            if (kode_club) {
                isi += ` and fc.kode_club = :kode_club `
            }
            if (id) {
                isi += ` and fc.id = :id `
            }
            

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }

            let data = await sq.query(`select fc.id as foto_club_id,*
            from foto_club fc
            where fc."deletedAt" isnull ${isi} order by fc."createdAt" desc ${isi2}`,
                tipe({  offset: (+halaman * jumlah), jumlah,id,kode_club}))
            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as "total" from foto_club fc
            where fc."deletedAt" isnull ${isi}`, tipe({ id,kode_club }))
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
            let data = await sq.query(`select b.id as berita_id,*
            from berita b
            where b."deletedAt" isnull and b.id = :id`, tipe({ id }))
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
}

