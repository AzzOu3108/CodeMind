"use client"

import { motion, AnimatePresence, easeInOut } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Logo from "./ui/Logo"

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const slideDown = (delay: number) => ({
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay, duration: 0.5, ease: SPRING },
})

const NAV_LINKS = [
  { href: "#hero",     label: "Home"     },
  { href: "#features", label: "Features" },
  { href: "#courses",  label: "Courses"  },
  { href: "#about",    label: "About us" },
]

// ── Per-link pill with hover + active state ──────────────────────────────────
function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const highlighted = active || hovered

  return (
    <a
      href={href}
      onClick={onClick}
      className="relative inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold
                 transition-colors duration-150 select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated pill background */}
      <motion.span
        className="absolute inset-0 rounded-full bg-white/80 shadow-sm"
        initial={false}
        animate={{ opacity: highlighted ? 1 : 0, scale: highlighted ? 1 : 0.92 }}
        transition={{ duration: 0.35, ease: SPRING }}
      />

      <span
        className={`relative z-10 transition-colors duration-150 ${
          highlighted ? "text-gray-800" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </a>
  )
}

// ── Main Navbar ──────────────────────────────────────────────────────────────
export default function NavBar() {
  const [open, setOpen]           = useState(false)
  const [activeIndex, setActive]  = useState(0)   // "Home" is active by default

  // Optional: auto-highlight based on scroll position
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id)
            if (idx !== -1) setActive(idx)
          }
        })
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="w-full pt-4 px-4 sm:px-6 sticky top-0 z-50">

      {/* ── Centering wrapper: keeps navbar ~860px wide on any screen ─── */}
      <div className="max-w-[860px] mx-auto">

      {/* ── Pill container ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between
                   bg-[#ede8ff]/60 backdrop-blur-md
                   px-4 py-2
                   border border-[#d8caff]/70
                   rounded-full"
      >
        {/* Logo */}
        <motion.div {...slideDown(0)}>
          <Logo />
        </motion.div>

        {/* Hamburger (mobile) */}
        <motion.button
          {...slideDown(0.1)}
          className="md:hidden p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.88 }}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </motion.button>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link, i) => (
            <motion.li key={link.href} {...slideDown(0.15 + i * 0.08)}>
              <NavLink
                href={link.href}
                label={link.label}
                active={activeIndex === i}
                onClick={() => setActive(i)}
              />
            </motion.li>
          ))}
        </ul>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          <motion.div {...slideDown(0.38)}>
            <Link
              href="/auth/login"
              className="px-6 py-2.5 text-base font-bold text-gray-700
                          hover:text-purple-700 transition-colors duration-200"
            >
              Login
            </Link>
          </motion.div>

          <motion.div
            {...slideDown(0.46)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-1.5
                            bg-primary hover:bg-primary/85
                            text-white text-base font-bold
                           rounded-full shadow-md shadow-purple-300/40
                           transition-all duration-300"
            >
              Sign up
            </Link>
          </motion.div>
        </div>
      </div>
      </div>{/* end centering wrapper */}

      {/* ── Mobile slide-down menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              key="panel"
              initial={{ y: -16, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: SPRING }}
              className="absolute top-16 left-1/2 -translate-x-1/2
                         bg-white/95 backdrop-blur-sm
                         rounded-2xl p-5 shadow-xl
                         flex flex-col items-center gap-2
                         font-semibold w-3/4 max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => { setActive(i); setOpen(false) }}
                  className={`w-full text-center px-4 py-2.5 rounded-xl text-sm
                              transition-colors duration-150 ${
                                activeIndex === i
                                  ? "bg-purple-100 text-purple-700"
                                  : "hover:bg-gray-50 text-gray-700"
                              }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.3, ease: easeInOut }}
                  whileTap={{ scale: 0.96 }}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                className="flex items-center gap-3 pt-2 w-full justify-center border-t border-gray-100"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3, ease: easeInOut }}
              >
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-base font-bold text-gray-700
                             hover:text-purple-700 transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 bg-primary hover:bg-primary/85
                              text-white text-base font-bold rounded-full
                              transition-all duration-300"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}