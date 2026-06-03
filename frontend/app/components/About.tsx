"use client"

import React from 'react'
import { motion } from 'framer-motion'
import BlurBackground from './ui/BlurBackground'
import AboutChartCard from './cards/AboutChartCard'
import Button from './ui/Button'
import Link from 'next/link'

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function About() {
  return (
    <section
      id='about'
      className='relative min-h-screen flex-col items-center justify-center md:scroll-m-28 px-5 lg:px-32 sm:px-20'
    >
      <div className='pointer-events-none'>
        <BlurBackground width={902} height={400} />
      </div>

      <div className='relative z-10 mt-28 grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0 md:gap-24'>

        {/* Text — slides in from right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: SPRING }}
          className='text-center space-y-6 md:mt-4 md:text-left md:order-2'
        >
          <h1 className='text-3xl font-bold'>
            About <br />
            Code<span className='text-primary'>Mind</span>
          </h1>
          <p>
            AI Learn helps beginners master programming and algorithms with
            personalized, AI-generated courses. Whether you're switching
            careers or starting fresh, we make learning simple, friendly,
            and effective.
          </p>
        </motion.div>

        {/* Chart card — slides in from left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: SPRING }}
          className='md:order-1'
        >
          <AboutChartCard />
        </motion.div>

      </div>

      {/* Button — short fade up like the other sections */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.5, ease: SPRING }}
        className="mt-12 md:mt-24 text-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            aria-label="Join Us Now"
            size='md'
            className='shadow-xl font-bold'>
            <Link href="/auth/signup">
              Join Us Now
            </Link>
          </Button>
        </motion.div>
      </motion.div>

    </section>
  )
}