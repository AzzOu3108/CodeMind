import React from 'react'
import BlurBackground from './ui/BlurBackground'
import CoursesCards from './cards/CoursesCards'

export default function Courses() {
  return (
    <section 
    id='courses'
    className='relative min-h-screen scroll-m-5'>
      <div className='pointer-events-none'>
        <BlurBackground width={902} height={369}/>
      </div>
      <div className='flex flex-col justify-center items-center text-center space-y-4 mt-28'>
        <h1 className='text-3xl font-bold'>
          Explore Our Courses
        </h1>
        <p>
          Beginner-friendly programming courses designed to help you grow 
          <br />
          from basics to advanced skills.
        </p>
      </div>

      <div>
        <CoursesCards />
      </div>

      <div className='flex justify-center mt-10'>
      <button 
      type="button"
      aria-label="Get started for free"
      className=' px-6 py-4 2xl:px-7 2xl:py-5 2xl:text-xl shadow-xl bg-primary font-bold rounded-full text-white hover:bg-primary hover:opacity-90 transition-opacity duration-300 ease-in-out cursor-pointer'>
        Explore Courses
      </button>
      </div>
      
    </section>
  )
}
