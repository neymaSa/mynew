import mongoose from "mongoose"; 


const UserSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true
    },

   email:{
    type:String,
    required:true,
    unique:true
   },

   profilePicture:{
    type:String,
    default:"https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg"

   },

    
   freindRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
  
  ],
   
  freindRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
   
  
  ],
 
  
  
  
  
  
 
  
  
  
  password:{
    type:String,
    required:true
   }

},{timestamps:true}) 

const User = mongoose.model("User",UserSchema)

export default User