import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { getEmailError, getPasswordError } from "./config/validator";
import instance from "./config/axios";

const Login = () => {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
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

    const emailErr = getEmailError(form.email);
    const passwordErr = getPasswordError(form.password);

    setErrors({
      email: emailErr,
      password: passwordErr,
    });

    if (emailErr || passwordErr) return;

    try {
      setLoading(true);

      await instance.post("/auth/login", form);
      console.log("Login successful");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      alert(errorMessage);
      console.error("Login error:", err.response?.data);
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
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>LOG IN</h1>
          <p>Welcome back. Please enter your details.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              name="email"
              className="login-input"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              autoComplete="email"
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              name="password"
              className="login-input"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            New here? <Link to="/signup">Create account</Link>
          </p>
          <p>
            <Link to="/">Home Page</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;