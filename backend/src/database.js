const mongoose = require('mongoose');

require('dotenv').config();

const mdbUrl = process.env.mdbUrl;

mongoose.connect(mdbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
