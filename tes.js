import { sq } from "./src/config/connection.js";
import { tipe } from "./src/helper/type.js";

let no_hp_08 = '6285877080555'
        let b = no_hp_08.slice(0,2)
        if (b == '62') {
            no_hp_08 = '0' + no_hp_08.slice(2)
        }

        console.log(no_hp_08);
        

        let penerima = await sq.query(`select * from "user" u where u."deletedAt"isnull and u.token_mobile notnull`,tipe())
        let fcm_id=[]

        penerima.forEach(el => {
            fcm_id.push(el.token_mobile)
        });

        console.log(fcm_id);
        