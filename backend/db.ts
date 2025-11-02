import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
  });
}

module.exports = { getConnection };
