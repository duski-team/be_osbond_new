import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';


const referall = sq.define('referall', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    pengguna_referall_id:{
        type:DataTypes.STRING
    },
    kode_referall:{
        type:DataTypes.STRING
    },
    tanggal_referall:{
        type:DataTypes.DATE
    },
    user_referall_id:{
        type:DataTypes.STRING
    }

},
    {
        paranoid: true,
        freezeTableName: true
    }
);



export default referall



