"use client"

import React from 'react'
import { motion } from 'framer-motion'
import BlurBackground from './ui/BlurBackground'
import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import Button from './ui/Button'
import Link from 'next/link'
import Image from 'next/image'

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: SPRING },
})

const features = [
  "100% Free",
  "Personalized Roadmap",
  "Learn by Doing",
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen flex justify-center"
    >
      <div className="pointer-events-none">
        <Image
        src="/assets/bg-hero-section.svg"
        alt=""
        fill
        className="object-cover -z-30"
        priority
      />
      </div>

      <div className="text-center z-10 mt-20 md:mt-20 lg:mt-32 2xl:mt-48">

        {/* Heading */}
        <p className='text-primary pb-4 font-semibold'>2,000+ learners!</p>
        <motion.h1
          {...fadeUp(0)}
          className="text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold pb-10"
        >
          From Beginner to Pro
          <br />
          Learn Programming with AI
        </motion.h1>

        {/* Subheading */}
        <motion.p {...fadeUp(0.15)} className="pb-6 sm:pb-10 text-sm sm:text-base xl:text-xl text-gray-600">
          Practice, build, and improve with an AI that adapts to your level
        </motion.p>

        {/* CTA Button */}
        <motion.div
          {...fadeUp(0.28)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Button
            type="button"
            aria-label="Get started free"
            size="md"
            className="shadow-xl font-semibold"
          >
            <Link href="/auth/signup" className="inline-flex items-center gap-2">
              Start Free Learning <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
          </Button>
        </motion.div>

        {/* Feature pills — each one staggers in */}
        <ul className="hidden
            sm:flex sm:flex-col sm:space-y-5
            md:flex-row md:space-y-0 md:space-x-10
            items-center justify-center pt-8 font-semibold 2xl:text-xl">
          {features.map((feature, i) => (
            <motion.li
              key={i}
              className="flex gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: SPRING }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.35, ease: SPRING }}
              >
                <Check className="px-0.5 py-0.5 bg-primary rounded-full text-white" />
              </motion.span>
              {feature}
            </motion.li>
          ))}
        </ul>

        {/* Scroll hint */}
        <motion.div
          {...fadeUp(0.75)}
          className="mt-6 flex flex-col items-center lg:mt-20"
        >
          <p className="mb-2">Scroll to explore</p>
          <ArrowDown className="animate-bounce" />
        </motion.div>

      </div>
    </section>
  )
}