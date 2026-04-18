const express = require("express");
const router = express.Router();
const { generateInfo, x } = require("../controllers/aiController");


router.post("/info", generateInfo);
router.post("/recommend", x);



module.exports = router;