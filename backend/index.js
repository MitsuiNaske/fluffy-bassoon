const express = require("express");
const sequelize = require("./database");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const WebSocketManager = require("./module/WebSocketManager");
const Logger = require("./module/Logger");
const UseridGenerator = require("./module/genUserId");
const User = require("./models/User");

const PORT = 5000;
const SECRET_KEY = "c9745b4533f0601305087e3bcc386738d117502ae51c664dc8e84e80e788e8dc0e9ad13be6073601dc93ab0581f669c9889a599686bdad62d8f630e11b571d7f7b26e4ea03e1bfca0731465aa53294902d0e2a468271158150c39140e3be4e4eab8cf28de8cef4cb55b2316322290f1e7ebf39e96ce2416d5f28cc50dc5169245b933eeba902b0cb2910841541476648ee644f14b46aa260132bb947deeb3ab961f0203b01375f9cffd6c7a56b2b3e3f1b2f76d57d9f57de0da42c27f14009d5d0b02b53ce0f8fd7e88d3c1674c5cd3d8ce92beed347015d6cbd15c2e66269e9604ebf8d0568d55fb9dc87325a8ee71bdbe8e138320dec3fa121e19a8e105074b5f89d4abfd1560db93f2e1094ae4e9e67c640ed08a211ccec46056a2b8b3330eb49065bc0ec2d6dd408e44844832a625e9efe99481cc5b1f6182052da4b166ad16a97d107726d82a84b927aaf9ddb16f44e47a71fe495f3cd23ad36ea2a161bf3e884455d6eea2e2a086e4f3b35699081856511e45c780579e48791953e97efaa78293a88a453c354109d6c5a4021c0d2fa152a24afc873e4d86fed556a35015133a72b383247213b6ffc62dfa4b85b0bed1c9a40fb3c031d4f7ac6aa9fe1fd7d9139b0aba18ddcc0e4689265d8f8eae50ebc5c966d5c97610d12013fe564002926c470aa826ca28c7c4e275621e1bf3da941d8a582cb85b1d649c815496fa9";


const http = require("http").Server(app);
const cors = require("cors");
const Uid = new UseridGenerator();

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const wsManager = WebSocketManager.getInstance();
const logger = Logger.getInstance();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
  express.json()
);

/* API requests */
app.post("/register", async (req, res) => {
  logger.log("Received registration request.");
  if (!req.body) {
    logger.warn("Registration: empty request.");
    return res.status(400).json({
      message: "All fields are required.",
    });
  }
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    logger.warn("Registration: invalid data.");
    return res.status(400).json({
      message: "All fields (username, password, confirm password) are required.",
    });
  }
  try {
    const userid = Uid.generate();
    const user = await User.findOne({ where: { username } });
    if (user) {
      logger.warn(`Registration: user \"${username}\" already exists.`);
      return res.status(400).json({
        message: "User already exists.",
      });
    } else {
      await User.create({
        uid: userid,
        username: username,
        password: password,
      });
      logger.log(`User \"${username}\" successfully created with ID ${userid}.`);
    }

    res.status(201).json({ message: "User successfully registered." });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

app.post("/login", async (req, res) => {
  logger.log("Received login request.");
  try {
    if (!req.body) {
      logger.warn("Login: empty request.");
      return res.status(400).json({
        message: "All fields are required.",
      });
    }
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.warn(`Login: user \"${username}\" not found.`);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    logger.log(`Password validation for user \"${username}\": ${isPasswordValid}`);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.uid, username: user.username },
      SECRET_KEY,
      { expiresIn: "24h" }
    );
    logger.log(`Token successfully generated for user \"${username}\".`);
    res.json({ userid: user.uid, token: token, username: user.username });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

/* WebSocket connections */
const Users = [];

socketIO.on("connection", (socket) => {
  const token = socket.handshake.query.token;
  if (!token) {
    socket.disconnect(true);
    logger.error("Unauthorized: Token not provided.");
    return;
  }

  try {
    const userData = jwt.verify(token, SECRET_KEY);
    socket.userId = userData.id;

    wsManager.addClient(userData.id, socket);
    logger.log(`User connected to chat: ${socket.id}`);

    socketIO.emit("responseNewUser", Users);
  } catch (error) {
    logger.error(`Invalid token: ${error.message}`);
    socket.disconnect(true);
    return;
  }

  socket.on("verifyToken", (token) => {
    try {
      const userData = jwt.verify(token, SECRET_KEY);
      logger.log(`Token verified for user: ${userData.username}`);
      socket.emit("tokenVerified", { success: true, user: userData });
    } catch (error) {
      logger.error(`Invalid token: ${error.message}`);
      socket.emit("tokenVerified", { success: false });
      socket.disconnect(true);
    }
  });

  socket.on("message", (data) => {
    logger.log(`Message from user ${socket.userId}: ${data}`);
    socketIO.emit("response", data);
  });

  socket.on("newUser", (data) => {
    if (!data.user || typeof data.user !== "string") {
      logger.warn(`New user: invalid data received: ${JSON.stringify(data)}`);
      return;
    }

    const userExists = Users.some((user) => user.user === data.user);
    if (!userExists) {
      Users.push({ user: data.user, socketID: socket.id });
      logger.log(`User \"${data.user}\" added to the list.`);
    }

    logger.log(`Updated user list: ${JSON.stringify(Users)}`);
    socketIO.emit("responseNewUser", Users);
  });

  socket.on("requestUsers", () => {
    logger.log(`User list sent: ${JSON.stringify(Users)}`);
    socket.emit("responseNewUser", Users);
  });

  socket.on("disconnectChat", () => {
    const index = Users.findIndex((user) => user.socketID === socket.id);
    if (index !== -1) {
      Users.splice(index, 1);
      logger.log(`User disconnected. Updated user list: ${JSON.stringify(Users)}`);
      socketIO.emit("responseNewUser", Users);
    }
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("responseTyping", data);
  });

  socket.on("disconnect", () => {
    const index = Users.findIndex((user) => user.socketID === socket.id);
    if (index !== -1) {
      Users.splice(index, 1);
      logger.log(`User ${socket.id} disconnected. Updated user list: ${JSON.stringify(Users)}`);
      socketIO.emit("responseNewUser", Users);
    }
  });
});

sequelize.sync().then(() => {
  http.listen(PORT, () => {
    logger.log(`Server running at http://localhost:${PORT}`);
  });
});
