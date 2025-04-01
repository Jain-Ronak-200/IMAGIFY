import userModel from "../models/useModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import transactionModel from "../models/transactionModel.js";

const stripe = new Stripe(process.env.STRIPE_KEY)

// const currency = 'inr'
const registerUser = async(req,res)=>{
    try {
        const{name,email,password}=req.body;
        if (!name || !email||!password) {
            return res.json({success:false,message:"missing details"})
            

            
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,email,password:hashedPassword
        }
        const newuser = new userModel(userData)
        const user = await newuser.save()
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET)

        res.json({success:true,token,user:{name:user.name}})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            return res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const userCredits = async(req,res)=>{
    try {
        const{userId} = req.body;

        const user = await userModel.findById(userId);
        res.json({success:true,credits:user.creditBalance,user:{name:user.name}})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    console.log("Received request:", { userId, planId });

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Missing details" });
    }

    let credits, plan, price;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 500;
        price = 50;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 1500;
        price = 150;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        price = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid Plan" });
    }

    const date = Date.now();
    const transactionData = {
      userId,
      plan,
      amount: price,
      credits,
      date,
    };

    const newTransaction = new transactionModel(transactionData);
    await newTransaction.save();

    console.log("Transaction saved:", newTransaction);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: plan,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success?success=true&session_id=${newTransaction._id}`,
      cancel_url: `http://localhost:5173/success?success=false&session_id=${newTransaction._id}`,
    });
    

    console.log("Stripe session created:", session);
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error creating Stripe session:", error);
    res.json({ success: false, message: error.message });
  }
};


const verifyStripe = async (req, res) => {
  try {
    const { orderId, success,userId } = req.body; // Extract data from request body
    // const userId = req.user.id; // Extract userId from the auth middleware

    if (!orderId || !success) {
      return res.json({ success: false, message: "Missing required details" });
    }

    if (success === 'true') {
      const transaction = await transactionModel.findById(orderId);
      if (!transaction) {
        return res.json({ success: false, message: "Transaction not found" });
      }

      // Update transaction as paid and increase user's credit balance
      await transactionModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: transaction.credits } });

      res.json({ success: true, message: "Payment verified and credits updated successfully" });
    } else {
      // If payment fails, delete the transaction
      await transactionModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment verification failed and transaction deleted" });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    res.json({ success: false, message: error.message });
  }
};



export{registerUser,loginUser,userCredits,placeOrderStripe,verifyStripe};