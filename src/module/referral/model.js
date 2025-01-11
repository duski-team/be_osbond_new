import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';


const referral = sq.define('referral', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    pengguna_referral_id:{
        type:DataTypes.STRING
    },
    kode_referral:{
        type:DataTypes.STRING
    },
    tanggal_referral:{
        type:DataTypes.DATE
    },
    user_referral_id:{
        type:DataTypes.STRING
    }

},
    {
        paranoid: true,
        freezeTableName: true
    }
);



export default referral



