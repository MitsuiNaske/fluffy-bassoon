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
      window.location.reload();
      navigate("/chat");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(
        error.response?.data?.error || "An error occurred during login."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-describedby="username-help"
            />
            <small
              id="username-help"
              className="text-xs text-gray-500 mt-1 block"
            >
              Your username for the account
            </small>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-describedby="password-help"
            />
            <small
              id="password-help"
              className="text-xs text-gray-500 mt-1 block"
            >
              Your account password
            </small>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
