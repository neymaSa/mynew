

import express from 'express'
import { SendMessage,getSendMessage } from '../controlers/message.js'


const router = express.Router() 

router.post("/send",SendMessage)
router.get("/:senderId/:reciverId",getSendMessage)



export default router