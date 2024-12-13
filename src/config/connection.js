import { Sequelize } from 'sequelize';
import mssql from 'mssql'

import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const sq = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIAL,
    logging:false,
    dialectOptions:{
      dateStrings: true,
      typeCast: true,
    },
    pool: {
      max: 100,
      min: 0,
      idle: 10000,
      acquire: 60000,
    },
    timezone: '+07:00'
  });

  let osbond = await mssql.connect(process.env.DB_SOURCE);

  // const osbond = new Sequelize(process.env.OSBOND_DB_NAME,process.env.OSBOND_USER,process.env.OSBOND_PASS, {
  //   host: process.env.OSBOND_HOST,
  //   port: process.env.OSBOND_PORT,
  //   dialect: process.env.OSBOND_DIAL,
  //   logging:false,
  //   dialectOptions:{
  //     dateStrings: true,
  //     typeCast: true,
  //   },
  //   pool: {
  //     max: 100,
  //     min: 0,
  //     idle: 10000,
  //     acquire: 60000,
  //   },
  //   timezone: '+07:00'
  // });

  export { sq,osbond }