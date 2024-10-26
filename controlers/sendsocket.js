

import Socekt from '../models/sendsocket.js'


export const SendSocket = async(req,res) => {

    try{
   
        const{senderId,reciverId,sokectid,sendername} = req.body 

        const newSocket = new Socekt({senderId,reciverId,sokectid,sendername})
          
      
        
        await newSocket.save()
       
       
       
       
        res.status(200).json(newSocket )


    }
    catch(error){
        console.log(error)
    }
}



export const getSendSocket = async(req,res) => {

    try{
  
        const { senderId, reciverId } = req.params;

const newSocket = await Socekt.find({$or: [{ senderId: senderId, reciverId: reciverId },{ senderId:  reciverId, reciverId: senderId },],
        }).populate("senderId", "_id name");
    
        res.json(newSocket);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}



export const deletSocket  = async(req,res) => {

    try{
  
        await Socekt.findByIdAndDelete(req.params.sokectid)
        res.status(200).json("post have been deleted")
    }
    catch(error){
        res.status(500).json(error)
    }
}