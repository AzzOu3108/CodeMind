"use client"

import { LaptopIcon, LockSimpleOpenIcon } from '@phosphor-icons/react'
import { Map, WorkflowIcon } from 'lucide-react'
import React, { memo } from 'react'
import { motion } from 'framer-motion'
import Cards from './Cards'

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const features = [
  {
    title: "AI-Personalized Roadmap",
    description: "Get a customized learning path tailored to your goals and skill level with AI.",
    icon: <Map size={28} />,
  },
  {
    title: "Totally Free",
    description: "No subscriptions. No paywalls. Just completely free access to high-quality programming education",
    icon: <LockSimpleOpenIcon size={28} />,
  },
  {
    title: "Learn Anytime, Anywhere",
    description: "Access your courses anytime, on any device. Your progress is synced everywhere.",
    icon: <LaptopIcon size={30} />,
  },
  {
    title: "Algorithm Mastery",
    description: "Learn algorithms and data structures with simple visuals, real examples, and clear AI guidance.",
    icon: <WorkflowIcon size={28} />,
  },
]

const FeatureCard = memo(({ feature, index }: { feature: typeof features[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 60 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, ease: SPRING, delay: 0.4 + index * 0.1 }}
  >
    <Cards
      title={feature.title}
      description={feature.description}
      icon={feature.icon}
      iconBackground={true}
      className="h-full justify-between"
    />
  </motion.div>
))

FeatureCard.displayName = "FeatureCard"

export default function FeatureCards() {
  return (
    <div className='md:flex md:justify-end md:absolute md:top-10'>
      <div className='w-full md:w-3/5 grid gap-6 grid-cols-2 auto-rows-auto'>
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </div>
  )
}