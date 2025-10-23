import React from 'react'
import BlurBackground from './ui/BlurBackground'
import { ArrowDown, Check } from 'lucide-react'

const features = [
  "Personalized Roadmap",
  "100% Free for Everyone",
  "Learn by Doing (with Quests)"
];

export default function Hero() {
  return (
    <section className='relative h-screen flex justify-center'>
      <div className='pointer-events-none'>
      <BlurBackground />
      </div>

      <div className='text-center mt-20 md:mt-20 lg:mt-32 2xl:mt-48'>
      <h1 className='text-3xl  md:text-3xl lg:text-4xl 2xl:text-5xl font-bold pb-10'>
        Learn Programming & Algorithms Smarter with AI
      </h1>
      <p className='pb-10 xl:text-xl'>
        Dive into beginner-friendly programming and algorithm courses uniquely crafted for you 
        <br />
        with the power of AI.
      </p>
      <button 
      type="button"
      aria-label="Get started for free"
      className='px-7 py-4 2xl:px-8 2xl:py-5 2xl:text-xl shadow-xl bg-primary font-bold rounded-full text-white hover:bg-primary hover:opacity-90 transition-opacity duration-300 ease-in-out cursor-pointer'>
        Get Started Free
      </button>
      {/* // TODO: Fix the size of the md screens 
       */}

      <ul className='hidden 
          sm:flex sm:flex-col sm:space-y-5 
          md:flex-row md:space-y-0 md:space-x-10 
          items-center justify-center pt-8 font-semibold 2xl:text-xl'>

        {/* <li className='flex gap-2 pr-2 md:pr-0 lg:pr-0'>
          <Check color='white' 
          className='px-0.5 py-0.5 bg-primary rounded-full'/>
          Personalized Roadmap
          </li> */}

          {features.map((feature, index) =>(
            <li key={index} className='flex gap-2'>
              <Check className='px-0.5 py-0.5 bg-primary rounded-full text-white'/>
              {feature}
            </li>
          ))}
      </ul>

      <div className=' mt-6 flex flex-col items-center lg:mt-20  '>
        <p className='mb-2'>Scroll to explore</p>
        <ArrowDown className='animate-bounce'/>
      </div>
      </div>
    </section>
  )
}
