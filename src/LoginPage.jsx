import { useState } from "react";
import DCC_Logo from "./assets/DCC_Logo.png";
import "./Login.css";

function LoginPage({ onLogin }) {
  const [details, setDetails] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(details.username, details.password);
  };

  return (
    <div className="container">
      <img src={DCC_Logo} alt="DCC Estates Limited" className="dcc-logo" />
      <h1 className="title">Login</h1>

      <form className="form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Username</legend>
          <input
            type="text"
            onChange={handleChange}
            name="username"
            value={details.username}
            placeholder="Enter your username"
            required
          />
        </fieldset>

        <fieldset>
          <legend>Password</legend>
          <input
            type="password"
            onChange={handleChange}
            name="password"
            value={details.password}
            placeholder="Enter your password"
            required
          />
        </fieldset>

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
