


import express from 'express'
import { SendSocket,getSendSocket,deletSocket } from '../controlers/sendsocket.js'


const router = express.Router() 

router.post("/sendsocket",SendSocket)

router.get("/:senderId/:reciverId",getSendSocket)

router.delete("/:sokectid",deletSocket)

export default router