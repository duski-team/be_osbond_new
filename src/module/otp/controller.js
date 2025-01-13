import user from '../user/model.js'
import { sq } from '../../config/connection.js';
import { Op } from 'sequelize';
import { tipe } from '../../helper/type.js';
import { nanoid } from 'nanoid'
import moment from 'moment';



export class Controller{

    static async request_otp(req, res){
       const{id,username}=req.body
        try {
            // const{id}=req.body
            let u1=username
            let u2=''
            if(username[0]=='0'){
                u2='62'+ username.slice(1)
            }
            else{
                u2='0'+username.slice(2)
            }
            let datanya =``
            let sekarang = moment().add(300, 'seconds')
            if(id){
                datanya = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.id ='${id}'`)
            }
            else{
                datanya = await sq.query(`select * from "user" u where u."deletedAt" isnull and (u.username ='${u1}' or u.username ='${u2}')`)
            }

            if(datanya[0].length==0){
                return res.status(201).json({ status: 204, message: "user tidak terdaftar" })
            }
            
       
            // console.log(req.dataUser);
            let otp= Math.floor(100000 + Math.random() * 900000);
            // let otp='123456'
            await user.update({kode_otp:otp,expired_otp:sekarang},{where:{id:datanya[0][0].id}})

            let no_hp=datanya[0][0].no_hp_user

            if(no_hp[0]==0){
                no_hp='62'+ no_hp.slice(1)
            }

            // console.log(no_hp);
            
            const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'App-ID': '72f7cbdc-4e8d-4565-b87e-a055add62d00',
                  'API-Key': '6wd5exD1hURd06EsfneT5SkFjcLO3RJT',
                  'content-type': 'application/json'
                },
                body: JSON.stringify({
                  msisdn: ['6289506373551','6281215540280'],
                  otp: otp,
                  lang_code: 'en_US',
                  template_name: 'otp_auth'
                })
              };
              
            let response= await fetch('https://api.verihubs.com/v1/whatsapp/otp/send', options)
            // console.log(response,"respon verihubs");
            res.status(200).json({ status: 200, message: "sukses",expired_otp:sekarang })
        } catch (err) {
                console.log(err)
                res.status(500).json({ status: 500, message: "gagal", data: err })
        }


            

            // .then(response => {
            //     // console.log(response);
            //     res.status(200).json({ status: 200, message: "sukses",otp })})
            // .catch(err =>{
            //     console.log(err)
            //     res.status(500).json({ status: 500, message: "gagal", data: err })
            
            // });

                // .then((response) => response.json())
                // .then((data) => {
                //   console.log(data);
                // });

        //     res.status(200).json({ status: 200, message: "sukses",otp })
        // } catch (error) {
        //     console.log(req.body)
        //     console.log(error)
        //     res.status(500).json({ status: 500, message: "gagal", data: error })
        // }
    }

    static async verify_otp(req,res){
        const{kode_otp,id,username}=req.body
        try {
            let data=''
            let check_time=''
            let u1=username
            let u2=''
            if(username!=undefined){
                if(username[0]=='0'){
                    u2='62'+ username.slice(1)
                }
                else{
                    u2='0'+username.slice(2)
                }
            }
            
          
            // console.log(u1,u2);
            // let data = await sq.query(` select * from "user" u where u."deletedAt" isnull and u.id = '${req.dataUser.id}' `)
            if(id){
                data = await sq.query(`select * from "user" u where u."deletedAt" isnull and u.id ='${id}'`)
                check_time= await sq.query(`select EXTRACT(EPOCH FROM (now() - u.expired_otp)) AS cek from "user" u  where u.id ='${id}' and u.kode_otp='${kode_otp}'`)
        
            }
            else{
                data = await sq.query(`select * from "user" u where u."deletedAt" isnull and (u.username ='${u1}' or u.username ='${u2}')`)
                check_time= await sq.query(`select EXTRACT(EPOCH FROM (now() - u.expired_otp)) AS cek from "user" u  where u.kode_otp='${kode_otp}' and (u.username ='${u1}' or u.username ='${u2}')`)
            }

            if(data[0].length==0){
                return res.status(201).json({ status: 204, message: "user tidak terdaftar" })
            }
           
            console.log(check_time[0]);

            if(check_time[0].length){
                if(check_time[0][0].cek>=0){
                    res.status(201).json({ status: 204, message: "sudah melebihi waktu yang di tentukan" })
                }
                else{
                        await user.update({status_user:2},{where:{id:data[0][0].id}})
                        res.status(200).json({ status: 200, message: "sukses" })
                   
                  
                }
            }
            else{
                res.status(201).json({ status: 204, message: "kode otp salah" })
            }

        } catch (error) {
            console.log(req.body)
            console.log(error)
            res.status(500).json({ status: 500, message: "gagal", data: error })
        }
       

    }

}