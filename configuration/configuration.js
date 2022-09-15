require('dotenv').config();

const {
  PORT = 3001, DATABASE_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

module.exports = {
  PORT,
  DATABASE_URL,
};
