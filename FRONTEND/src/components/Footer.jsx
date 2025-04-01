import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20'>
        <img width={150} src={assets.logo} alt="" srcset="" />
        <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500   max-sm:hidden'>Copyright @imagifyron.dev | All right reserved.</p>
        <div className='flex gap-2'>
            <img src={assets.facebook_icon} width={35} alt="" srcset="" />
            <img src={assets.instagram_icon} width={35} alt="" srcset="" />
            <img src={assets.twitter_icon} width={35} alt="" srcset="" />
        </div>
      
    </div>
  )
}

export default Footer
