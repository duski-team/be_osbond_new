import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';
import user from '../user/model.js'
import broadcast from '../broadcast/model.js';

const penerima_broadcast = sq.define('penerima_broadcast', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },

},
    {
        paranoid: true,
        freezeTableName: true
    }
);


penerima_broadcast.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(penerima_broadcast, { foreignKey: 'user_id' });

penerima_broadcast.belongsTo(broadcast, { foreignKey: 'broadcast_id' });
broadcast.hasMany(penerima_broadcast, { foreignKey: 'broadcast_id' });



export default penerima_broadcast



