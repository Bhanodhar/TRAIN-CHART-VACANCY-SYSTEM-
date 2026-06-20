const express=require("express");
const router= express.Router();
const {createTrain, getAllTrains, getTrainById, updateTrain, deleteTrain}=require("../controllers/trainController");
const {protect, adminOnly}= require("../middleware/authMiddleware");


// Public routes - anyone can view trains
router.get("/",getAllTrains);

router.get("/:id",getTrainById);



// Admin only routes
router.post("/",protect,adminOnly,createTrain);
router.put("/:id", protect,adminOnly,updateTrain);
router.delete("/:id",protect,adminOnly,deleteTrain);


module.exports=router;