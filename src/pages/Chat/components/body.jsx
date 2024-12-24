import { useNavigate } from "react-router-dom";

const Body = ({ messages }) => {
  const navigate = useNavigate();
  console.log(messages)
  const handleLeave = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header>
        <button onClick={handleLeave}>Leave Chat</button>
      </header>

      <div>
        {
        messages.map((message) => {
          message.name === localStorage.getItem("user") ? (
            <div key={message.id}>
              <p>You</p>
              <div>
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div key={message.id}>
              <p>{message.name}</p>
              <div>
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Body;
