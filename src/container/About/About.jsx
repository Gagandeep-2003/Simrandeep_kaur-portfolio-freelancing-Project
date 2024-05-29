import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { images } from "../../constants";
import { data } from "../../data/about-data";
import "./About.css";
import Reveal from "../Reveal/Reveal";
import Tilt from "react-tilty"; 

const About = () => {
  const [abouts, setabouts] = useState([]);
  useEffect(() => {
    setabouts(data);
  }, []);

  return (
    <div className="app__about" id="about">
      <h2 className="head-text">
      Advancing <span>Plant Science</span>
        <br /> for a <span>Sustainable Future</span>
      </h2>

      <div className="app__profiles">
        {abouts.map((about, index) => (
          <Tilt>
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3, type: "tween" }}
            className="app__profile-item"
            key={about.title + index}
          >
            <img src={images[about.image]} alt={about.title} />
          <Reveal> 
            <h2 className="bold-text" style={{ marginTop: 20 }}>
              {about.title}
            </h2>
            </Reveal>
            <Reveal>
            <p className="p-text" style={{ marginTop: 10 }}>
              {about.description}
            </p>
            </Reveal>
          </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  );
};

export default About;
