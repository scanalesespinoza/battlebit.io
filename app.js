var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	console.log('new incoming connection:');

	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;

	SOCKET_LIST[socket.id] = socket;

	console.log('new client:'+socket.id);

	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
	});
});

setInterval(function(){
	console.log('Updating positions')
	var pack = [];
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.x++;
		socket.y++;

		pack.push({
                        x:socket.x,
                        y:socket.y
                });
	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		console.log('emiting to:'+socket.id);
		console.log('pack size:'+pack.length);
		socket.emit('newPosition',pack);
	}
},1000/25);
serv.listen(2000);
