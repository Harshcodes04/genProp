const jwt=require("jsonwebtoken");
const tokenBlackListModel=require("../models/blacklist.model")
const authUser=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"no token provided"})
    }
    const isTokenBlackListed=await tokenBlackListModel.findOne({token})
    if(isTokenBlackListed){
        return res.status(401).json({message:"invalid token"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded;
        next();
    }catch(err){
        return res.status(401).json({message:"invalid token"})
    }
    
}
module.exports={authUser}

//This middleware is used to check if the token is valid and not blacklisted so that the user can be authenticated
// it is used in getMeController
// in getMeController we pass this middleware as an argument
// and it is used to get the user details
