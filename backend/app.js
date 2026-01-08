const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require("fs");
const http = require('http');
// const https = require('https')
// const socketio = require('socket.io');
require('dotenv').config()
const port = process.env.PORT;
const path = require('path');
// const datas = require("./model/datas");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const admin = require('./routes/userApi/admin');
const cms = require('./routes/userApi/cms');
const home = require('./routes/userApi/home'); 
const users = require('./routes/userApi/users');
const history = require('./routes/userApi/history');

// Modern authentication routes
const authRoutes = require('./routes/auth');

const userHome = require('./routes/basic');
const apiRoute = require('./routes/api_route');
const limbo = require('./routes/limbo');
const dice = require('./routes/dice');
const coinflip = require('./routes/coinflip');
const keno = require('./routes/keno');
const wheel = require('./routes/wheel');
const mines = require('./routes/mines');
const roulette = require('./routes/roulette');
const fortune = require('./routes/fortune');


const plunder = require('./routes/caveofplunder');
// const withdraw = require('./routes/withdraw');
const sword = require('./routes/sword');
const bustabit = require('./routes/bustabit');
const plinko = require('./routes/plinko');

const support = require('./routes/support');
const auth = require('./routes/auth');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.set('port', port);


// admin panel
app.use('/admin', admin);
app.use('/cms', cms);
app.use('/home', home);
app.use('/users', users);
app.use('/history', history);

// Modern authentication routes
app.use('/auth', authRoutes);

// user panel
app.use('/basic', userHome);  // Change Binance API 
app.use('/apiRoute', apiRoute);
app.use('/dice', dice);
app.use('/coinflip', coinflip);
app.use('/keno', keno);
app.use('/wheel', wheel);
app.use('/mines', mines);
app.use('/roulette', roulette);
app.use('/fortune', fortune);
// app.use('/withdraw', withdraw);

app.use('/cave', plunder);
app.use('/sword', sword);
app.use('/plinko', plinko);

app.use('/limbo', limbo.router);
app.use('/bustabit', bustabit.router);


app.use('/support', support);
app.use('/auth', auth);

// Modern authentication routes
app.use('/api/auth', auth);


var mongoose = require( 'mongoose' );

// Enhanced database connection
const dbManager = require('./utils/database');
dbManager.connect().then(connected => {
  if (connected) {
    console.log('🎉 Database ready for production use');
  } else {
    console.log('⚠️  Running in offline mode - some features may be limited');
  }
}).catch(err => {
  console.error('Database initialization error:', err);
});

// Server creation is handled by bin/www, not here


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});        


/*------------- SOCKET --------------------*/
// var io = socketio.listen(server);
// const io = require('socket.io')(server,{cors: 
//   {origins: ['http://localhost:4200:*', 'http://localhost:1201:*']}}, { pingInterval:200000000, pingTimeout:500000000, transports:['websocket', 'polling']});

// const io = require('socket.io')(server,{cors: {origins: ['localhost:4200:*', 'localhost:1201:*', 'democasino.online:*']}}, 
// { pingInterval:200000000, pingTimeout:500000000, transports:['websocket', 'polling']});

// /*var io = socketio.listen(server, { pingInterval:200000000, pingTimeout:500000000, transports:['websocket', 'polling']}); */
// io.set('origins', "localhost:4200:*, localhost:1201:*");

// let commHlp = require('./helpers/common');
// bustabit.SocketInit(io);
// limbo.SocketInit(io);
// commHlp.SocketInit(io);

// let bust = require('./routes/bustabit');

// io.on('connection', function (socket) {
//  socket.on('cashOutReq', function (data) {
//       bust.receiveInfo(data);
//   });
// });

module.exports = app;