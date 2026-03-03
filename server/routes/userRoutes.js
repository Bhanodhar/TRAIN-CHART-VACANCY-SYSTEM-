const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/userAuthController");
const {protect, userOnly} = require("../middleware/authMiddleware");

router.post('/register',registerUser);
router.post('/login',loginUser);

router.get('/profile',protect, userOnly, (req,res)=>{
    res.json({message:"Welcome User!",user:req.user});
});

module.exports = router;