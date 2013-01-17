var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.set('log level', 2);

var connectedClients = 0;
var yesFromClients = 0;
var ackFromClients = 0;

io.sockets.on('connection', function (socket) {
    socket.on('coordinator',function(data){
        socket.join('coordinators');
        console.log(socket.id + ": coordinator");
    });
    
    socket.on('prepare',function(data){
        io.sockets.in('clients').emit('prepare',data);
        console.log(socket.id + ": prepare");
    });
        
    socket.on('commit',function(data){
        io.sockets.in('clients').emit('commit',data);
        console.log(socket.id + ": commit");
    });

    socket.on('client',function(data){
        socket.join('clients');
        connectedClients++;
        io.sockets.in('coordinators').emit('newClient',{client: socket.id});
        console.log(socket.id + ": client");
    
        socket.on('yes',function(data){
            yesFromClients++;
            if(yesFromClients == connectedClients){
                io.sockets.in('clients').emit('commit',data);
            }
            io.sockets.in('coordinators').emit('yes',{client: socket.id});
            console.log(socket.id + ": yes");
        });
        
        socket.on('ack',function(data){
            io.sockets.in('coordinators').emit('ack',{client: socket.id});
            ackFromClients++;
            if(ackFromClients == connectedClients){
                ackFromClients = 0;
                yesFromClients = 0;
            }
            console.log(socket.id + ": ack");
        });
        
        socket.on('disconnect',function(data){
            io.sockets.in('coordinators').emit('clientDisconnect',{client: socket.id});
            console.log(socket.id + ": disconnect");
            connectedClients--;
        });
    });
});