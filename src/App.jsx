import { Routes, Route } from "react-router-dom";
import Main from "./pages/Home/Main";
import ChatPage from "./pages/Chat/ChatPage";
import socketIO from "socket.io-client";
import Header from "./header";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";

const socket = socketIO.connect("http://localhost:5000");

function App() {
  return (
    <><Header /><Routes>
      <Route path="/" element={<Main socket={socket} />} />
      <Route path="/chat" element={<ChatPage socket={socket} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes></>
  );
}

export default App;
