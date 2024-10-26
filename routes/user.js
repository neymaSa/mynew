import express from 'express'
import { Signup,SignIn,Couser,getUser,updateUser,Deletjoin,searchuser,logout } from '../controlers/user.js'


const router = express.Router() 

router.post("/signup",Signup)

router.post("/signIn",SignIn)

router.get("/getuser/:id",Couser)

router.get("/singleuser/:userId",getUser)
router.post("/update",updateUser)

router.put("/deletjoin",Deletjoin)
router.post("/search",searchuser)
router.get("/log",logout)

export default router