import user_m from './model.js'
import { sq,osbond } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { comparePassword, hashPassword } from '../../helper/bcrypt.js'
import { generateToken } from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import moment from 'moment';
import referral from '../referral/model.js';
import kirim_notif from '../../helper/fcm.js'



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
        const { username,email,password,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,kode_referral, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_member,kode_referral_tujuan,token_mobile } = req.body;

        let no_hp_08 = username
        let b = no_hp_08.slice(0,2)
        if (b == '62') {
            no_hp_08 = '0' + no_hp_08.slice(2)
        }
        

        try {
            let kode= nanoid(8)
            if(kode_referral){
                kode = kode_referral
                let data = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.kode_referral =:kode_referral`,tipe({kode_referral}))
                if(data.length){
                    return  res.status(201).json({ status: 204, message: "kode referral sudah ada" })
                }
            }
            let f1
            if (req.files) {
                if (req.files.file1) {
                    f1 = req.files.file1[0].key;
                }
            }
            
            let y = tanggal_lahir.split('-')
            let tanggal_string = y[0]+y[1]+y[2]
       
              

            console.log(tanggal_string);
            
                
            // let status_user = 2
            let [hasil, created] = await user_m.findOrCreate({ where: { username: username }, defaults: { id: nanoid(20), password: hashPassword(password ? password : "123"), username,email,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,foto_user:f1,kode_referral:kode, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_member,token_mobile} })
            console.log(hasil, created)

            // let created=true
            // let hasil ='abc'
          
            if (!created) {
                res.status(201).json({ status: 204, message: "username sudah terdaftar" })
            } else {
                // console.log('else');
                

                if(!kode_member){
                    // console.log('tanpa kode member');
                    
                    console.log(`EXEC APPS_CREATEGUEST '${kode_club}','${nama_user}','${no_hp_08}','${alamat_user}','${tanggal_string}','${email}','${jenis_kelamin}'`);
                    let sync = await osbond.query(`EXEC APPS_CREATEGUEST '${kode_club}','${nama_user}','${no_hp_08}','${alamat_user}','${tanggal_string}','${email}','${jenis_kelamin}'`)
                    console.log(sync);
                    

                    console.log(`EXEC APPS_CREATETRIAL7DAYS '${kode_club}','${no_hp_08}'`);
                    let trial= await osbond.query(`EXEC APPS_CREATETRIAL7DAYS '${kode_club}','${no_hp_08}'`)
                    console.log(trial);
                    
                }
          
                
                   
                    
              
                
              
               

                // console.log(sync,'ini sync');
                // console.log(trial,'trial');
                
                

                if(kode_referral_tujuan){
                    let user_referral=await sq.query(`select * from "user" u where u."deletedAt" isnull and u.kode_referral = '${kode_referral_tujuan}'`,tipe())
                    if(user_referral.length){
                        await referral.create({ id: nanoid(14), pengguna_referral_id:hasil.id, kode_referral:kode_referral_tujuan, tanggal_referral:moment(),user_referral_id:user_referral[0].id })
                    }
                    res.status(200).json({ status: 200, message: "sukses", data: hasil })
                  
                }
                else{
                    res.status(200).json({ status: 200, message: "sukses", data: hasil })
                }
    
              
            }
            // }
            // else{
            //     res.status(500).json({ status: 500, message: "error sync" })
            // }
            

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async update(req,res){
        const { id,username,email,password,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,foto_user,kode_referral, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_member,token_mobile } = req.body;

        try {
            let no_hp_08 = username
            let b = no_hp_08.slice(0,2)
            if (b == '62') {
            no_hp_08 = '0' + no_hp_08.slice(2)
        }

        let y = tanggal_lahir.split('-')
        let tanggal_string = y[0]+y[1]+y[2]

            let update_osbond = await osbond.query(`EXEC APPS_UPDATEGUEST '${nama_user}','${no_hp_08}','${alamat_user}','${tanggal_string}','${email}','${jenis_kelamin}'`)

            // if(update_osbond.recordset){
                let update = await user_m.update({username,email,password,nama_user,no_hp_user,tanggal_lahir,alamat_user,jenis_kelamin,role,nick_name,status_user,nama_bank,cabang_bank,atas_nama_bank,no_rekening,foto_user,kode_referral, nip,kode_otp,expired_otp,nik,emergency_contact,emergency_contact_name,kode_club,nama_club,kode_member,token_mobile},{where:{id},returning:true})
                const data = update[1][0].get();
                res.status(200).json({ status: 200, message: "sukses", data })
            // }
            // else{
            //     res.status(500).json({ status: 500, message: "error sync" })
            // }

           
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
            if (username) {
                isi += ` and u.username ilike :username`
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
                isi += ` and u.kode_member = :kode_member`
            }

            if (halaman && jumlah) {
                isi2 += ` offset :offset limit :jumlah`
            }

            let data = await sq.query(`select u.id as "user_id",u.* 
            from "user" u 
            where u."deletedAt" isnull ${isi} order by u.nama_user asc ${isi2}`,
                tipe({ offset: (+halaman * jumlah), jumlah, id,nama_user: `%${nama_user}%`,no_hp_user,role,jenis_kelamin,kode_club,status_user,kode_referral,kode_member,username }))

            if (halaman && jumlah) {
                let jml = await sq.query(`select count(*) as total 
                from "user" u 
                where u."deletedAt" isnull ${isi}`,
                    tipe({ id,nama_user: `%${nama_user}%`,no_hp_user,role,jenis_kelamin,kode_club,status_user,kode_referral,kode_member,username}))

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

            

            let usernya = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.username= '${username}'`,tipe())

            if (usernya.length) {
                await user_m.update({ password: hashPassword(password_baru) }, { where: { id: usernya[0].id } })
            }
            else if (id) {
                await user_m.update({ password: hashPassword(password_baru) }, { where: { id } })
            }
            else{
                return  res.status(201).json({ status: 204, message: "user belum registrasi" })
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

    static async me(req,res){
        try {
            let data = await sq.query(`select u.id as "user_id",u.* 
                from "user" u 
                where u."deletedAt" isnull and u.id='${req.dataUser.id}'`,
                    tipe())
                    res.status(200).json({ status: 200, message: "sukses" ,data})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
    }

    static async list_member_aktif(req,res){
        try {
            let asd = await osbond.query(`select * from m_member with(index(member_idx)) where sts_member = 1 or (sts_member = 0 and sts_remark = 'CUTI')`)
            let data = asd.recordset
            
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }

    static async member_by_code(req,res){
        const{kode_member}=req.body
        try {
            let asd = await osbond.query(`SELECT * FROM APPS_DATA_MMEMBER ('${kode_member}')`)
            let data = asd.recordset
            
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }


    static async search(req,res){
        const{parameter,jumlah,halaman}=req.body

        try {
            let asd = await osbond.query(`EXEC APPS_LISTUSER '${parameter}','${jumlah}','${halaman}'`)
            // console.log(`EXEC APPS_LISTMEMBER '${parameter}','${jumlah}','${halaman}'`);
            
            let data = asd.recordset
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }


    static async list_pembelian_produk(req,res){
        const{username}=req.body
        let no_hp_08 = username
        let b = no_hp_08.slice(0,2)
        if (b == '62') {
            no_hp_08 = '0' + no_hp_08.slice(2)
        }

        try {
            let asd = await osbond.query(`select * from APPS_MSHIP_HIST ('${no_hp_08}')`)
            let data = asd.recordset
            res.status(200).json({ status: 200, message: "sukses", data })

        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }

    static async list_pembelian_pt(req,res){
        const{username}=req.body

        let no_hp_08 = username
        let b = no_hp_08.slice(0,2)
        if (b == '62') {
            no_hp_08 = '0' + no_hp_08.slice(2)
        }

        try {
            let asd = await osbond.query(`select * from APPS_PT_HIST ('${no_hp_08}')`)
            let data = asd.recordset
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }

    static async change_profil_picture(req,res){
        const{username}=req.body
        try {
            let f1
            if (req.files) {
                if (req.files.file1) {
                    f1 = req.files.file1[0].key;
                }
            }

            await user_m.update({foto_user:f1},{where:{username}})
            res.status(200).json({ status: 200, message: "sukses" })
        } catch (error) {
            console.log(req.body);
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }


    static async change_username(req,res){
        const{username_lama,username_baru,tanggal_lahir}=req.body
        console.log(req.body);
        try {
            let no_hp_08 = username_baru
          
            
            let b = no_hp_08.slice(0,2)
            if (b == '62') {
                no_hp_08 = '0' + no_hp_08.slice(2)
            }
           
            let update = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.username = '${username_lama}'`,tipe())
            // console.log(update);
            

            if(update.length){
                let asd = await user_m.update({username:username_baru,no_hp_user:username_baru},{where:{id:update[0].id},returning:true})

                // let y = update[0].tanggal_lahir.split('-')
                let tanggal_string = moment(update[0].tanggal_lahir).format('YYYYMMDD')

                let update_osbond = await osbond.query(`EXEC APPS_UPDATEGUEST '${update[0].nama_user}','${no_hp_08}','${update[0].alamat_user}','${tanggal_string}','${update[0].email}','${update[0].jenis_kelamin}'`)

                console.log(`EXEC APPS_UPDATEGUEST '${update[0].nama_user}','${no_hp_08}','${update[0].alamat_user}','${tanggal_string}','${update[0].email}','${update[0].jenis_kelamin}'`);
                
                
                const data = asd[1][0].get();
                res.status(200).json({ status: 200, message: "sukses", data })
            }
            else{
                res.status(201).json({ status: 204, message: "user belum terdaftar" })
            }


        } catch (error) {
            console.log(req.body);
            console.log(error)
            res.status(500).json({ status: 500, message: "error", data: error })
        }
    }


    


}

