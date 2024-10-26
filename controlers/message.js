import Message from '../models/message.js'


export const SendMessage = async(req,res) => {

    try{
   
        const{senderId,reciverId,message,sokectid,text} = req.body 

        const newMessage = new Message({senderId,reciverId,message,sokectid,text})
          
      
        
        await newMessage.save()
       
      
       
       
        res.status(200).json(newMessage)


    }
    catch(error){
        console.log(error)
    }
}





export const getSendMessage = async(req,res) => {

    try{
  
        const { senderId, reciverId } = req.params;

        const messages = await Message.find({
          $or: [
            { senderId: senderId, reciverId: reciverId },
            { senderId:  reciverId, reciverId: senderId },
          ],
        }).populate("senderId", "_id name");
    
        res.json(messages);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}






