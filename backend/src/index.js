const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes')

require('dotenv').config();

const app = express();

const mdbUrl = process.env.mdbUrl;

mongoose.connect(mdbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);