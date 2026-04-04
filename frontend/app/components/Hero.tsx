"use client"

import React from 'react'
import { motion } from 'framer-motion'
import BlurBackground from './ui/BlurBackground'
import { ArrowDown, Check } from 'lucide-react'
import Button from './ui/Button'
import Link from 'next/link'

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: SPRING },
})

const features = [
  "Personalized Roadmap",
  "100% Free for Everyone",
  "Learn by Doing (with Quests)",
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen flex justify-center"
    >
      <div className="pointer-events-none">
        <BlurBackground />
      </div>

      <div className="text-center z-10 mt-20 md:mt-20 lg:mt-32 2xl:mt-48">

        {/* Heading */}
        <motion.h1
          {...fadeUp(0)}
          className="text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold pb-10"
        >
          Learn Programming & Algorithms Smarter with AI
        </motion.h1>

        {/* Subheading */}
        <motion.p {...fadeUp(0.15)} className="pb-10 xl:text-xl">
          Dive into beginner-friendly programming and algorithm courses uniquely crafted for you
          <br />
          with the power of AI.
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
            size="lg"
            className="shadow-xl font-bold"
          >
            <Link href="/auth/signup">Get Started Free</Link>
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