import React, { useState } from "react";
import axios from "axios";
import "./User.css";
import LogBk from "./img/log.jpg";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const user = response.data;
        localStorage.setItem("userId", user.id); 
        localStorage.setItem("user", JSON.stringify(user));

        alert("Login Successful.");
        window.location.href = "/home"; 
      }
    } catch (error) {
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="auth_container">
      <div className="login-container">
        <div className="login_container_new">
          <div className="lft_auth">
            <img src={LogBk} alt="logo" className="img_lftlog" />
          </div>
          <form className="riht_auth" onSubmit={handleSubmit}>
            <h2 className="auth_topic">Login</h2>

            <div className="form-group">
              <label className="lable_auth" htmlFor="username">
                Username
              </label>
              <input
                className="auth_input"
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="lable_auth" htmlFor="password">
                Password
              </label>
              <input
                className="auth_input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="authbtn">
              Login
            </button>
            <p className="no_acc">
              If Your don't have account ?{" "}
              <span
                className="link"
                onClick={() => (window.location.href = "/register")}
              >
                Register
              </span>
            </p>
            <p
              className="no_acc poit"
              onClick={() => (window.location.href = "/adminlogin")}
            >
              Admin
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
