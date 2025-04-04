import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';


const PORT = process.env.PORT || 4000;
const app = express()

await connectDB();


app.use(express.json())

app.use(cors())

app.get('/',(req,res)=>res.send("API WORKING..."));
// api end points
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)


app.listen(PORT,()=>console.log('server running on port'  + PORT));