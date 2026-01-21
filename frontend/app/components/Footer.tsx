import { HeadCircuitIcon } from '@phosphor-icons/react'
import { Github, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <section
    id='footer'
    className='relative h-1/2 w-screen bg-[#c9a8f110] -mx-5 sm:-mx-20 lg:-mx-32'
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
      <p className='py-4 text-center text-sm text-muted-foreground md:text-left'>
        AI-powered programming courses for everyone.
      </p>
       </div>
       
       <div>
       <div className='grid grid-cols-2 text-center gap-6 pb-3 lg:grid-cols-3'>

      <div className="text-center">
        <p className="font-semibold">Quick Links</p>
        <ul className="text-left inline-block list-disc pl-5">
         <li>
          <a href="#hero"
          className='text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block'
          >Home</a>
          </li>
         <li>
          <a href="#features"
          className='text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block'
          >Features</a>
         </li>
         <li>
          <a href="#courses"
          className='text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block'
          >Courses</a>
         </li>
         <li>
          <a href="#about"
          className='text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block'
          >About</a>
         </li>
        </ul>
      </div>

      <div className='text-left pl-9'> 
       <p className='font-semibold'>Legal</p>
       <ul className='text-left inline-block list-disc pl-6'>
        <li>
          <a href='#privacy_policy'
          className='text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block'
          >
            Privacy Policy
          </a>
        </li>
        <li>
        <a href="#terms_of_service"
        className='text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block'
        >
          Terms of Service
        </a>
        </li>
       </ul>
       </div>
      

      <div className='flex flex-col items-center  col-span-2 lg:col-auto'>
        <p className='font-semibold'>Follow Us</p>
        <div className='mt-4 flex gap-4'>
          <Link href="#"
           className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
          >
          <Linkedin className='h-5 w-5' />
          <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
          href="#"
          className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
          >
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
          </Link>
          <Link
          href="#"
          className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
          >
            <Instagram className='h-5 w-5'/>
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>
      </div>
      </div>
      </div>

      <div className="w-full h-[0.5px] bg-black my-4"></div>
      <p className='pb-4 text-center text-sm text-muted-foreground'>Copyright © 2025 CodeMind. All the right reserved </p>
      </div>

    </section>
  )
}
