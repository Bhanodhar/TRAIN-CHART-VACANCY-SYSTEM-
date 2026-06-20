const express= require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB=require('./config/db');

const userRoutes= require("./routes/userRoutes");
const adminRoutes= require("./routes/adminRoutes");
const trainRoutes = require("./routes/trainRoutes");

dotenv.config();
connectDB();

const app=express();


app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/train", trainRoutes);

app.get('/',(req,res)=>{
    res.send("Train Booking API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
})