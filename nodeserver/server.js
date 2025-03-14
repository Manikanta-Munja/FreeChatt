const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"]
    }
});
const cors = require("cors");

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.static("public"));  // Serve static files from "public" folder

const users = {};

// Handle socket.io connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("new-user-joined", (Name) => {
        users[socket.id] = Name;
        console.log("New user:", Name);
        socket.broadcast.emit("user-joined", Name);
    });

    socket.on("send", (message) => {
        const data = { message: message, Name: users[socket.id] };
        socket.broadcast.emit("receive", data);
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("left", users[socket.id]);
            console.log(`${users[socket.id]} left the chat`);
            delete users[socket.id];
        }
    });
});

// Start the server
http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
