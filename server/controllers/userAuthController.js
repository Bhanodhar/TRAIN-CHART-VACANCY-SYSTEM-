const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const registerUser=async (req,res)=>{
    try{
        const{name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        // check if user email already exists
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already exists"});
        }

        //hash the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        // Generate token
        const token=jwt.sign(
            {
                id:user._id,
                role:user.role,
            },
            process.env.JWT_SECRET
        );

        res.status(201).json({
            message:"User registered scuccessfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });
    }
        catch(error){
            res.status(500).json({message:"Server error", error:error.message });
    }
}
    //login user
    const loginUser = async (req,res)=>{
        try{
            const{email,password}=req.body;
            if(!email || !password){
                return res.status(400).json({message:"all fields are required"});
            }
            // check if user exists
            const user=await User.findOne({email});
            if(!user){
                return res.status(400).json({message:"invalid credentials"});
            }

            //compare password
            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({message:"invalid credentials"});
            }

            // generate token
            const token=jwt.sign(
            {id:user._id, role:user.role},
                process.env.JWT_SECRET,
            { expiresIn:"2h"});
             
            res.status(200).json({
                message:"user loggedin",
                token,
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                },
            });
        }
        catch(error){
            res.status(500).json({message:"server error",error:error.message});
        }};
    

module.exports = { registerUser, loginUser};