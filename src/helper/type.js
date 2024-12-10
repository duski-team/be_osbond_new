import { QueryTypes, Op } from 'sequelize';

export function tipe(data) {
    return { replacements: data, type: QueryTypes.SELECT };
}

