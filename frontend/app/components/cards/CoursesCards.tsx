"use client"

import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import Cards from './Cards'

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const courses = [
  {
    title: "Python Basics",
    description: "Learn Python from scratch with easy, AI-guided lessons perfect for beginners and career switchers.",
    icon: <Image src="/assets/python-svgrepo-com.svg" alt="Python" width={40} height={40} className="w-10 h-10" />
  },
  {
    title: "Backend with Node.js",
    description: "Build fast, scalable backend applications using JavaScript and modern development practices.",
    icon: <Image src="/assets/nodejs-icon-logo-svgrepo-com.svg" alt="Node.js" width={40} height={40} className="w-10 h-10" />
  },
  {
    title: "JavaScript Essentials",
    description: "Understand the language of the web and start building interactive websites step-by-step.",
    icon: <Image src="/assets/javascript-svgrepo-com.svg" alt="JavaScript" width={40} height={40} className="w-10 h-10" />
  }
]

export default function CoursesCards() {
  return (
    <div className="mt-10">
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, index) => {
          const isLast = index === courses.length - 1
          const isOdd = courses.length % 2 !== 0

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: SPRING }}
              className={isLast && isOdd ? "md:col-span-2 md:col-start-1 lg:col-span-1 lg:col-start-auto mx-auto" : ""}
            >
              <Cards
                title={course.title}
                description={course.description}
                icon={course.icon}
                iconBackground={false}
                className="p-10 mt-11"
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}