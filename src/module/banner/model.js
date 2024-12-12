import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';


const banner = sq.define('banner', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_banner: {
        type: DataTypes.STRING
    },
    gambar_banner: {
        type: DataTypes.STRING
    },
    status_banner: {
        type: DataTypes.SMALLINT // 1 active 0 non active
    },

},
    {
        paranoid: true,
        freezeTableName: true
    }
);



export default banner



