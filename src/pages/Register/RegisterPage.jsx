import { useState } from "react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(false);
  return (
    <div>
      <h3>Name:</h3>
      <label htmlFor="name"></label>
      <input
        type="text"
        id="name"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />

      <h3>Email:</h3>
      <label htmlFor="email"></label>
      <input
        type="email"
        id="email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
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
      <input type="password" id="confirmPassword" onChange={(event) => (event.target.value === password ? setConfirmPassword(true) : setConfirmPassword(false))} />

      <button type="submit">Register</button>
    </div>
  );
};

export default RegisterPage;
