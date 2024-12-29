import { useState } from "react";

const MessageBlock = ({ socket }) => {
  const [message, setMessage] = useState("");

  const isTyping = () => {
    socket.emit("typing", `${localStorage.getItem("username")} is typing`);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("username")) {
      if (message.length > 5000) return alert("Message too long 5000/5000");

      socket.emit("message", {
        text: message,
        name: localStorage.getItem("username"),
        id: `${localStorage.getItem("userid")}-${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  };
  return (
    <div className="flex w-full items-end p-3 bg-gray-100">
      <form
        onSubmit={handleSend}
        className="w-full flex justify-between items-center gap-3"
      >
        <input
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={message}
          placeholder="Type your message..."
          onChange={(e) => {
            if (e.target.value.length <= 5000) {
              setMessage(e.target.value)
            } else {
              alert(`Message too long ${e.target.value.length}/5000`);
            }
          }}
          onKeyDown={isTyping}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageBlock;
