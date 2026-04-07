import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";
import {
  getEmailError,
  getPasswordError,
  getUsernameError,
} from "./config/validator";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameErr = getUsernameError(form.username);
    const emailErr = getEmailError(form.email);
    const passwordErr = getPasswordError(form.password);

    setErrors({
      username: usernameErr,
      email: emailErr,
      password: passwordErr,
    });

    if (usernameErr || emailErr || passwordErr) return;

    try {
      setLoading(true);

      // backend api call later
      // await axios.post(...)
      navigate("/login");
    } catch (err) {
      alert("Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h1>SIGN UP</h1>
          <p>Create your account to continue.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              name="username"
              className="signup-input"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              name="email"
              className="signup-input"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              name="password"
              className="signup-input"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button className="signup-button" type="submit" disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          <p>
            <Link to="/">Home Page</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;