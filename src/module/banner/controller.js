import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import banner_m from './model.js'

export class Controller {

    static async register(req, res) {
        const { nama_banner, status_banner } = req.body

        try {
            let f1
            if (req.files) {
                if (req.files.file1) {
                    f1 = req.files.file1[0].key;
                }
            }

            let data = await banner_m.create({ id: nanoid(14), nama_banner, status_banner, gambar_banner: f1 })
            res.status(200).json({ status: 200, message: "sukses", data })

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req, res) {
        const { id, nama_banner, status_banner } = req.body

        try {
            await sq.transaction(async t => {
                if (req.files) {
                    if (req.files.file1) {
                        await banner_m.update({ gambar_banner: req.files.file1[0].key }, { where: { id }, transaction: t })
                    }
                }
                let data = await banner_m.update({ nama_banner, status_banner }, { where: { id }, transaction: t })
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
            await banner_m.destroy({ where: { id } })
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list(req, res) {
        const { halaman, jumlah, nama_banner, status_banner } = req.body

        try {
            let isi = ''
            let isi2 = ''
            if (nama_banner) {
                isi += ` and b.nama_banner ilike :nama_banner `
            }
            if (status_banner) {
                isi += ` and b.status_banner = :status_banner `
            }

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }

            let data = await sq.query(`select b.id as banner_id,*
            from banner b
            where b."deletedAt" isnull ${isi} order by b."createdAt" desc ${isi2}`,
                tipe({ nama_banner: `%${nama_banner}%`, status_banner, offset: (+halaman * jumlah), jumlah: jumlah }))
            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as "total" from banner b
                where b."deletedAt" isnull ${isi}`, tipe({ nama_banner: `%${nama_banner}%`, status_banner }))
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
            let data = await sq.query(`select b.id as banner_id,*
            from banner b
            where b."deletedAt" isnull and b.id = :id`, tipe({ id }))
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
}

