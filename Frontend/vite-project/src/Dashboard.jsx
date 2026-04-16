import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import instance from "./config/axios";
import BarcodeScanner from "./BarcodeScanner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await instance.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {}
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await instance.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
    }
  };

  return (
    <div className="dashboard-page">

      {/* ── Top Nav ── */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-logo">INFORMED-CART</span>
          <span className="dashboard-tagline">Smart Shopping</span>
        </div>

        <div className="dashboard-user">
          {user && <span className="dashboard-greeting">Hello, {user.username}</span>}
          <button className="dashboard-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="dashboard-main">

        {/* Scanner Section */}
        <section className="dashboard-section">
          <div className="section-label">STEP 1</div>
          <h2 className="section-title">Scan a Product</h2>
          <p className="section-desc">
            Use your camera or upload a barcode image to get started.
          </p>
          <BarcodeScanner />
        </section>

        {/* Divider */}
        <div className="dashboard-divider" />

        {/* Results Section */}
        <section className="dashboard-section">
          <div className="section-label">STEP 2</div>
          <h2 className="section-title">Product Analysis</h2>
          <p className="section-desc">
            Product info, quality score, and better alternatives will appear here.
          </p>

          <div className="dashboard-placeholder">
            <p>Product details coming soon...</p>
          </div>
        </section>

      </main>

    </div>
  );
};

export default Dashboard;