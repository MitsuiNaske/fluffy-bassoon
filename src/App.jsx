import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/Chat/ChatPage";
import socketIO from "socket.io-client";
import Header from "./header";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";

const socket = socketIO.io("http://localhost:5000", {
  query: { token: sessionStorage.getItem("token") },
});

function App() {
  return (
    <><Header socket={socket} /><Routes>
      <Route path="/chat" element={<ChatPage socket={socket} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes></>
  );
}

export default App;
