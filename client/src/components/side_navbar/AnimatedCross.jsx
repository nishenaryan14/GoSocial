import { motion } from "framer-motion";

const AnimatedCross = () => {
  return (
    <div className="animated-cross-container">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="25"
        height="25"
      >
        {/* Initial position of the lines */}
        <motion.line
          x1="5"
          y1="5"
          x2="19"
          y2="19"
          stroke="lavender"
          strokeWidth="2"
          initial={{ x1: 5, y1: 5, x2: 19, y2: 5 }} // Set initial position
          animate={{ x1: 19, y1: 5, x2: 5, y2: 19 }} // Set target position
          transition={{ duration: 0.5 }} // Set animation duration
        />
        <motion.line
          x1="5"
          y1="5"
          x2="19"
          y2="19"
          stroke="lavender"
          strokeWidth="2"
          initial={{ x1: 5, y1: 9, x2: 19, y2: 9 }} // Set initial position
          animate={{ x1: 5, y1: 5, x2: 19, y2: 19 }} // Set target position
          transition={{ duration: 0.5 }} // Set animation duration
        />
      </motion.svg>
    </div>
  );
};

export default AnimatedCross;
