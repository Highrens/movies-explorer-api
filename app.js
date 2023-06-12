require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./limiter');

const { DATA_BASE } = process.env;
const CorsOptions = {
  origin: [
    'https://praktikum.tk',
    'http://praktikum.tk',
    'http://localhost:3000',
    'https://iwillwatch.nomoredomains.rocks',
  ],
  credentials: true,
  maxAge: 300,
};

const { PORT = 3000 } = process.env;
const app = express();

app.use(requestLogger);
app.use(errorLogger);

app.use(limiter);

app.use(cors(CorsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATA_BASE, {});

app.use(cookieParser());

// Роуты
app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
