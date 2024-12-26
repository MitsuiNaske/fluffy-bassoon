import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
