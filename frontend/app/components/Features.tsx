"use client"

import { Check } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import FeatureCards from './cards/FeatureCards'

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const scrollFadeUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { delay, duration: 0.6, ease: SPRING },
})

const FEATURES = [
  "Learn at Your Own Pace",
  "100% Free and Beginner Friendly",
  "AI-Powered Custom Courses",
]

export default function Features() {
  return (
    <section
      id="features"
      className="relative min-h-screen"
    >
      <div className="absolute inset-0 h-full w-full bg-primary -z-10 opacity-20 blur-xl md:blur-[2px]
        md:h-10/12 md:-translate-x-1/2" />

      <div className="space-y-6 pt-6 text-center md:text-start">

        <motion.h2
          {...scrollFadeUp(0)}
          className="font-bold text-primary text-xl md:text-2xl"
        >
          Features
        </motion.h2>

        <motion.h1
          {...scrollFadeUp(0.1)}
          className="font-bold text-3xl md:text-4xl"
        >
          Why Choose <br />
          Code<span className="text-primary">Mind</span>
        </motion.h1>

        <motion.p {...scrollFadeUp(0.2)}>
          Beginner-friendly, AI-<br />personalized programming <br /> courses that help you learn faster <br /> and smarter
          <span className="font-bold"> — for free.</span>
        </motion.p>

        <ul className="space-y-5 flex flex-col items-center justify-center font-medium md:items-start">
          {FEATURES.map((feature, i) => (
            <motion.li
              key={i}
              className="flex gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: SPRING }}
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.35, ease: SPRING }}
              >
                <Check
                  color="white"
                  className="px-0.5 py-0.5 bg-primary rounded-full"
                />
              </motion.span>
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="pt-12">
        <FeatureCards />
      </div>
    </section>
  )
}