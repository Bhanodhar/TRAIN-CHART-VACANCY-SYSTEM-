const express = require("express");
const router = express.Router();
const {registerAdmin, loginAdmin}= require("../controllers/adminAuthController");
const {protect, adminOnly} = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

//Private route
router.get('/dashboard',protect,adminOnly,(req,res)=>{
    res.json({ message: "Welcome Admin!", admin: req.user });
});

module.exports = router;