import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';


const foto_club = sq.define('foto_club', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    kode_club:{
        type:DataTypes.STRING
    },
    nama_foto:{
        type:DataTypes.STRING
    }

},
    {
        paranoid: true,
        freezeTableName: true
    }
);



export default foto_club



