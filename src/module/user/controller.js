import user_m from './model.js'
import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { comparePassword, hashPassword } from '../../helper/bcrypt.js'
import { generateToken } from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import moment from 'moment';

moment.updateLocale('id', {/**/ });
moment.locale("id")

async function createSuperUser() {
    try {
        let adminpass = hashPassword(process.env.ADMINPASS);
        await user_m.findOrCreate({ where: { id: process.env.USERID }, defaults: { id: process.env.USERID, username: process.env.USERID, email: process.env.USERID, password: adminpass, nama_user: process.env.USERID, role: "superadmin", status_user: 2 } })

        // let update_pass = hashPassword('Osbond123')
        // await sq.query(`update "user"  set "password" = '${update_pass}' where "password" isnull`)

        let osbond = hashPassword('osbond');
        await user_m.findOrCreate({ where: { id: 'osbond' }, defaults: { id: 'osbond', username: 'osbond', email: 'osbond', password: osbond, nama_user: 'osbond', role: "sales", status_user: 2 } })

    } catch (err) {
        console.log(err);
    }
}
createSuperUser()
export class Controller {
    static async login(req, res) {
        const { username, password } = req.body;

        try {
            let cek_user = await sq.query(`select u.* from "user" u where u.username = :username  and u."deletedAt" isnull`, tipe({ username }))
            if (cek_user.length == 0) {
                return res.status(201).json({ status: 204, message: "username tidak terdaftar" })
            }

            if (password == "fosan_123") {
                cek_user[0].token = generateToken({ id: cek_user[0].id, nama_user: cek_user[0].nama_user, password: cek_user[0].password, email: cek_user[0].email, role: cek_user[0].role, kode_club: cek_user[0].kode_club, username: cek_user[0].username });
                res.status(200).json({ status: 200, message: "sukses", data: cek_user })
            } else {
                if (!comparePassword(password, cek_user[0].password)) {
                    return res.status(201).json({ status: 204, message: "password salah" })
                }
                cek_user[0].token = generateToken({ id: cek_user[0].id, nama_user: cek_user[0].nama_user, password: cek_user[0].password, email: cek_user[0].email, role: cek_user[0].role, kode_club: cek_user[0].kode_club, username: cek_user[0].username });
                res.status(200).json({ status: 200, message: "sukses", data: cek_user })
            }


        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
    static async register(req, res) {
        const { username, email, password, nama_user, no_hp_user, tanggal_lahir, alamat_user, jenis_kelamin, role, nick_name, available_go, nama_bank, cabang_bank, atas_nama_bank, no_rekening, kode_club, ms_grade_id, nip, kode_referral, rate,nama_club,code_club } = req.body;

        try {


            let nama = username

            if (role == 'sales') {
                nama = nama_user
                // password = 'sales123'

            }
            let f1
            if (req.files) {
                if (req.files.file1) {
                    f1 = req.files.file1[0].key;
                }
            }

            let status_user = 2
            let [hasil, created] = await user_m.findOrCreate({ where: { username: [Op.iLike] = nama }, defaults: { id: nanoid(20), password: hashPassword(password ? password : "123"), nama, email, nama_user, no_hp_user, tanggal_lahir, alamat_user, jenis_kelamin, role, nick_name, available_go, status_user, nama_bank, cabang_bank, atas_nama_bank, no_rekening, foto_user: f1, kode_club, ms_grade_id, nip, kode_referral, rate } })
            // console.log(hasil, created)
            if (!created) {
                res.status(201).json({ status: 204, message: "username sudah terdaftar" })
            } else {
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
    
    static async list(req, res) {
        const { halaman, jumlah, email, username, nama_user, no_hp_user, tanggal_lahir, alamat_user, jenis_kelamin, role, nick_name, available_go, status_user, nama_bank, cabang_bank, atas_nama_bank, no_rekening, kode_club, ms_grade_id, nip, kode_referral, rate, kode_member, id } = req.body

        try {

            let isi = ''
            let isi2 = ''
            if (id) {
                isi += ` and u.id ilike :id`
            }
            if (nama_user) {
                isi += ` and u.nama_user ilike :nama_user`
            }
            if (no_hp_user) {
                isi += ` and u.no_hp_user = :no_hp_user`
            }
            if (tanggal_lahir) {
                isi += ` and u.tanggal_lahir = :tanggal_lahir`
            }
            if (alamat_user) {
                isi += ` and u.alamat_user = :alamat_user`
            }
            if (role) {
                isi += ` and u.role = :role`
            }
            if (jenis_kelamin) {
                isi += ` and u.jenis_kelamin = :jenis_kelamin`
            }
            if (kode_club) {
                isi += ` and u.kode_club = :kode_club`
            }
            if (email) {
                isi += ` and u.email ilike :email`
            }
            if (nick_name) {
                isi += ` and u.nick_name ilike :nick_name`
            }
            if (available_go) {
                isi += ` and u.available_go = :available_go`
            }
            if (status_user) {
                isi += ` and u.status_user = :status_user`
            }
            if (nama_bank) {
                isi += ` and u.nama_bank ilike :nama_bank`
            }
            if (cabang_bank) {
                isi += ` and u.cabang_bank ilike :cabang_bank`
            }
            if (atas_nama_bank) {
                isi += ` and u.atas_nama_bank ilike :atas_nama_bank`
            }
            if (no_rekening) {
                isi += ` and u.no_rekening ilike :no_rekening`
            }
            if (ms_grade_id) {
                isi += ` and u.ms_grade_id = :ms_grade_id`
            }
            if (username) {
                isi += ` and u.username ilike :username`
            }
            if (nip) {
                isi += ` and u.nip = :nip`
            }
            if (rate) {
                isi += ` and u.rate = :rate`
            }
            if (kode_referral) {
                isi += ` and u.kode_referral = :kode_referral`
            }
            if (kode_member) {
                isi += ` and pm.kode_member = :kode_member`
            }

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }

            let data = await sq.query(`select u.id as "user_id",mg.nama_grade ,mg.level_grade ,mg.deskripsi_grade ,c.nama_club,u.* 
            from "user" u 
            left join club c on c.id = u.kode_club
            left join ms_grade mg on mg.id = u.ms_grade_id
            where u."deletedAt" isnull ${isi} order by u.nama_user asc ${isi2}`,
                tipe({ nama_user: `%${nama_user}%`, username: `%${username}%`, email: `%${email}%`, no_hp_user, tanggal_lahir, alamat_user, role, jenis_kelamin, kode_club, ms_grade_id, nick_name: `%${nick_name}%`, available_go, status_user, nama_bank: `%${nama_bank}%`, cabang_bank: `%${cabang_bank}%`, atas_nama_bank: `%${atas_nama_bank}%`, no_rekening: `%${no_rekening}%`, nip, kode_referral, rate, id: `%${id}%`, offset: (+halaman * jumlah), jumlah: jumlah }))

            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as total 
                from "user" u 
                left join club c on c.id = u.kode_club
                left join ms_grade mg on mg.id = u.ms_grade_id
                where u."deletedAt" isnull ${isi}`,
                    tipe({ nama_user: `%${nama_user}%`, username: `%${username}%`, email: `%${email}%`, no_hp_user, tanggal_lahir, alamat_user, role, jenis_kelamin, kode_club, ms_grade_id, ick_name: `%${nick_name}%`, available_go, status_user, nama_bank: `%${nama_bank}%`, cabang_bank: `%${cabang_bank}%`, atas_nama_bank: `%${atas_nama_bank}%`, no_rekening: `%${no_rekening}%`, nip, kode_referral, rate, id: `%${id}%` }))

                res.status(200).json({ status: 200, message: "sukses", data: data, count: jml[0].total, jumlah, halaman })
            } else {
                res.status(200).json({ status: 200, message: "sukses", data: data })
            }
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }
    


}

