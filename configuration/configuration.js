require('dotenv').config();

const {
  PORT = 3001, DATABASE_URL = 'mongodb://localhost:27017/bitfilmsdb', NODE_ENV, JWT_SECRET,
} = process.env;

const jwtSecretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports = {
  PORT,
  DATABASE_URL,
  jwtSecretKey,
};
