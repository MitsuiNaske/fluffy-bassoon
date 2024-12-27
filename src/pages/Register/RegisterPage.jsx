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
    <form onSubmit={handleRegister}>
      <h3>Name:</h3>
      <label htmlFor="name"></label>
      <input
        type="text"
        id="name"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />

      <h3>Password:</h3>
      <label htmlFor="password"></label>
      <input
        type="password"
        id="password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
      />

      <h3>Confirm password:</h3>
      <label htmlFor="confirmPassword"></label>
      <input
        type="password"
        id="confirmPassword"
        onChange={(event) => {
          setConfirmPassword(event.target.value);
        }}
      />

      <button type="submit">Register</button>
      {errors && <p style={{ color: "red" }}>{errors}</p>}
    </form>
  );
};

export default RegisterPage;
