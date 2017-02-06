const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://ahmed:98578652@ds145039.mlab.com:45039/react-authentication');

// App Setup
app.use(morgan('combined')); // morgan is 0for logging
app.use(bodyParser.json({ type: '*/*' }));// convert every request to json
router(app);

// Server Setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log(`Listening on port ${port} ...`);
