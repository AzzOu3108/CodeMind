"use client"

import { motion, AnimatePresence, easeInOut } from "framer-motion"
import { Menu } from "lucide-react"
import { useState } from "react"
import Button from "./ui/Button"
import Link from "next/link"
import Logo from "./ui/Logo"

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1]

const slideDown = (delay: number) => ({
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay, duration: 0.5, ease: SPRING },
})

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#courses",  label: "Courses"  },
  { href: "#about",    label: "About"    },
]

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      className="relative pb-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: SPRING }}
        style={{ originX: 0.5 }}
      />
    </a>
  )
}

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full mx-auto mt-6">
      <div className="flex items-center justify-between">

        <motion.div {...slideDown(0)}>
          <Logo />
        </motion.div>

        <motion.button
          {...slideDown(0.1)}
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={28} />
        </motion.button>

        <ul className="hidden md:flex space-x-9 pt-2 font-semibold 2xl:text-xl">
          {NAV_LINKS.map((link, i) => (
            <motion.li key={link.href} {...slideDown(0.15 + i * 0.08)}>
              <NavLink href={link.href} label={link.label} />
            </motion.li>
          ))}
        </ul>

        <div className="hidden md:flex pt-2 font-bold space-x-4 2xl:text-xl">
          <motion.div {...slideDown(0.38)}>
            <button
              type="button"
              className="pt-2 hover:text-primary cursor-pointer transition-colors duration-200"
            >
              <Link href="/auth/login">Login</Link>
            </button>
          </motion.div>

          <motion.div
            {...slideDown(0.46)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Button type="button">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </motion.div>
        </div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: SPRING }}
              className="absolute top-16 left-1/2 -translate-x-1/2
                         bg-white rounded-lg p-6 shadow-lg
                         flex flex-col items-center space-y-3 font-semibold w-3/4"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.3, ease: easeInOut }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                className="flex space-x-4 font-bold pt-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3, ease: easeInOut }}
              >
                <button className="hover:text-primary cursor-pointer">
                  <Link href="/auth/login">Login</Link>
                </button>
                <Button type="button">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}