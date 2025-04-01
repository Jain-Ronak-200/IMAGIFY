import mongoose from "mongoose";


const connectDB = async()=>{
    mongoose.connection.on('connected',()=>console.log("DATABASE IS CONNECTED"))
    await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
}

export default connectDB;