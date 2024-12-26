const express = require("express");
const sequelize = require("./database");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const WebSocketManager = require("./WebSocketManager");
const UseridGenerator = require("./module/genUserId");
const User = require("./models/User");

const PORT = 5000;
const SECRET_KEY =
  "c9745b4533f0601305087e3bcc386738d117502ae51c664dc8e84e80e788e8dc0e9ad13be6073601dc93ab0581f669c9889a599686bdad62d8f630e11b571d7f7b26e4ea03e1bfca0731465aa53294902d0e2a468271158150c39140e3be4e4eab8cf28de8cef4cb55b2316322290f1e7ebf39e96ce2416d5f28cc50dc5169245b933eeba902b0cb2910841541476648ee644f14b46aa260132bb947deeb3ab961f0203b01375f9cffd6c7a56b2b3e3f1b2f76d57d9f57de0da42c27f14009d5d0b02b53ce0f8fd7e88d3c1674c5cd3d8ce92beed347015d6cbd15c2e66269e9604ebf8d0568d55fb9dc87325a8ee71bdbe8e138320dec3fa121e19a8e105074b5f89d4abfd1560db93f2e1094ae4e9e67c640ed08a211ccec46056a2b8b3330eb49065bc0ec2d6dd408e44844832a625e9efe99481cc5b1f6182052da4b166ad16a97d107726d82a84b927aaf9ddb16f44e47a71fe495f3cd23ad36ea2a161bf3e884455d6eea2e2a086e4f3b35699081856511e45c780579e48791953e97efaa78293a88a453c354109d6c5a4021c0d2fa152a24afc873e4d86fed556a35015133a72b383247213b6ffc62dfa4b85b0bed1c9a40fb3c031d4f7ac6aa9fe1fd7d9139b0aba18ddcc0e4689265d8f8eae50ebc5c966d5c97610d12013fe564002926c470aa826ca28c7c4e275621e1bf3da941d8a582cb85b1d649c815496fa9";

const http = require("http").Server(app);
const cors = require("cors");
const Uid = new UseridGenerator();

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const wsManager = new WebSocketManager();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
  express.json()
);

/*  api requests   */

app.get("api", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.post("/register", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "All fields are required",
    })
  }
  const { username, password, confirmPassword } = req.body;
  console.log(req.body)
  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    return res.status(400).json({
      message: "All fields (username, password, confirmPassword) are required",
    });
  }
  try {
    const userid = Uid.generate();
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    } else {
      await User.create({
        uid: userid,
        username: username,
        password: password,
      });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user.uid, username: user.username, password: user.password },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
  res.json({ userid: user.uid, token });
});

/* sockets */

const Users = [];

socketIO.on("connection", (socket) => {
  const token = socket.handshake.query.token;
  if (!token) {
    socket.disconnect(true);
    console.error("Unauthorized: Token not provided");
    return;
  }

  try {
    const userData = jwt.verify(token, SECRET_KEY);
    socket.userId = userData.id;
    wsManager.addClient(userData.id, socket);
    console.log(`${socket.id} user connected to chat`);
    socketIO.emit("responseNewUser", Users);
  } catch (err) {
    console.log(err);
    socket.close(1008, "Unauthorized");
    return;
  }

  socket.on("message", (data) => {
    socketIO.emit("response", data);
  });

  socket.on("newUser", (data) => {
    Users.push(data);
    socketIO.emit("responseNewUser", Users);
  });

  socket.on("disconnectChat", (userDelete) => {
    const index = Users.find((user) => userDelete.user === user.user);
    Users.splice(Users.indexOf(index), 1);
    socketIO.emit("responseNewUser", Users);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("responseTyping", data);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} user disconnected from chat`);
  });
});

sequelize.sync().then(() => {
  http.listen(PORT, () => {
    console.log(`Server working on url: http://localhost:${PORT}`);
  });
});
