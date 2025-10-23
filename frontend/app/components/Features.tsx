import { Check } from 'lucide-react'
import React from 'react'
import FeatureCards from './cards/FeatureCards'

export default function Features() {
  return (
    <section 
    id='features'
    className='relative min-h-screen'>
      
      <div className='absolute inset-0 h-full w-full bg-primary -z-10 opacity-20 blur-xl md:blur-[2px] 
     md:h-10/12 md:-translate-x-1/2'></div>

      <div className='space-y-6 pt-6 text-center md:text-start'>

      <h2 className='font-bold text-primary text-xl md:text-2xl '>
        Features
      </h2>

      <h1 className='font-bold text-3xl md:text-4xl'>
        Why Choose <br />
        Code
        <span className='text-primary'>
          Mind
        </span>
      </h1>

      <p>
        Beginner-friendly, AI-<br />personalized programming <br /> courses that help you learn faster <br /> and smarter
        <span className='font-bold'> — for free.</span> 
      </p>

      <ul className='space-y-5 flex flex-col items-center justify-center font-medium md:items-start'>

        <li className='flex gap-3'>
          <Check color='white'
          className='px-0.5 py-0.5 bg-primary rounded-full'/>
          Learn at Your Own Pace
          </li>

        <li className='flex gap-3 pl-17 md:p-0'>
          <Check color='white'
          className='px-0.5 py-0.5 bg-primary rounded-full'/>
          100% Free and Beginner Friendly
          </li>

        <li className='flex gap-3 pl-10 md:p-0'>
          <Check color='white'
          className='px-0.5 py-0.5 bg-primary rounded-full'/>
          AI-Powered Custom Courses
          </li>
      </ul>
      </div>
      <div className='pt-12'>
        <FeatureCards />
      </div>
    </section>
  )
}
