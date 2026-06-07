const userModel=require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model");

registerUserController=async(req,res)=>{
    const {email,username,password}=req.body;
    if(!email || !username || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    const isUserAlreadyExists=await userModel.findOne({
        $or:[{email},{username}]
    })
    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username==username){
            res.status(400).json({message:"username already exists"})
        }else if(isUserAlreadyExists.email==email){
            res.status(400).json({message:"email already exists"})
        }
    }
    const hash=await bcrypt.hash(password,10);
    const user=await userModel.create({email,username,password:hash})
    const token=jwt.sign(
        {
            id:user._id,username:user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
        
    )
    res.cookie("token",token)
    res.status(201).json({message:"user registered successfully",user});


    
}

loginUserController=async(req,res)=>{
    const {email,username,password}=req.body;
    const user=await userModel.findOne({
        $or:[{email},{username}]
    })
    if(!user){
        return res.status(400).json({message:"user not found"})
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({message:"invalid password"})
    }
    const token=jwt.sign(
        {
            id:user._id,username:user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
        
    )
    res.cookie("token",token)
    res.status(200).json({message:"user logged in successfully",user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
}
)
}

logoutUserController=async(req,res)=>{
    const token=req.cookies.token
    if(token){
        await tokenBlackListModel.create({token})
        res.clearCookie("token")
        res.status(200).json({message:"user logged out successfully"})
    }
}


module.exports={registerUserController,loginUserController,logoutUserController}