import React, { useEffect, useState } from "react";
import "./Signup.css";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  getEmailError,
  getPasswordError,
  getUsernameError,
} from "./config/validator";
import instance from "./config/axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await instance.get("/auth/me");
        setLoggedIn(true);
      } catch (error) {
        setLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

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

      await instance.post("/auth/signup", form);

      // if backend sets cookies on signup, go directly to dashboard
      navigate("/dashboard");

      // if you want signup -> login instead, use this:
      // navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Sign up failed";
      alert(errorMessage);
      console.error("Signup error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <h2>Loading...</h2>;
  }

  if (loggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

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
              autoComplete="username"
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
              autoComplete="email"
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
              autoComplete="new-password"
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