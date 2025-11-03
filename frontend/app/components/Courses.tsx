import React from 'react'
import BlurBackground from './ui/BlurBackground'
import CoursesCards from './cards/CoursesCards'
import Button from './ui/Button'
import Link from 'next/link'

export default function Courses() {
  return (
    <section 
      id='courses'
      className='relative min-h-screen scroll-m-5'>
      <div className='pointer-events-none absolute inset-0 z-0'>
        <BlurBackground width={902} height={369}/>
      </div>

      <div className='flex flex-col justify-center items-center text-center space-y-4 mt-28 relative z-10'>
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
      <Button
      type="button"
      aria-label="Explore Courses"
      size='lg'
      className='shadow-xl font-bold'>
        <Link href="/auth/signup">
        Explore Courses
        </Link>
      </Button>
      </div>
      
    </section>
  )
}
