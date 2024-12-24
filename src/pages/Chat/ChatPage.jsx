import Slidebar from "./components/slidebar";
import Body from "./components/body";
import MessageBlock from "./components/messageBlock";
import { useEffect, useState } from "react";

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("response", (data) => setMessages([...messages, data]))
  }, [socket, messages]);

  return (
    <div className="flex h-svh p-5">
      <Slidebar socket={socket} />
      <main>
        <Body messages={messages} socket={socket} />
        <MessageBlock socket={socket} />
      </main>
    </div>
  );
};

export default ChatPage;
