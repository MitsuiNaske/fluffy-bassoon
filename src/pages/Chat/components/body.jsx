import { useNavigate } from "react-router-dom";

const Body = ({ messages, socket }) => {
  const navigate = useNavigate();

  const handleLeave = () => {
    localStorage.removeItem("user");
    socket.emit("disconnectChat", { userDelete: localStorage.getItem("user") });
    navigate("/");
  };

  return (
    <>
      <header>
        <button onClick={handleLeave}>Leave Chat</button>
      </header>

      <div>
        {messages.map((message) =>
          message.name === localStorage.getItem("user") ? (
            <div key={message.id} className="message self">
              <p>You</p>
              <div>
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div key={message.id} className="message other">
              <p>{message.name}</p>
              <div>
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Body;
