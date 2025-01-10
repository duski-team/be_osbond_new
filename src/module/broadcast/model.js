import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';


const broadcast = sq.define('broadcast', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_broadcast: {
        type: DataTypes.STRING
    },
    gambar_broadcast: {
        type: DataTypes.STRING
    },
    konten_broadcast: {
        type: DataTypes.TEXT
    },
    tanggal_awal_broadcast:{
        type:DataTypes.DATE
    },
    tanggal_akhir_broadcast:{
        type:DataTypes.DATE
    },
    tipe_penerima:{
        type:DataTypes.STRING            //member aktif, non aktif, Usia, gender, sudah_beli_pt, belum_beli_pt // PT, sales, admin    
    },
    usia_awal:{
        type:DataTypes.INTEGER
    },
    usia_akhir:{
        type:DataTypes.INTEGER
    }                                           

},
    {
        paranoid: true,
        freezeTableName: true
    }
);



export default broadcast



