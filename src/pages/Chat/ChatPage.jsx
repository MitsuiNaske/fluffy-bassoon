import Slidebar from "./components/slidebar";
import Body from "./components/body";
import MessageBlock from "./components/messageBlock";
import { useEffect, useState } from "react";

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.on("response", (data) => setMessages([...messages, data]))
  }, [socket, messages]);

  useEffect(() => {
    socket.on("typing", (data) => {
      setStatus(data)
      setTimeout(() => setStatus(""), 1000);
    })
  }, [socket]);

  return (
    <div className="flex h-svh p-5">
      <Slidebar socket={socket} />
      <main>
        <Body messages={messages} socket={socket} status={status} />
        <MessageBlock socket={socket} />
      </main>
    </div>
  );
};

export default ChatPage;
