const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(cors());

app.use(require('./routes/auth'));

// авторизация
app.use(auth);

// роуты, требующие авторизации
app.use(require('./routes/users'));
app.use(require('./routes/movie'));

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
  console.log('Connected to db');

  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

main();
