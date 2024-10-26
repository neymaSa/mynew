import User from '../models/user.js'
import bcryptjs from 'bcryptjs'

import jwt from 'jsonwebtoken' 




export const Signup = async(req,res,next) =>{

   try{

    const{username,email,password} = req.body 

    if(!username || !email || !password || username === "" || email === "" || password === ""){
      return res.status(404).json("error")
    }
  
    const hashpassword = bcryptjs.hashSync(password,10)
  
  
    const NewUser = new User({username,email,password:hashpassword})
    
     await NewUser.save()
    res.status(200).json({message:"new User have been Saved"})
    
    
      }
      catch(error){
       next(error)
      }
}




export const SignIn =async(req,res,next) =>{

    try{
    
        const{username,password} = req.body 
    
    
        if(!username || !password || username=== "" || password === ""){
         return next(errorHandler(400,"all field are required"))
        }
    
    
      const validUser = await User.findOne({username})
      
      if(!validUser){
      res.status(404).json("error")
      }
    
      const validPassword = bcryptjs.compareSync(password,validUser.password)
       
      if(!validPassword){
      res.status(404).json("error")
      }
     
      
     const token = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},"hh",{expiresIn:"1d"})
     
     const{password:pass, ...rest} = validUser._doc
    
     res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest)
     
     
    
    }
    catch(error){
     next(error)
    }
    } 



    export const Couser = async(req,res,next) => {
   
      try{
        const loggedInUserId = req.params.id;
   
        const user = await User.find({ _id: { $ne: loggedInUserId } }).sort({createdAt:-1})
      
    
      res.status(200).json(user)
       }
      catch(error){
        res.status(500).json("error")
      }
    } 




    
    export const getUser = async(req,res,next) => {
   
      try{
       
   
        const singluser = await User.findById(req.params.userId)
      
    
      res.status(200).json(singluser)
       }
      catch(error){
        res.status(500).json("error")
      }
    }



  export  const updateUser = async(req,res) =>{

      const { currentUserId, selectedUserId } = req.body;

      try {
        //update the recepient's friendRequestsArray!
        await User.findByIdAndUpdate(selectedUserId,  {
          $push: { freindRequests: currentUserId, },
        });
    
        //update the sender's sentFriendRequests array
        await User.findByIdAndUpdate(currentUserId, {
          $push: {  freindRequests: selectedUserId, },
        });
    
        res.sendStatus(200);
      } catch (error) {
        console.log(error)
      }
    } 



    export  const Deletjoin = async(req,res) =>{

      const { currentUserId, selectedUserId } = req.body;

      try {
        //update the recepient's friendRequestsArray!
        await User.findByIdAndUpdate(selectedUserId,  {
          $pull: { freindRequests: currentUserId, },
        });
    
        //update the sender's sentFriendRequests array
        await User.findByIdAndUpdate(currentUserId, {
          $pull: { freindRequests: selectedUserId, },
        });
    
        res.sendStatus(200);
      } catch (error) {
        console.log(error)
      }
    } 



    export const searchuser = async(req,res) =>{


      try{
      
       let userPatren = new RegExp("^"+req.body.query)
     
       const userqery = await User.find({username:{$regex:userPatren}})
     res.status(200).json(userqery)
      }
      catch(error){
        res.status(500).json(error)
      }
    } 



    export const logout = async(req,res) => {




   
        try{
            res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User logged out successfully!")
    
        }
        catch(err){
            res.status(500).json(err)
        }
 







    }