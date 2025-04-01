import React, { useContext }  from 'react'
import { assets } from '../assets/assets'
import { delay, motion } from "motion/react";
import {Appcontext} from '../context/Appcontext'

const GenerateBtn = () => {
      const{user,setShowLogin,navigate} = useContext(Appcontext);
      
      const onClinkHandler = ()=>{
          if(user){
              navigate('/result')
          }
          else{
              setShowLogin(true)
          }
  
  
      }


    
  return (
    <motion.div className='flex flex-col items-center justify-center my-20 py-12 '
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} >
        <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'>See the magic. Try now</h1>
                <button
                onClick={onClinkHandler}
                
                className=' sm:text-lg text-white bg-black w-auto mt-8 px-10 py-2.5 flex items-center gap-2 rounded-full hover:scale-105 transition-all duration-500'>Generate Image 
                    <img className='h-6' src={assets.star_group} alt="" srcset="" />
                </button>
      
    </motion.div>
  )
}

export default GenerateBtn
