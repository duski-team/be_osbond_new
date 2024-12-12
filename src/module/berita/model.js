import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';


const berita = sq.define('berita', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_berita: {
        type: DataTypes.STRING
    },
    gambar_berita: {
        type: DataTypes.STRING
    },
    status_berita: {
        type: DataTypes.SMALLINT // 1 active 0 non active
    },
    konten_berita: {
        type: DataTypes.TEXT
    },
    tanggal_awal_berita:{
        type:DataTypes.DATE
    },
    tanggal_akhir_berita:{
        type:DataTypes.DATE
    }

},
    {
        paranoid: true,
        freezeTableName: true
    }
);



export default berita



