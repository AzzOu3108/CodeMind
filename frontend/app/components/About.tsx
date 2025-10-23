import React from 'react'
import BlurBackground from './ui/BlurBackground'
import AboutChartCard from './cards/AboutChartCard'

export default function About() {
  return (
    <section
    id='about'
    className='relative min-h-screen flex-col items-center justify-center md:scroll-m-28'
    >
      <div className='pointer-events-none'>
        <BlurBackground width={902} height={400}/>
      </div>

     <div className='mt-28 grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0 md:gap-24 '>
      <div className='text-center space-y-6 md:text-left md:order-2 '>
        <h1 className='text-3xl font-bold'>
          About <br />
          Code
          <span className='text-primary'>Mind</span>
        </h1>
        <p className=''>
          AI Learn helps beginners master programming and algorithms with 
          personalized, AI-generated courses. Whether you’re switching 
          careers or starting fresh, we make learning simple, friendly,
          and effective.
        </p>
      </div>

      <div className='md:order-1'>
        <AboutChartCard />
      </div>
     </div>
     
     <div className="mt-12 md:mt-24 text-center">
      <button 
      type="button"
      aria-label="Get started for free"
      className=' px-6 py-4 2xl:px-7 2xl:py-5 2xl:text-xl shadow-xl bg-primary font-bold rounded-full text-white hover:bg-primary hover:opacity-90 transition-opacity duration-300 ease-in-out cursor-pointer'>
        Join Us Now
      </button>
      </div>
    </section>
  )
}
