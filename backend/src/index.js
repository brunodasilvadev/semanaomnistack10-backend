const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes')
const { setupWebsocket } = require('./websocket');

require('dotenv').config();

const app = express();

const server = http.Server(app);

setupWebsocket(server);

const mdbUrl = process.env.mdbUrl;

mongoose.connect(mdbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);