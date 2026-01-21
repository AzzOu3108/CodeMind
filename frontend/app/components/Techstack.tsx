"use client"

import { useEffect, useRef, useState } from "react"

const technologies = [
  { name: "MySQL" },
  { name: "MongoDB" },
  { name: "TypeScript" },
  { name: "Swift" },
  { name: "JavaScript" },
  { name: "Next.js" },
]

export default function TechStack() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-12 border-y border-gray-300 bg-muted/30 mt-10" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className={`flex items-center gap-2 text-muted-foreground transition-all duration-500 hover:text-foreground hover:scale-110 ${
                isVisible ? "opacity-60 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
