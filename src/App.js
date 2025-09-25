import { useState } from "react";
// import "./App.css";
import Form from "./Form";
import LoginPage from "./LoginPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Insert your credentials");
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Form />}
    </div>
  );
}

export default App;
