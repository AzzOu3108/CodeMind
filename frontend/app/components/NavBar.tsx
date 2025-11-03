import { HeadCircuitIcon } from "@phosphor-icons/react"
import { motion,AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"
import { useState } from "react"
import Button from "./ui/Button"
import Link from "next/link"

export default function NavBar() {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <nav className="w-full mx-auto mt-6 ">
      <div className="flex items-center justify-between">

        {/* lOGO */}
      <div className="flex md:flex-row items-center">
        <div className="text-[35px] 2xl:text-[45px]">
          <HeadCircuitIcon  />
        </div>
        <h1 className="font-bold text-xl pt-2 2xl:text-2xl">
          Code<span className="text-primary">Mind</span>
        </h1>
      </div>

      {/* hamburger button */}
      <button 
      className="md:hidden"
      onClick={()=> setOpen(!open)}
      aria-label="Toggle menu"
      >
        <Menu size={28}/>
      </button>


       <ul className="hidden md:flex space-x-9 pt-2 font-semibold 2xl:text-xl">
          <li><a href="#features">Features</a></li>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#about">About</a></li>
        </ul>

      <div className="hidden md:flex pt-2 font-bold space-x-4 2xl:text-xl">
        
        <button type="button" className="hover:text-primary cursor-pointer">
          <Link href="/auth/login">Login</Link>
        </button>
        
         <Button type="button">
          <Link href="/auth/signup">Sign Up</Link>
         </Button>
      </div>

      </div>

       {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden md:static"
            onClick={() => setOpen(false)} // closes menu if background clicked
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-16 left-1/2 -translate-x-1/2 
                         bg-white rounded-lg p-6 shadow-lg 
                         flex flex-col items-center space-y-3 font-semibold w-3/4"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking menu
            >
              <a href="#features"
              onClick={() => setOpen(false)}
              className="block"
              >
                Features
              </a>

              <a href="#courses"
              onClick={() => setOpen(false)}
              className="block"
              >
                Courses
              </a>
              <a href="#about"
              onClick={() => setOpen(false)}
              className="block">
                About
              </a>

              <div className="flex space-x-4 font-bold pt-2 pl-10">
                <button className="hover:text-primary cursor-pointer">
                  <Link href="/auth/login">Login</Link>
                </button>
                <Button type="button">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
