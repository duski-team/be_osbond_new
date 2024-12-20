import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';
import user from '../user/model.js'

const absensi = sq.define('absensi', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    check_in: {
        type: DataTypes.DATE
    },
    check_out: {
        type: DataTypes.DATE
    },
    hand_towel: {
        type: DataTypes.SMALLINT,
        defaultValue:0
    },
    body_towel: {
        type: DataTypes.SMALLINT,
        defaultValue:0
    },
    kode_club:{
        type:DataTypes.STRING
    }

},
    {
        paranoid: true,
        freezeTableName: true
    }
);


absensi.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(absensi, { foreignKey: 'user_id' });



export default absensi



