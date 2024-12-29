import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import MessageBlock from "./messageBlock";

const Body = ({ messages, socket, status }) => {
  const navigate = useNavigate();
  const endOfMessagesRef = useRef(null); 

  const handleLeave = () => {
    localStorage.removeItem("user");
    socket.emit("disconnectChat", { userDelete: localStorage.getItem("user") });
    navigate("/");
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); 

  return (
    <div className="flex flex-col bg-white rounded-lg shadow h-full">
      <header className="flex justify-between items-center p-3 border-b">
        <h1 className="text-xl font-bold">Chat</h1>
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Leave Chat
        </button>
      </header>

      <div className="flex-1 flex flex-col gap-3 p-5 overflow-y-auto bg-gray-100">
        {messages.map((message) =>
          message.name === localStorage.getItem("username") ? (
            <div
              key={message.id}
              className="self-end bg-blue-500 text-white p-3 rounded-lg max-w-xs break-words"
            >
              <p className="text-sm font-bold">You</p>
              <p>{message.text}</p>
            </div>
          ) : (
            <div
              key={message.id}
              className="self-start bg-gray-300 text-black p-3 rounded-lg max-w-xs break-words"
            >
              <p className="text-sm font-bold">{message.name}</p>
              <p>{message.text}</p>
            </div>
          )
        )}
        {status && <p className="text-sm text-gray-500 italic">{status}</p>}
        <div ref={endOfMessagesRef} />
      </div>

      <MessageBlock socket={socket} />
    </div>
  );
};

export default Body;
