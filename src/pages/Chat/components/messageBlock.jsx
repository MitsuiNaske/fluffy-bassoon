import { useState } from "react";

const MessageBlock = ({socket}) => {
  const [message, setMessage] = useState("");

  const isTyping = () => {
    socket.emit("typing", `${localStorage.getItem("username")} is typing` );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("username")){
        socket.emit("message", {
            text: message,
            name: localStorage.getItem("username"),
            id: `${localStorage.getItem("userid")}-${Math.random()}`,
            socketID: socket.id
        })
    }
    setMessage("");
  };
  return (
    <div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={isTyping}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default MessageBlock;
