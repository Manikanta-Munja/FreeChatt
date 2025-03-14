const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",  // Allow requests from any origin
        methods: ["GET", "POST"]
    }
});
const cors = require('cors');

app.use(cors());  // Enable CORS for all routes
app.use(express.static(__dirname));  // Serve static files

const users = {};

io.on('connection', socket => {

    console.log("A new user connected:", socket.id);

    socket.on('new-user-joined', Name => {
        users[socket.id] = Name;
        console.log("new_user", Name);
        socket.broadcast.emit('user-joined', Name);
    });
    socket.on('send', message => {
        const data = { message: message, Name: users[socket.id] };
        socket.broadcast.emit('receive', data);  // Sends to others
        // socket.emit('receive', data);  // Sends back to sender
    });
    
    socket.on('disconnect', () => {
        socket.broadcast.emit('left',users[socket.id]);
        console.log(`${users[socket.id]} left the chat`);
        delete users[socket.id];
    });
});

http.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});
