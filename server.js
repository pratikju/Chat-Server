var net = require('net');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader(process.argv[2]);

var sockets=[];
var server = net.createServer(function(socket){

	sockets.push(socket);

	socket.on('data',function(data){
		for(i=0;i<sockets.length;i++){
			if(sockets[i]==socket)continue;
			sockets[i].write(properties.get(socket.remoteAddress) +':' + data);
		}
	});

	socket.on('end',function(){
		var i = sockets.indexOf(socket);
		sockets.splice(i,1);
	});

	socket.on('error',function(err){
		console.log("error occured");
		return;
	});
});

server.listen(process.argv[3]);
console.log("Server started at port "+process.argv[3]);
