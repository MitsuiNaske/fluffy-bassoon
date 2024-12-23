import { Routes, Route } from "react-router-dom";
import Main from "./pages/Home/Main";
import ChatPage from "./pages/Chat/ChatPage";
import socketIO from "socket.io-client";

const socket = socketIO.connect("http://localhost:5000");

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main socket={socket}/>} />
      <Route path="/chat" element={<ChatPage socket={socket}/>} />
    </Routes>
  );
}

export default App;
