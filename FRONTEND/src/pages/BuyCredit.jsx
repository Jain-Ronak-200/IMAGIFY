import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import {Appcontext} from '../context/Appcontext'

import { delay, motion } from "motion/react";
import axios from 'axios';
import { toast } from 'react-toastify';


const BuyCredit = () => {
  const{user,backendUrl,loadCreditdsData,token,setShowLogin,navigate} = useContext(Appcontext)
  const payment = async (planId) => {
    try {
      if (!user) {
        toast.info("Please log in to purchase a plan.");
        setShowLogin(true);
        return;
      }
  
      console.log("Sending request to backend for plan:", planId);
  
      // Send API request to backend with userId and planId
      const { data } = await axios.post(
        'http://localhost:4000/api/user/pay-stripe',
        { userId: user._id, planId },
        { headers: { token } }
      );
  
      // Redirect to Stripe session if successful
      if (data.success) {
        const { session_url } = data;
        console.log("Redirecting to Stripe session:", session_url);
        window.location.replace(session_url);
      }
      // navigate("/")
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };
  

  return (
    <motion.div
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} 
    
    className='min-h-[80vh] text-center pt-14 mb-10 '>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>
      <div className='flex flex-wrap justify-center gap-6 text-left '>
        {plans.map((item,index)=>(
          <div className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500' key={index}>
            <img width={40} src={assets.logo_icon} alt="" srcset="" />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6 '> <span className='text-3xl font-medium'>${item.price} </span>/ {item.credits} credits</p>
            <button onClick={()=>payment(item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>{user ? 'Purchase' : 'Get Started'}</button>

          </div>
        ))}
      </div>

         
    </motion.div>
  )
}

export default BuyCredit
