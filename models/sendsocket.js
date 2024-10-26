import mongoose from "mongoose"; 


const SocketSchema = new mongoose.Schema({
 

 senderId:{
   type: String,
  
 },


 reciverId:{
   type: String,
   
 },



sokectid:{
  type:String
 },

sendername:{
  type:String
},



},{timestamps:true}) 

const Socekt  = mongoose.model("Socekt",SocketSchema)

export default Socekt 