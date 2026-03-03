const Admin=require("../models/Admin");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

// register admin

const registerAdmin= async (req,res)=>{
    try{
        const{name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        // check email exists
        const existingAdmin= await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({message:"email already exists"}); 
        }

        // hash password
        const salt=await bcrypt.genSalt(10);
        const hashpassword= await bcrypt.hash(password,salt);

        //create admin
        const admin = await Admin.create({
            name,
            email,
            password:hashpassword,
        });

        // generate token
        const token= jwt.sign(
            { id:admin._id, role:admin.role },
            process.env.JWT_SECRET,
            { expiresIn:"2h"}
        );
        res.status(201).json({message:"admin registered successfully",
            token,
            admin:{
                id:admin._id,
                name:admin.name,
                email:admin.email,
                role:admin.role,
            }}
        );
    }
    catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
}

// login admin

const loginAdmin= async (req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        // check if admin exists
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({message:"invalid credentials"});
        }

        //compare password
        const isMatch=await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"});
        }

        // generate token
        const token=jwt.sign(
            {id:admin._id, role:admin.role},
            process.env.JWT_SECRET,
            { expiresIn:"2h"}
        );
        res.status(200).json({
            message:"admin loggedin",
            token,
            admin:{
                id:admin._id,
                name:admin.name,
                email:admin.email,
                role:admin.role,
            },
        });
    }
    catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
}


module.exports = {registerAdmin, loginAdmin};