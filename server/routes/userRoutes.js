const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/userAuthController");
const { getAllUsers, deleteUser } = require("../controllers/userController");
const {protect, userOnly} = require("../middleware/authMiddleware");

router.post('/register',registerUser);
router.post('/login',loginUser);

router.get('/profile',protect, userOnly, (req,res)=>{
    res.json({message:"Welcome User!",user:req.user});
});


// Admin only routes
router.get("/all", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;