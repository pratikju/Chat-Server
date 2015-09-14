var net = require('net');
var PropertiesReader = require('properties-reader');
var ipaddr = require('ipaddr.js');
var properties = PropertiesReader(process.argv[2]);

var sockets=[];
var server = net.createServer(function(socket){
	var socket_address = socket.remoteAddress

	sockets.push(socket);
	console.log("No. of connected users: "+sockets.length)
	var data = getName_Address(socket_address) + " has joined\n";
	broadcast_message(sockets,socket,socket_address,data,true);

	socket.on('data',function(data){
		broadcast_message(sockets,socket,socket_address,data,false);
	});

	socket.on('end',function(){
		var i = sockets.indexOf(socket);
		sockets.splice(i,1);
		var data = getName_Address(socket_address) + " has left\n";
		broadcast_message(sockets,socket,socket_address,data,true);
		console.log("No. of connected users: "+sockets.length)
	});

	socket.on('error',function(err){
		console.log("error occured");
		return;
	});
});

var getName_Address = function(ipv4Address){
	var name = "";
	if(properties.get(ipaddr.process(ipv4Address))!=null){
		name = properties.get(ipaddr.process(ipv4Address));
	}else{
		name = ipaddr.process(ipv4Address);
	}
	return name;
}

var broadcast_message = function(sockets,socket,socket_address,data,params){
	for(i=0;i<sockets.length;i++){
		if(sockets[i]==socket)continue;
		if(params){
			sockets[i].write(data);
		}else{
			sockets[i].write(getName_Address(socket_address) +' => ' + data);
		}
	}
}

server.listen(process.argv[3]);
console.log("Server started at port "+process.argv[3]);
