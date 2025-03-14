const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 8000;

// Serve static files from "public" folder
app.use(express.static("public"));

// Handle socket.io connections
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Start the server
http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
