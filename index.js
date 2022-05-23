require('dotenv').config();
const WebServer = require('./BackEnd/src/core/web-server');

const webServer = new WebServer();
webServer.start();
