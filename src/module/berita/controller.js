import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import berita_m from './model.js'

export class Controller {

    static async register(req, res) {
        const { nama_berita, status_berita, konten_berita,tanggal_awal_berita,tanggal_akhir_berita } = req.body

        try {
            let f1
            if (req.files) {
                if (req.files.file1) {
                    f1 = req.files.file1[0].key;
                }
            }

            let data = await berita_m.create({ id: nanoid(14), nama_berita, status_berita, konten_berita, gambar_berita: f1,tanggal_awal_berita,tanggal_akhir_berita })
            res.status(200).json({ status: 200, message: "sukses", data })

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req, res) {
        const { id, nama_berita, status_berita, konten_berita,tanggal_awal_berita,tanggal_akhir_berita } = req.body

        try {
            await sq.transaction(async t => {
                if (req.files) {
                    if (req.files.file1) {
                        await berita_m.update({ gambar_berita: req.files.file1[0].key }, { where: { id }, transaction: t })
                    }
                }
                let data = await berita_m.update({ nama_berita, status_berita, konten_berita,tanggal_awal_berita,tanggal_akhir_berita }, { where: { id }, transaction: t })
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
            await berita_m.destroy({ where: { id } })
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list(req, res) {
        const { halaman, jumlah, nama_berita, status_berita,tanggal_awal_berita,tanggal_akhir_berita } = req.body

        try {
            let isi = ''
            let isi2 = ''
            if (nama_berita) {
                isi += ` and b.nama_berita ilike :nama_berita `
            }
            if (status_berita) {
                isi += ` and b.status_berita = :status_berita `
            }

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }
            if(tanggal_awal_berita){
                isi+=` and b.tanggal_awal_berita >= :tanggal_awal_berita `
            }
            if(tanggal_akhir_berita){
                isi+=` and b.tanggal_akhir_berita <= :tanggal_akhir_berita `
            }

            let data = await sq.query(`select b.id as berita_id,*
            from berita b
            where b."deletedAt" isnull ${isi} order by b."createdAt" desc ${isi2}`,
                tipe({ nama_berita: `%${nama_berita}%`, status_berita, offset: (+halaman * jumlah), jumlah,tanggal_awal_berita,tanggal_akhir_berita }))
            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as "total" from berita b
                where b."deletedAt" isnull ${isi}`, tipe({ nama_berita: `%${nama_berita}%`, status_berita,jumlah,tanggal_awal_berita,tanggal_akhir_berita }))
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

