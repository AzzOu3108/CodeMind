"use client"

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
    <div className="px-5 lg:px-32 sm:px-20">
      <NavBar />
      <main>
      <Hero />
      <Features />
      <Courses />
      <TechStack />
      <About />
      </main>
      <Footer />
    </div>
  );
}
