require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const NotFoundError = require('./errors/not-found-err');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./limiter');

const { NODE_ENV, DATA_BASE } = process.env;
const CorsOptions = {
  origin: [
    'https://praktikum.tk',
    'http://praktikum.tk',
    'http://localhost:3000',
    'https://welcometomesto.nomoredomains.monster',
  ],
  credentials: true,
  maxAge: 300,
};

const { PORT = 3000 } = process.env;
const app = express();

app.use(limiter);
app.use(cors(CorsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://127.0.0.1:27017/bitfilmsdb', {});

app.use(requestLogger);

app.use('/', require('./routes/auth_routes'));

app.use(cookieParser());
app.use(auth);
app.use('/', require('./routes/movies'));
app.use('/', require('./routes/users'));

app.use((req, res, next) => {
  next(new NotFoundError('Ошибка путь не найден'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
