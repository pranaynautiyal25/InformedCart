import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import instance from "./config/axios";
import BarcodeScanner from "./BarcodeScanner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [barcodeH, setBarcodeH] = useState("");
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await instance.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!barcodeH) return;

      try {
        setLoading(true);
        setProductData(null);


        //will check dashboard 
        const res = await instance.get(`/product/${barcodeH}`);
        const rawData = res.data.data;

        // ── Fetch AI-processed product info ──
        const aiRes = await instance.post("/ai/info", { rawData });
        const finalRes = aiRes.data;
        setProductData(finalRes);

      } catch (err) {
        console.log("Product fetch error:", err);
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcodeH]);

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
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-logo">INFORMED-CART</span>
          <span className="dashboard-tagline">Smart Shopping</span>
        </div>

        <div className="dashboard-user">
          {user && (
            <span className="dashboard-greeting">
              Hello, {user.username}
            </span>
          )}
          <button className="dashboard-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-section">
          <div className="section-label">STEP 1</div>
          <h2 className="section-title">Scan a Product</h2>
          <p className="section-desc">
            Use your camera or upload a barcode image to get started.
          </p>

          <BarcodeScanner
            barcodeH={barcodeH}
            setBarcodeH={setBarcodeH}
          />
        </section>

        <div className="dashboard-divider" />

        <section className="dashboard-section">
          <div className="section-label">STEP 2</div>
          <h2 className="section-title">Product Analysis</h2>
          <p className="section-desc">
            Product info, quality score, and better alternatives will appear here.
          </p>

          <div className="dashboard-placeholder">
            {loading && <p>Loading product data...</p>}

            {!loading && productData && (
              <div style={{ textAlign: "left" }}>
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(productData, null, 2)}
                </pre>
              </div>
            )}

            {!loading && !productData && (
              <p>Product details coming soon...</p>
            )}

            {barcodeH && <p>Detected Barcode: {barcodeH}</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;