import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./User.css";
import LogBk from "./img/regbk.jpg";

function Register() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};

    // Username: Alphanumeric, at least 3 characters
    if (!/^[a-zA-Z0-9]{3,}$/.test(username)) {
      newErrors.username = "Username must be at least 3 characters and alphanumeric.";
    }

    // Full Name: Only letters and spaces allowed
    if (!/^[a-zA-Z\s]+$/.test(fullname)) {
      newErrors.fullname = "Full Name can only contain letters and spaces.";
    }

    // Email: Valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmail)) {
      newErrors.gmail = "Please enter a valid email address.";
    }

    // Password: At least 8 characters, one uppercase, one lowercase, one number
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      newErrors.password = "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number.";
    }

    // Phone: Exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs before submitting
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8081/usermanagement", {
        username,
        fullname,
        gmail,
        password,
        phone,
      });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      setError({ apiError: "Registration failed. Please try again." });
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
            <h2 className="auth_topic_update">Register</h2>

            <div className="form-group">
              <label className="lable_auth" htmlFor="username">Username</label>
              <input
                className="auth_input"
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {error.username && <span className="error_msg">{error.username}</span>}
            </div>

            <div className="form-group">
              <label className="lable_auth" htmlFor="fullname">Full Name</label>
              <input
                className="auth_input"
                type="text"
                id="fullname"
                name="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
              {error.fullname && <span className="error_msg">{error.fullname}</span>}
            </div>

            <div className="form-group">
              <label className="lable_auth" htmlFor="gmail">Email</label>
              <input
                className="auth_input"
                type="email"
                id="gmail"
                name="gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                required
              />
              {error.gmail && <span className="error_msg">{error.gmail}</span>}
            </div>

            <div className="form-group">
              <label className="lable_auth" htmlFor="password">Password</label>
              <input
                className="auth_input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error.password && <span className="error_msg">{error.password}</span>}
            </div>

            <div className="form-group">
              <label className="lable_auth" htmlFor="phone">Phone</label>
              <input
                className="auth_input"
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {error.phone && <span className="error_msg">{error.phone}</span>}
            </div>

            {error.apiError && <span className="error_msg">{error.apiError}</span>}

            <button type="submit" className="authbtn">Register</button>

            <p className="no_acc">
              If you have an account?{" "}
              <span className="link" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
