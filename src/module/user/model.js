import { sq } from '../../config/connection.js';
import { DataTypes } from 'sequelize';

const user = sq.define('user', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    nama_user: {
        type: DataTypes.STRING
    },
    no_hp_user: {
        type: DataTypes.STRING
    },
    tanggal_lahir: {
        type: DataTypes.DATE
    },
    alamat_user: {
        type: DataTypes.STRING
    },
    jenis_kelamin: {
        type: DataTypes.STRING // laki_laki = L, perempuan = P
    },
    role: {
        type: DataTypes.STRING // super_admin,manajer,supervisor,sales,personal_trainer,member_aktif,member_non_aktif,guest
    },
    nick_name: {
        type: DataTypes.STRING
    },
    // available_go: {
    //     type: DataTypes.SMALLINT, // 1 available ,0 non available
    //     defaultValue: 0
    // },
    status_user: {
        type: DataTypes.SMALLINT,
        defaultValue: 1 // 1 belum otp,2 sudah otp
    },
    nama_bank: {
        type: DataTypes.STRING
    },
    cabang_bank: {
        type: DataTypes.STRING
    },
    atas_nama_bank: {
        type: DataTypes.STRING
    },
    no_rekening: {
        type: DataTypes.STRING
    },
    foto_user: {                  // f1
        type: DataTypes.STRING
    },
    kode_referral: {
        type: DataTypes.STRING
    },
    nip: {
        type: DataTypes.STRING
    },
    kode_otp: {
        type: DataTypes.STRING
    },
    expired_otp: {
        type: DataTypes.DATE
    },
    claim_gym_bag: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    customer_id_xendit: {
        type: DataTypes.STRING
    },
    nik: {
        type: DataTypes.STRING
    },
    emergency_contact:{
        type:DataTypes.STRING
    },
    emergency_contact_name:{
        type:DataTypes.STRING
    },
    kode_club:{
        type:DataTypes.STRING
    },
    nama_club:{
        type:DataTypes.STRING
    },
    kode_member:{
        type:DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    }
);



export default user
