const jwt=require("jsonwebtoken");

const protect = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({message: "no token, access denied"});
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;
        next();
    }
    catch(error){
        res.status(401).json({message:"invalid token"});
    }
};

// Admin only route
const adminOnly=(req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        next();
    }
    else{
        res.status(403).json({message:"Access denied, admins only"});
    }
};

// User only route
const userOnly = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, users only" });
  }
};


module.exports = { protect, adminOnly, userOnly};



