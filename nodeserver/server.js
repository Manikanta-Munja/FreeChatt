const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const PORT = process.env.PORT || 8000;

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve index.html when visiting "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const users = {};

// Handle socket.io connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // When a new user joins
    socket.on("new-user-joined", (Name) => {
        users[socket.id] = Name;
        console.log("New user:", Name);
        socket.broadcast.emit("user-joined", Name);
    });

    // When a user sends a message
    socket.on("send", (message) => {
        const data = { message: message, Name: users[socket.id] };
        socket.broadcast.emit("receive", data); // Send to others
    });

    // When a user disconnects
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
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
