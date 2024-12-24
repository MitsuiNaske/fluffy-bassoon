const express = require("express");
const app = express();
const PORT = 5000;
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("api", (req, res) => {
  res.json({
    message: "Hello",
  });
});

const Users = []

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user connected to chat`);

  socket.on("message", (data) => {
    socketIO.emit("response", data);
  });

  socket.on("newUser", (data) => {
    Users.push(data)
    socketIO.emit("responseNewUser", Users)
  })

  socket.on("disconnectChat", (userDelete) => {
    const index = Users.find((user) => userDelete.user === user.user)
    Users.splice(Users.indexOf(index), 1)
    socketIO.emit("responseNewUser", Users)
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} user disconnected from chat`);
  });
});

http.listen(PORT, () => {
  console.log("Server working...");
});
