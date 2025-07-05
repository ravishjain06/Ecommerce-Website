import React, { useEffect, useState, useRef } from 'react'
import HeroSection from './HeroSection'
import FaishonCard from './FaishonCard'
import NewArrival from './NewArrival'

import MenCategory from './MenCategory'
import WomenCategory from './WomenCategory'
import TopBrand from './TopBrand'
import Limelight from './Limelight'
import { FaAngleUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);
  const [footerActive, setFooterActive] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for Footer
    const footer = document.querySelector("footer");
    let observer;
    if (footer && buttonRef.current) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          setFooterActive(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0.1,
        }
      );
      observer.observe(footer);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (observer && footer) observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`
        fixed z-50 bottom-8 right-8 rounded-full shadow-lg border
        transition-all duration-300
        ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        ${footerActive
          ? "bg-white border-gray-300 text-black"
          : "bg-black border-gray-900 text-white hover:bg-gray-800"}
        w-9 h-9 flex items-center justify-center text-lg
      `}
      style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)" }}
    >
      <FaAngleUp />
    </button>
  );
};

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FaishonCard />
      <NewArrival />
      
      <MenCategory />
      <WomenCategory />
      <TopBrand />
      
      <Limelight />
     
    </div>
  )
}

export default Home