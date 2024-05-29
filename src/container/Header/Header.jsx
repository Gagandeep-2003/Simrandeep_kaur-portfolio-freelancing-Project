import { useRef } from "react";
import { motion } from "framer-motion";
import { images } from "../../constants";

import { hackerEffect } from "../../constants";
import HeroCenter from "../../components/HeroCenter";
import "./Header.css";

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

const Header = () => {
  const name = useRef();
  const heading = useRef();

  return (
    <div className="app__header " id="home">
      <header className="app__flex">
        <HeroCenter />
        <motion.div
          className="app__header-info"
          whileInView={{ x: [-100, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className="badge-cmp app-flex"
            onMouseEnter={() => {
              hackerEffect({ target: name.current });
            }}
          >
            <span>👋</span>
            <div style={{ marginLeft: 20 }}>
              <p className="p-text" ref={heading}>
                Hello, I'am
              </p>
              <h1 className="head-text" ref={name} data-text="Simran">
                Simran
              </h1>
            </div>
          </div>

          <div className="tag-cmp app-flex">
            <p className="p-text">GRA at University of Georgia</p>
            <p className="p-text">Molecular Biologist</p>
            <p className="p-text">Researcher</p>
          </div>
        </motion.div>
        <motion.div
          variant={scaleVariants}
          whileInView={scaleVariants.whileInView}
          className="app__header-circles"
        >
          {[images.molecularBiology, images.rProgramming, images.dataAnalysis].map((circle, index) => (
            <div className="circle-cmp app__flex" key={`circle-${index}`}>
              <img src={circle} alt="circle" />
            </div>
          ))}
        </motion.div>
      </header>
    </div>
  );
};

export default Header;
