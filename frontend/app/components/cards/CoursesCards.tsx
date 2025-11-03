import React from 'react'
import Cards from './Cards'

const courses = [
  {
    title: "Python Basics",
    description: "Learn Python from scratch with easy, AI-guided lessons perfect for beginners and career switchers.",
    icon: <img src="/assets/python-svgrepo-com.svg" alt="Python" className="w-10 h-10" />
  },
  {
    title: "Backend with Node.js",
    description: "Build fast, scalable backend applications using JavaScript and modern development practices.",
    icon: <img src="/assets/nodejs-icon-logo-svgrepo-com.svg" alt="Node.js" className="w-10 h-10" />
  },
  {
    title: "JavaScript Essentials",
    description: "Understand the language of the web and start building interactive websites step-by-step.",
    icon: <img src="/assets/javascript-svgrepo-com.svg" alt="JavaScript" className="w-10 h-10" />
  }
];

export default function CoursesCards() {
  return (
    <div className="mt-10">
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, index) => {
          const isLast = index === courses.length - 1
          const isOdd = courses.length % 2 !== 0

          return (
            <Cards
              key={index}
              title={course.title}
              description={course.description}
              icon={course.icon}
              iconBackground={false}
              className={`p-10 mt-11 ${
                isLast && isOdd ? "md:col-span-2 md:col-start-1 lg:col-span-1 lg:col-start-auto mx-auto" : ""
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}