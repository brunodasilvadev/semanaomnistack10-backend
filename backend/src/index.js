const express = require('express')
const cors = require('cors')
const http = require('http')
const routes = require('./routes/devs.routes')
const { setupWebsocket } = require('./websocket')
global.database = require('./database')

const app = express();

const server = http.Server(app);

setupWebsocket(server);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);