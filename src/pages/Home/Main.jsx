import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Main = ({ socket }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("user", user)
    socket.emit("newUser", { user, socketID: socket.id })
    navigate("/chat")
  }


  return (
    <form onSubmit={handleSubmit}>
      <h2>Log in Chat</h2>
      <label htmlFor="user"></label>
      <input
        type="text"
        id="user"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Main;
