const express = require("express");
const router = express.Router();
const { signup, login, logout,me } = require("../controllers/authController");
const tokenVerification = require("../middlewares/tokenVerification");


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me",tokenVerification,me);


module.exports = router;