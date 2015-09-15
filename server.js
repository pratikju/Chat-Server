var net = require('net');
var PropertiesReader = require('properties-reader');
var ipaddr = require('ipaddr.js');
var properties = PropertiesReader(process.argv[2]);

var sockets=[];
var server = net.createServer(function(socket){
	socket.ip_address = socket.remoteAddress

	add_nodes(socket); // add to sockets for nodes connecting to the server

	socket.on('data',function(data){
		broadcast_message(socket,data,false); //broadcast message to all the connected nodes
	});

	socket.on('end',function(){
		remove_nodes(socket); // remove from sockets for nodes disconnecting from the server
	});

	socket.on('error',function(err){
		console.log("error occured");
		return;
	});
});

var getName_Address = function(ipAddress){
	var name = "";
	if(properties.get(ipaddr.process(ipAddress))!=null){
		name = properties.get(ipaddr.process(ipAddress));
	}else{
		name = ipaddr.process(ipAddress);
	}
	return name;
}

var broadcast_message = function(socket,data,in_out_param){
	for(i=0;i<sockets.length;i++){
		if(sockets[i]==socket)continue;
		if(in_out_param){
			sockets[i].write(data);
		}else{
			sockets[i].write(getName_Address(socket.ip_address) +' => ' + data);
		}
	}
}

var add_nodes = function(socket){
	sockets.push(socket);
	console.log("No. of connected users: "+sockets.length)
	socket.write("********Welcome********\n");
	var data = getName_Address(socket.ip_address) + " has joined\n";
	broadcast_message(socket,data,true);
}

var remove_nodes = function(socket){
	var i = sockets.indexOf(socket);
	sockets.splice(i,1);
	var data = getName_Address(socket.ip_address) + " has left\n";
	broadcast_message(socket,data,true);
	console.log("No. of connected users: "+sockets.length)
}

server.listen(process.argv[3]);
console.log("Server started at port "+process.argv[3]);
