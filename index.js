import express from 'express'
import http from 'http'
import {Server} from 'socket.io'


import mongoose from 'mongoose'
import cors from 'cors'

import cookieParser from 'cookie-parser'
import userRoute from './routes/user.js'
import messageRoute from './routes/message.js'
import sendsocketRoute from './routes/sendsocket.js'
import {v4 as uuid}  from 'uuid';
import Message from './models/message.js'

const app = express()

app.use(cors({origin:"http://localhost:3000",credentials:true}))
app.use(express.json())
app.use(cookieParser())



mongoose.connect("mongodb+srv://j:1@cluster0.6owpk.mongodb.net/").then(() => console.log("Db Connected"))
.catch((error) => console.log(error))





app.use("/api/user",userRoute)
app.use("/api/message",messageRoute)
app.use("/api/sendsocket",sendsocketRoute)




const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"]
}
})




const rooms = new Map();
let activeUsers = [];


io.on('connection', (socket) => {
  // socket refers to the client socket that just got connected.
  // each socket is assigned an id
  console.log(socket.id, 'connected');
 

 socket.on('username', (username) => {
    console.log('username:', username);
    socket.data.username = username;
   
  });

 
 
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
 
 });
 



  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });
 

socket.on("send", (data) => {
  io.emit("recive",data)

})


  socket.on('createRoom', async (callback) => { // callback here refers to the callback function from the client passed as data
    const roomId = uuid(); // <- 1 create a new uuid
    await socket.join(roomId); // <- 2 make creating user join the room
     console.log(roomId)
    // set roomId as a key and roomData including players as value in the map
    rooms.set(roomId, { roomId,players: [{ id: socket.id, username: socket.data?.username }]
    
    });
    console.log(roomId)

    callback(roomId); // <- 4 respond with roomId to client by calling the callback function from the client
  });

 
  socket.on('joinRoom', async (args, callback) => {
    // check if room exists and has a player waiting
    const room = rooms.get(args.roomId);
    let error, message;
  
    if (!room) { // if room does not exist
      error = true;
      message = 'room does not exist';
    } else if (room.length <= 0) { // if room is empty set appropriate message
      error = true;
      message = 'room is empty';
    } else if (room.length >= 2) { // if room is full
      error = true;
      message = 'room is full'; // set message to 'room is full'
    }

    if (error) {
      // if there's an error, check if the client passed a callback,
      // call the callback (if it exists) with an error object and exit or 
      // just exit if the callback is not given

      if (callback) { // if user passed a callback, call it with an error payload
        callback({
          error,
          message
        });
      }

      return; // exit
    }

    await socket.join(args.roomId); // make the joining client join the room

    // add the joining user's data to the list of players in the room
    const roomUpdate = {...room,players: [...room.players,{ id: socket.id, username: socket.data?.username },],};
     
    rooms.set(args.roomId, roomUpdate);

    callback(roomUpdate); // respond to the client with the room details.

    // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
    socket.to(args.roomId).emit('opponentJoined', roomUpdate);
  });

  socket.on('move', (data) => {
    // emit to all sockets in the room except the emitting socket.
    socket.to(data.room).emit('move', data.move);
    console.log(data)
  
  
  });


});     

  
server.listen(8080,() => {
    console.log("server is runinng")
})
