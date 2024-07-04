import { motion } from "framer-motion";
import { images } from "../constants";


const HeroCenter = () => {
  return (
    <>
      <motion.div className="creative">
        <h1>
          <div className="overflowHider">PLANT</div>

          <div className="overflowHider">PATHOLOGIST</div>
        </h1>

        <h2>
          <div className="overflowHider">PLANT</div>

          <div className="overflowHider">PATHOLOGIST</div>
        </h2>

        <h3>
          <div className="overflowHider">PLANT</div>

          <div className="overflowHider">PATHOLOGIST</div>
        </h3>
        
        <img 
          src={images.leaf1}
          alt="leaf image of orange color"
        />
      </motion.div>
    </>
  );
};

export default HeroCenter;
