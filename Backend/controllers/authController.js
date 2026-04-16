const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};

const createRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const accessToken = createAccessToken(newUser);
        const refreshToken = createRefreshToken(newUser);

        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Signup failed", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        console.log("access token:", accessToken);
        console.log("refresh token:", refreshToken);

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Login failed", error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const user = await User.findOne({ refreshToken });

            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        // 🔥 Clear BOTH cookies
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
            error: error.message,
        });
    }
};

const me = async (req, res) => {
    return res.status(200).json({
        message: "User logged in",
        user: req.user
    })
}

module.exports = { signup, login, logout, me };