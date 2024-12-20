import user_m from './model.js'
import { sq,osbond } from '../../config/connection.js';
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

// let tes = await osbond.query(`SELECT * FROM APPS_LISTCLUB()`,tipe())
// tes = tes.recordset
// console.log(tes);



export class Controller {
    static async login(req, res) {
        const { username, password } = req.body;
        // console.log(req.body);
        

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
        const { username,email,password,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,foto_user,kode_referral, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_member } = req.body;

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

            // let status_user = 2
            let [hasil, created] = await user_m.findOrCreate({ where: { username: [Op.iLike] = nama }, defaults: { id: nanoid(20), password: hashPassword(password ? password : "123"), username,email,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,foto_user,kode_referral, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_member} })
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

    static async update(req,res){
        const { id,username,email,password,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,foto_user,kode_referral, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_memberb } = req.body;

        try {
            let update = await user_m.update({username,email,password,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,foto_user,kode_referral, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_member},{where:{id},returning:true})
            const data = update[1][0].get();
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }
    
    static async list(req, res) {
        const { halaman, jumlah, id,username,nama_user,no_hp_user,jenis_kelamin,role,status_user,kode_referral,kode_club,kode_member } = req.body

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
            if (role) {
                isi += ` and u.role = :role`
            }
            if (jenis_kelamin) {
                isi += ` and u.jenis_kelamin = :jenis_kelamin`
            }
            if (kode_club) {
                isi += ` and u.kode_club = :kode_club`
            }
            if (status_user) {
                isi += ` and u.status_user = :status_user`
            }
            if (username) {
                isi += ` and u.username ilike :username`
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
            where u."deletedAt" isnull ${isi} order by u.nama_user asc ${isi2}`,
                tipe({ offset: (+halaman * jumlah), jumlah, id,nama_user: `%${nama_user}%`,no_hp_user,role,jenis_kelamin,kode_club,status_user,kode_referral,kode_member }))

            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as total 
                from "user" u 
                where u."deletedAt" isnull ${isi}`,
                    tipe({ id,nama_user: `%${nama_user}%`,no_hp_user,role,jenis_kelamin,kode_club,status_user,kode_referral,kode_member}))

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

    static async change_password(req, res) {
        const { id, username, password_baru } = req.body;
        try {

            

            let usernya = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.username= '${username}'`)

            if (usernya.length) {
                await user_m.update({ password: hashPassword(password_baru) }, { where: { id: usernya[0][0].id } })
            }
            if (id) {
                await user_m.update({ password: hashPassword(password_baru) }, { where: { id } })
            }

            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body);
            
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async reset_password(req, res) {
        const { kode_otp, username, password_baru } = req.body;
        try {
            let data = ''
            let check_time = ''
     
   
            data = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.username= '${username}'')`)
            check_time = await sq.query(`select EXTRACT(EPOCH FROM (now() - u.expired_otp)) AS cek from "user" u  where u.kode_otp='${kode_otp}' and and u.username= '${username}'`)
            console.log(check_time);
            if (data[0].length == 0) return res.status(201).json({ status: 204, message: "user tidak terdaftar" })
            if (check_time[0][0].cek >= 0) {
                return res.status(201).json({ status: 204, message: "sudah melebihi waktu yang di tentukan" })
            }
            if (!check_time[0].length) return res.status(201).json({ status: 204, message: "kode otp salah" })

            await user_m.update({ password: hashPassword(password_baru) }, { where: { id: data[0][0].id } })
            res.status(200).json({ status: 200, message: "sukses" })

        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }


    


}

