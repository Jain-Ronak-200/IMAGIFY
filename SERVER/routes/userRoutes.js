import express from 'express';
import { loginUser, placeOrderStripe, registerUser, userCredits, verifyStripe } from '../controllers/userController.js';
import userAuth from '../middlewars/auth.js';


const userRouter = express.Router()

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/credits',userAuth,userCredits);
userRouter.post('/pay-stripe',userAuth,placeOrderStripe);
userRouter.post('/verify',userAuth,verifyStripe);

export default userRouter