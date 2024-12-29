import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const handleRegister = async (event) => {
    event.preventDefault();
    setErrors(null);
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username: name,
        password: password,
        confirmPassword: confirmPassword,
      });
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setErrors(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {errors && (
            <p className="text-red-500 text-center mb-4">{errors}</p>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username:
            </label>
            <input
              type="text"
              id="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
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
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              aria-describedby="password-help"
            />
            <small
              id="password-help"
              className="text-xs text-gray-500 mt-1 block"
            >
              Your password for the account
            </small>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              aria-describedby="confirmPassword-help"
            />
            <small
              id="confirmPassword-help"
              className="text-xs text-gray-500 mt-1 block"
            >
              Confirm your password
            </small>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
