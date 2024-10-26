import mongoose from "mongoose"; 


const SendSchema = new mongoose.Schema({
 

 senderId:{
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
 },


 reciverId:{
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
 },

 message:{
    type:String
 },

sokectid:{
  type:String
 },



 text:{
  type:String
 }, 







},{timestamps:true}) 

const Message = mongoose.model("Message",SendSchema)

export default Message