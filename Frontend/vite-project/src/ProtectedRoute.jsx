import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import instance from "./config/axios";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await instance.get("/auth/me");
                setAllowed(true);
            } catch (error) {
                setAllowed(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 1) While checking
    if (loading) {
        return <h2>Loading...</h2>;
    }

    // 2) If not allowed → go to login
    if (!allowed) {
        return <Navigate to="/login" replace />;
    }

    // 3) If allowed → show page
    return children;
};

export default ProtectedRoute;