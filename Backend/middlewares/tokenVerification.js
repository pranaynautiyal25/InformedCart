const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const tokenVerification = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // 1) Check access token first
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            req.user = decoded;
            return next();
        } catch (err) {
            // access token expired or invalid, move to refresh token check
        }
    }

    // 2) If no access token, check refresh token
    if (!refreshToken) {
        return res.status(401).json({
            message: "Please login again",
        });
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedRefresh.id);
        if (!user) {
            return res.status(401).json({
                message: "User not found, please login again",
            });
        }

        // check if refresh token matches DB token
        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token, please login again",
            });
        }

        // 3) Generate new access token
        const newAccessToken = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
        });

        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Session expired, please login again",
        });
    }
};

module.exports = tokenVerification;