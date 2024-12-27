import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userid", response.data.userid);
      sessionStorage.setItem("token", response.data.token);
      console.log("Login successful:", response.data);
      console.log("Username:", username);
      window.location.reload()
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(
        error.response?.data?.error || "An error occurred during login."
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Вывод ошибки */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            aria-describedby="username-help"
          />
          <small id="username-help">Your username for the account</small>
        </div>
        <br />
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            aria-describedby="password-help"
          />
          <small id="password-help">Your account password</small>
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
