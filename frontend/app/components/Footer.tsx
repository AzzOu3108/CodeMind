import { HeadCircuitIcon } from '@phosphor-icons/react'
import React from 'react'

export default function Footer() {
  return (
    <section
    id='footer'
    className='relative h-1/2 w-screen bg-[#c9a8f195] -mx-5 sm:-mx-20 lg:-mx-32'
    >
      <div className='pt-7 px-12'>
        

      <div className='flex flex-col md:flex-row md:justify-between md:items-start '>
      <div className='flex flex-col items-center md:items-start mb-6 md:mb-0'>
      {/* lOGO */}
      <div className="flex items-center ">
        <div className="text-[35px] 2xl:text-[45px]">
          <HeadCircuitIcon  />
        </div>
        <h1 className="font-bold text-xl pt-2 2xl:text-2xl">
          Code<span className="text-primary">Mind</span>
        </h1>
      </div>
      <p className='py-4 text-center md:text-left'>
        AI-powered programming courses for everyone.
      </p>
       </div>
       
       <div>
       <div className='grid grid-cols-2 text-center gap-6 pb-3 lg:grid-cols-3'>

      <div className="text-center">
        <p className="font-semibold">Quick Links</p>
        <ul className="text-left inline-block list-disc pl-5">
         <li>
          <a href="#hero">Home</a>
          </li>
         <li>
          <a href="#features">Features</a>
         </li>
         <li>
          <a href="#courses">Courses</a>
         </li>
         <li>
          <a href="#about">About</a>
         </li>
        </ul>
      </div>

      <div className='text-left pl-9'> 
       <p className='font-semibold'>Legal</p>
       <ul className='text-left inline-block list-disc pl-6'>
        <li className=''>Privacy Policy</li>
        <li className=''>Terms of Service</li>
       </ul>
       </div>
      

      <div className='flex flex-col items-center justify-center col-span-2 lg:col-auto'>
        <p className='font-semibold'>Follow Us</p>
        <ul className='flex justify-center space-x-5 '>
          <li>
            <a href="https://www.linkedin.com/">
              <img src="/assets/linkedin-color-svgrepo-com.svg" alt="linkedin" className="w-5 h-5"/>
            </a>
          </li>
          <li>
            <a href="https://github.com/">
              <img src="/assets/github-142-svgrepo-com.svg" alt="github" className="w-5 h-5"/>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/">
              <img src="/assets/instagram-1-svgrepo-com.svg" alt="instagram" className="w-5 h-5"/>
            </a>
          </li>
        </ul>
      </div>
      </div>
      </div>
      </div>

      <div className="w-full h-[1px] bg-black my-4"></div>
      <p className='pb-4 text-center'>Copyright © 2025 CodeMind. All the right reserved </p>
      </div>

    </section>
  )
}
