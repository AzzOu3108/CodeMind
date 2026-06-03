"use client"

import Image from "next/image";
import NavBar from "./components/NavBar";
import Features from "./components/Features";
import Courses from "./components/Courses";
import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { useEffect } from "react";
import TechStack from "./components/Techstack";

export default function Home() {

  useEffect(()=>{
    if(window.location.hash){
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [])
  
  return (
    <div>
      <div className="relative">
        <Image
          src="/assets/bg-hero-section.svg"
          alt=""
          fill
          className="object-cover -z-10"
          priority
        />
        <NavBar />
        <main>
          <Hero />
        </main>
      </div>
      <Features />
      <Courses />
      <TechStack />
      <About />
      <Footer />
    </div>
  );
}
