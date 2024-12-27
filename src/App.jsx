import { Routes, Route, useNavigate } from "react-router-dom";
import ChatPage from "./pages/Chat/ChatPage";
import socketIO from "socket.io-client";
import Header from "./header";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import { useEffect, useState } from "react";

const socket = socketIO.io("http://localhost:5000", {
  query: { token: sessionStorage.getItem("token") },
});

function App() {
  const navigate = useNavigate();
  const [tokenVerified, setTokenVerified] = useState(false);
  useEffect(() => {
    socket.emit("verifyToken", sessionStorage.getItem("token"));

    socket.on("tokenVerified", (data) => {
      if (!data.success) {
        console.error("Token verification failed. Disconnecting...");
        socket.disconnect();
        setTokenVerified(false);
        navigate("/login");
      } else {
        setTokenVerified(true);
      }
    });

    return () => {
      socket.off("tokenVerified");
    };
  }, [socket]);

  return (
    <>
      <Header socket={socket} verifedToken={tokenVerified} />
      <Routes>
        {tokenVerified && (
          <Route path="/chat" element={<ChatPage socket={socket} />} />
        )}
        {!tokenVerified && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
