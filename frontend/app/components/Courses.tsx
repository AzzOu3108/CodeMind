"use client"

import React from 'react'
import { motion } from 'framer-motion'
import BlurBackground from './ui/BlurBackground'
import CoursesCards from './cards/CoursesCards'
import Button from './ui/Button'
import Link from 'next/link'

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const slideUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { delay, duration: 0.6, ease: SPRING },
})

export default function Courses() {
  return (
    <section
      id='courses'
      className='relative min-h-screen scroll-m-5 px-5 lg:px-32 sm:px-20'>
      <div className='pointer-events-none absolute inset-0 z-0'>
        <BlurBackground width={902} height={369} />
      </div>

      <div className='flex flex-col justify-center items-center text-center space-y-4 mt-28 relative z-10'>
        <motion.h1 {...slideUp(0)} className='text-3xl font-bold'>
          Explore Our Courses
        </motion.h1>

        <motion.p {...slideUp(0.12)}>
          Beginner-friendly programming courses designed to help you grow
          <br />
          from basics to advanced skills.
        </motion.p>
      </div>

      <div className='mt-12'>
        <CoursesCards />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.1, duration: 0.5, ease: SPRING }}
        className='flex justify-center mt-12'
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            aria-label="Explore Courses"
            size='lg'
            className='shadow-xl font-bold'
          >
            <Link href="/auth/signup">
              Explore Courses
            </Link>
          </Button>
        </motion.div>
      </motion.div>

    </section>
  )
}