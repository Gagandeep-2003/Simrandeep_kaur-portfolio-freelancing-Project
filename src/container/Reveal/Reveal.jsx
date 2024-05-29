import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

import "./Reveal.css";


const Reveal = ({ children, width = "fit-content", backgroundColor = "#C7DBCC" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); //to do the animation when we scroll we use useInView hook and to do it once only we set it to true

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      //Fire the animation
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView]);
  return (
    <div
      ref={ref}
      className="reveal-main-div"
      style={{ width: width === "fit-content" ? "fit-content" : "100%" }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls} //changing it to visible on scroll using usInView hook
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      {/* todo add slide div thing.. */}
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="reveal-animation "
        style={{ backgroundColor: backgroundColor }}
      ></motion.div>
    </div>
  );
};

export default Reveal;
