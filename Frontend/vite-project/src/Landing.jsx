import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from './config/axios';
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await instance.get("/auth/me");
        navigate("/dashboard");
      } catch (error) {
        // stay on landing page
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="landing-page">
      <div className="landing-card">
        <div className="landing-badge">Smart Product Decisions</div>

        <div className="landing-heading">
          <h1>INFORMED-CART</h1>
          <p>Know what you buy before you spend.</p>
        </div>

        <div className="landing-desc">
          <p>
            Scan products, check their quality, compare better alternatives, and
            make smarter choices across food, gadgets, and daily-use items.
          </p>
        </div>

        <div className="landing-actions">
          <Link to="/signup" className="landing-button landing-primary">
            Sign Up
          </Link>
          <Link to="/login" className="landing-button landing-secondary">
            Log In
          </Link>
        </div>

        <div className="landing-features">
          <div className="feature-box">
            <h3>Scan</h3>
            <p>Read barcode and fetch product info quickly.</p>
          </div>
          <div className="feature-box">
            <h3>Analyze</h3>
            <p>Score products using smart rules and weights.</p>
          </div>
          <div className="feature-box">
            <h3>Compare</h3>
            <p>See better options in the same category.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;