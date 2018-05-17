//ANGULAR WITH SOCKETS
var express = require("express");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var session = require('express-session');
app.use(session({ 
  secret: 'codingdojorocks'
}));  

app.use(express.static( __dirname + '/myAngularProj/dist/myAngularProj' ));

const server = app.listen(1337);
const io = require('socket.io')(server);
var counter = 0;
var content = "server default text"
var user_id_counter = 1
console.log("preconnect")

io.on('connection', function (socket) {
  // console.log("server: connected")
  data = {
    code: 'new_user_connected', 
    user_id_counter: user_id_counter, 
    content: content
  }
  user_id_counter += 1; 

  //give the newly  connected client the existing payload
  socket.emit('update', data );

  //updateAllClients except message sender
  socket.on('gamma', function (data) { 
    // socket.broadcast will message all socket clients except the one that triggered the 'gamma' listener
    console.log('gamma:', data)
    content = data.content
    socket.broadcast.emit('update', data );
  });
});

//Socket Code Samples
//update just the message sender
// socket.emit('updateClient', { data: m });

//update all clients including the message sender
// io.emit('updateAllClients', data);

app.get('/hello', function (req, res){
  session['id'] = genuuid()
  console.log(session.id)
  // res.render('index', {title: "my Express project"});
  res.json({myKey: "apis working"})
});