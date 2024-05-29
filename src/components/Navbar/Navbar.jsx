import React, { useState, useEffect, useRef } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { useLenis } from "@studio-freight/react-lenis";
import { gsap } from 'gsap';
import "./Navbar.css";
import gagancv from "../../constants/cv"
import simrancv from "../../constants/cv";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const lenis = useLenis();
  const navLinksRef = useRef([]);

  useEffect(() => {
    const t1 = gsap.timeline();

    // Fade in with bounce animation
    t1.from(navLinksRef.current, {
      duration: 1,
      opacity: 0,
      y: -50,
      stagger: 0.2,
      ease: "bounce.out",
    });
  }, []);

  return (
    <nav className="app__navbar">
      <ul className="app__navbar-links">
        {["home", "about", "projects", "skills", "contact"].map((item, index) => (
          <li
            className="app__flex p-text"
            key={`link-${item}`}
            ref={(el) => (navLinksRef.current[index] = el)}
          >
            <div></div>
            <a onClick={() => lenis.scrollTo(`#${item}`)} href={`#${item}`}>
              {item}
            </a>
          </li>
        ))}
      </ul>
      <div className="app__navbar-cv">
      
     <a href={simrancv} download="Simrandeep Kaur-CV" className="cv-link">
  Download CV
</a>


      
      </div>
      <div className="app__navbar-menu">
        <HiMenuAlt4 onClick={() => setToggle(true)} />
        <div className={`app__navbar-list ${toggle ? "active" : ""}`}>
          <HiX onClick={() => setToggle(false)} />
          <ul>
            {["home", "about", "work", "skills", "contact"].map((item, index) => (
              <li key={item}>
                <div></div>
                <a href={`#${item}`} onClick={() => setToggle(false)}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
